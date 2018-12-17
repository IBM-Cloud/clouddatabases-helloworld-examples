import os
from urllib.parse import urlparse
import json

from flask import Flask
from flask import render_template
from flask import request

import psycopg2

app = Flask(__name__)
port = int(os.getenv('PORT', 8000))

if 'VCAP_SERVICES' in os.environ:
    vcap_services = json.loads(os.environ['VCAP_SERVICES'])
    if 'databases-for-redis' in vcap_services:
        credentials = vcap_services['databases-for-postgresql'][0]['credentials']
        postgresql_conn = credentials['connection']['postgres']
        connection_string = postgresql_conn['composed'][0]

parsed = urlparse(connection_string)
    
conn = psycopg2.connect(
    host=parsed.hostname,
    port=parsed.port,
    user=parsed.username,
    password=parsed.password,
    sslmode='verify-full',
    sslrootcert='path/to/cert.pem',
    database='ibmclouddb')

@app.route('/')
# top-level page display, creates table if it doesn't exist
def serve_page():
    cur = conn.cursor()
    cur.execute("""CREATE TABLE IF NOT EXISTS words (
		id serial primary key,
		word varchar(256) NOT NULL,
		definition varchar(256) NOT NULL) """)
    return render_template('index.html')


@app.route('/words', methods=['PUT'])
# triggers on hitting the 'Add' button; inserts word/definition into table
def handle_words():
    cur = conn.cursor()
    
    cur.execute("""INSERT INTO words (word, definition)
        VALUES (%s, %s)""", (request.form['word'], request.form['definition']))
    conn.commit()
    
    return ('', 204)


@app.route('/words', methods=['GET'])
# queries and formats results for display on page
def display_select():
    cur = conn.cursor()
    
    # SQL query for all the rows in the table, stores rows in an object
    cur.execute("""SELECT word, definition FROM words""")
    cursor_obj = cur.fetchall()
    
    # grabs column names from the table
    labels = [column[0] for column in cur.description]
    
    # makes a list from the dict of the zip of column names and the results object
    results_list = []
    for row in cursor_obj:
        results_list.append(dict(zip(labels, row)))
    
    # makes json from the list for display on the page
    return json.dumps(results_list)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)