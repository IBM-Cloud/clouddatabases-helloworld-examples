resource "ibm_database" "mongodb" {
  resource_group_id = ibm_resource_group.resource_group.id
  name              = "mongodb-hello-world"
  service           = "databases-for-mongodb"
  plan              = "standard"
  service_endpoints = "public"
  location          = var.region
  version           = "4.4"
  adminpassword = var.admin_password

 
  timeouts {
    create = "120m"
    update = "120m"
    delete = "15m"
  }
}

output "url" {
  value = ibm_database.mongodb.connectionstrings[0].composed
}

output "password" {
  value = var.admin_password
}

output "cert" {
  value = ibm_database.mongodb.connectionstrings[0].certbase64
}