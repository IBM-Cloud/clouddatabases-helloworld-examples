# Deploying and Connecting an IBM Cloud Databases Instance

## Objectives

This tutorial guides you through the process of deploying a Cloud Databases instance and connecting it to a web front end by creating a webpage that allows visitors to input a word and its definition. These values are then stored in a database running on Cloud Databases. You install the database infrastructure by using [Terraform](https://www.terraform.io/) and your web application uses the popular [Express](https://www.terraform.io/) framework. The application can then be run locally, or by using [Docker](https://www.docker.com/).

## Getting productive

### Pre-requisites

To begin the deployment process, install some must-have productivity tools:

- You need to have an IBM Cloud account.
- Node.js and npm - to install packages from public npm registries
- Terraform - to codify and deploy infrastructure
- Optional Docker - to run your application nonlocally

### Step 1: Obtain an API key to deploy infrastructure to your account

Follow [these steps](https://cloud.ibm.com/docs/account?topic=account-userapikey&interface=ui#create_user_key) to create an IBM Cloud API key that enables Terraform to provision infrastructure into your account. You can create up to 20 API keys.

**Important** For security reasons, the API key is only available to be copied or downloaded at the time of creation. If the API key is lost, you must create a new API key.

### Step 2: Clone the project 

Clone the project from the [Cloud Databases Hello World project GitHub repository](https://github.com/IBM-Cloud/clouddatabases-helloworld-examples).

```
git clone https://github.com/IBM-Cloud/clouddatabases-helloworld-examples.git
```

### Step 3: Install the infrastructure

In this step, you deploy an instance of the database service you want to use. The GitHub repository contains folders for various Cloud Databases resources.
1. From the main GitHub project folder, navigate into the service folder of your choice, for example, mysql.
2. On your machine, create a document that is named `terraform.tfvars`, with the following fields:
```
ibmcloud_api_key = "<your_api_key_from_step_1>"
region = "<your_region>"
admin_password  = "<make_up_a_password>"
```
The `terraform.tfvars` document contains variables that you might want to keep secret so it is ignored by the GitHub repository.

3. Install the infrastructure with the following command:
```
terraform init 
terraform apply --auto-approve
```
The Terraform script outputs configuration data that is needed to run the application, so copy it into the root folder:
```
terraform output -json >../config.json
```

### Step 4: Run your app locally

1. To connect to the database from your local machine, ensure that you are in your service folder, then install the node dependencies and run the service with the following commands:

```
npm install
```
```
npm run start
```
If successful, the output shows you are connected:
```
#Connected!
#Server is listening on port 8080
```
2. Open a browser and visit http://localhost:8080. You are greeted by a welcome page with a database logo that is displayed in your browser window.

<img src="assets/image.png" alt="homepage" width="500"/>

3. To test the interface, enter a word and its definition. The data pair is added to the database and appears in a list at the bottom of the page.

<img src="assets/list.png" alt="list" width="500"/>

<br>

### Step 5 *Optional*: Run the app from a Docker container

The first step toward hosting your application from a service like [Code Engine](https://www.ibm.com/cloud/code-engine) is to containerize the app code inside a Docker container and run it from there.

1. Make sure you are logged into your Docker account. In the <directory> of the database example you are using enter the following command:

```
docker build -t database-hello-world:1.0 . 
docker run -p 8080:8080 database-hello-world:1.0
```

2. Open a browser and visit http://localhost:8080 to see the same welcome page from the previous step.

Congratulations, you've created an app with a front end that feeds data into your [IBM Cloud Databases](https://www.ibm.com/cloud/databases) deployment!

