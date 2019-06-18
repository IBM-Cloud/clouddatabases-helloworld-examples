# cloudmessages-rabbitmq-helloworld-nodejs overview

cloudmessagesrabbitmq-helloworld-nodejs is a sample IBM Cloud application which shows you how to connect to an IBM Cloud Messages for RabbitMQ service to a IBM Cloud Foundry application written in Node.js.

## Running the app on IBM Cloud

1. If you do not already have an IBM Cloud account, [sign up here][IBMCloud_signup_url]

2. [Download and install IBM Cloud CLI](https://cloud.ibm.com/docs/cli/reference/bluemix_cli/download_cli.html).

   The IBM Cloud CLI tool tool is what you'll use to communicate with IBM Cloud from your terminal or command line.

3. Connect to IBM Cloud in the command line tool and follow the prompts to log in.

    ```shell
    ibmcloud login
    ```

    **Note:** If you have a federated user ID, use the `ibmcloud login --sso` command to log in with your single sign on ID.

4. Create your message queue service.

      The message queue can be created from the command line using the `ibmcloud resource service-instance-create` command. This takes a
      service instance name, a service name, plan name and location. For example, if we wished to create a message queue service named "example-rabbitmq" and we wanted it to be a "messages-for-rabbitmq" deployment on the standard plan running in the us-south region, the command would look like this:

      ```shell
      ibmcloud resource service-instance-create example-rabbitmq messages-for-rabbitmq standard us-south
      ```
      Remember the message queue service instance name.

5. Make sure you are targeting the correct IBM Cloud Cloud Foundry org and space.

   ```shell
   ibmcloud target --cf
   ```
   
   Choose from the options provided.

6. Create a Cloud Foundry alias for the message queue service.
   
   ```shell
   ibmcloud resource service-alias-create alias-name --instance-name instance-name
   ```

   The alias name can be the same as the message queue service instance name. So, for our message queue servive created in step 4, we could do:

   ```shell
   ibmcloud resource service-alias-create example-rabbitmq --instance-name example-rabbitmq
   ```

7. Clone the app to your local environment from your terminal using the following command:

   ```shell
   git clone https://github.com/IBM-Cloud/cloudmessages-rabbitmq-helloworld-nodejs.git
   ```

8. `cd` into this newly created directory. The code for connecting to the service, and reading from and updating the message queue can be found in `server.js`. See [Code Structure](#code-structure) and the code comments for information on the app's functions. There's also a `public` directory, which contains the html, style sheets and javascript for the web app. For now, the only file you need to update is the application manifest.

9. Update the `manifest.yml` file.

   - Change the `name` value. The value you choose will be the name of the app as it appears in your IBM Cloud dashboard.
   - Change the `route` value to something unique. This will make be the base URL of your application. It should end with `.us-south.cf.appdomain.cloud`. For example `example-helloworld-nodejs.us-south.cf.appdomain.cloud`.

   Update the `service` value in `manifest.yml` to match the name of your message queue service instance name.

10. Push the app to IBM Cloud. When you push the app it will automatically be bound to the service.

  ```shell
  ibmcloud cf push
  ```

Your application is now running at host you entered as the value for the `route` in `manifest.yml`.

The node-rabbitmq-helloworld app displays the contents of a _sample_ queue. To demonstrate that the app is connected to your service, add some words to the message queue. The words are displayed as you add them, with the most recently added words displayed first.

## Code Structure

| File | Description |
| ---- | ----------- |
|[**server.js**](server.js)|Establishes a connection to the RabbitMQ message queue using credentials from VCAP_ENV and handles create and read operations on the message queue. |
|[**main.js**](public/javascripts/main.js)|Handles user input for a PUT command and parses the results of a GET command to output the contents of the RabbitMQ message queue.|

The app uses a PUT and a GET operation:

- PUT
  - takes user input from [main.js](public/javascript/main.js)
  - opens a connection to the message queue and publishes it to the exchange adding the message as a buffer

- GET
  - opens a connection to the message queues and gets the message from the `sample` queue
  - returns the response of the message queue to [main.js](public/javascript/main.js)



[messages_for_rabbitmq_url]: https://cloud.ibm.com/catalog/services/messages-for-rabbitmq
[IBMCloud_signup_url]: https://cloud.ibm.com/registration/?cm_mmc=Display-SampleApp-_-IBMCloudSampleApp-messagesforrabbitmq
