# clouddatabases-redis-helloworld-python overview

clouddatabases-redis-helloworld-python is a sample IBM Cloud application which shows you how to connect to an IBM Cloud Databases for Redis service to a IBM Cloud Foundry application written in Python 3.6.4.

## Running the app on IBM Cloud

1. If you do not already have an IBM Cloud account, [sign up here][IBMCloud_signup_url]

2. [Download and install IBM Cloud CLI](https://console.bluemix.net/docs/cli/reference/bluemix_cli/download_cli.html).

   The IBM Cloud CLI tool tool is what you'll use to communicate with IBM Cloud from your terminal or command line.

3. Connect to IBM Cloud in the command line tool and follow the prompts to log in.

    ```shell
    ibmcloud login
    ```

    **Note:** If you have a federated user ID, use the `ibmcloud login --sso` command to log in with your single sign on ID.

4. Create your database service.

      The database can be created from the command line using the `ibmcloud resource service-instance-create` command. This takes a service instance name, a service name, plan name and location. For example, if we wished to create a database service named "example-redis" and we wanted it to be a "databases-for-redis" deployment on the standard plan running in the us-south region, the command would look like this:

      ```shell
      ibmcloud resource service-instance-create example-redis databases-for-redis standard us-south
      ```
      Remember the database service instance name.

5. Make sure you are targeting the correct IBM Cloud Cloud Foundry org and space.

   ```shell
   ibmcloud target --cf
   ```
   
   Choose from the options provided.

6. Create a Cloud Foundry alias for the database service.
   
   ```shell
   ibmcloud resource service-alias-create alias-name --instance-name instance-name
   ```

   The alias name can be the same as the database service instance name. So, for our database created in step 4, we could do:

   ```shell
   ibmcloud resource service-alias-create example-redis --instance-name example-redis
   ```

7. Clone the app to your local environment from your terminal using the following command:

   ```shell
   git clone https://github.com/IBM-Cloud/clouddatabases-redis-helloworld-python.git
   ```   

8. `cd` into this newly created directory. The code for connecting to the service, and reading from and updating the database can be found in `server.py`. See [Code Structure](#code-structure) and the code comments for information on the app's functions. There's also `template` and `static` directories, which contain the html, style sheets and javascript for the web app. For now, the only file you need to update is the application manifest.

9. Make sure that you store a local copy of the databases's self-signed certificate. You'll need to go into the file `server.py` and add the location of your self-signed certificate to `ssl_ca_certs` when connecting to the database. [Install](https://console.bluemix.net/docs/databases-cli-plugin/cloud-databases-cli.html#cloud-databases) and use the IBM Cloud Databases plugin with the IBM Cloud CLI tool to get your self-signed certificate with the following command:

```shell
ibmcloud cdb cacert <database deployment name>
```

10. Update the `manifest.yml` file.

   - Change the `name` value. The value you choose will be the name of the app as it appears in your IBM Cloud dashboard.
   - Change the `route` value to something unique. This will make be the base URL of your application. It should end with `.mybluemix.net`. For example `example-helloworld-python.mybluemix.net`.

   Update the `service` value in `manifest.yml` to match the name of your database service instance name.

11. Push the app to IBM Cloud. When you push the app it will automatically be bound to the service.

  ```shell
  ibmcloud cf push
  ```

Your application is now running at host you entered as the value for the `route` in `manifest.yml`.

The python-redis-helloworld app displays the contents of an _examples_ database. To demonstrate that the app is connected to your service, add some words to the database. The words are displayed as you add them, with the most recently added words displayed first.

## Code Structure

| File | Description |
| ---- | ----------- |
|[**server.py**](server.py)|Establishes a connection to the Redis database using credentials from VCAP_ENV and handles create and read operations on the database. |
|[**main.js**](static/javascripts/main.js)|Handles user input for a PUT command and parses the results of a GET command to output the contents of the Redis database.|

The app uses a PUT and a GET operation:

- PUT
  - takes user input from [main.js](static/javascript/main.js)
  - uses the `client.query` method to add the user input to a hashed set in the Redis keyspace called _words_.

- GET
  - uses `client.query` method to retrieve the contents of the hashed set called _words_ in the Redis keyspace.
  - returns the response of the database command to [main.js](static/javascript/main.js)



[databases_for_redis_url]: https://console.bluemix.net/catalog/services/databases-for-redis/
[IBMCloud_signup_url]: https://console.bluemix.net/registration/?cm_mmc=Display-SampleApp-_-IBMCloudSampleApp-DatabasesForRedis

