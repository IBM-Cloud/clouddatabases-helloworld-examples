terraform {
  required_providers {
    ibm = {
      source = "IBM-Cloud/ibm"
      version = ">= 1.28.0"
    }
  }
}

provider "ibm" {
  ibmcloud_api_key = var.ibmcloud_api_key
  region = var.region
}

resource "ibm_resource_group" "resource_group" {
  name = "redis-hw"
}

output "resource_group_name" {
  value=ibm_resource_group.resource_group.name
}