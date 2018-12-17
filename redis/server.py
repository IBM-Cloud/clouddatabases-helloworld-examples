import os
from urllib.parse import urlparse
import json

from flask import Flask
from flask import render_template
from flask import request

import redis

app = Flask(__name__)
port = int(os.getenv('PORT', 8000))

if 'VCAP_SERVICES' in os.environ:
    vcap_services = json.loads(os.environ['VCAP_SERVICES'])
    if 'databases-for-redis' in vcap_services:
        credentials = vcap_services['databases-for-redis'][0]['credentials']
        redis_conn = credentials['connection']['rediss']
        connection_string = redis_conn['composed'][0]

parsed = urlparse(connection_string)

r = redis.StrictRedis(
    host=parsed.hostname,
    port=parsed.port,
    password=parsed.password,
    ssl=True,
    ssl_ca_certs='path/to/cert.pem',
    decode_responses=True)

@app.route('/')
# top-level page display
def serve_page():
    return render_template('index.html')

@app.route('/words', methods=['PUT'])
# triggers on hitting the 'Add' button; inserts word/definition into a hash
def handle_words():
    r.hset("words", request.form['word'], request.form['definition'])
    return ('', 204)


@app.route('/words', methods=['GET'])
# queries and formats results for display on page
def display_find():
    # query for all the words in the hash
    cursor_obj = r.hgetall('words')

    #makes two lists, one of keys and one of values
    keys_list = list(cursor_obj.keys())
    values_list = list(cursor_obj.values())

    # zips the lists of keys/values together, and makes an object of all word/definition pairs
    results_list = [{'word': word, 'definition': definition} 
        for word, definition in zip(keys_list, values_list)]
    
    # returns a json object from the object of word/definition pairs
    return json.dumps(results_list)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)