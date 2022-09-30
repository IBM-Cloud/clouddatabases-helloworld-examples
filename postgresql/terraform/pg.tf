resource "ibm_database" "postgresdb" {
  resource_group_id = ibm_resource_group.resource_group.id
  name              = "pg-hello-world"
  service           = "databases-for-postgresql"
  plan              = "standard"
  location          = var.region
  adminpassword = var.admin_password

 
  timeouts {
    create = "120m"
    update = "120m"
    delete = "15m"
  }
}

output "url" {
  value = ibm_database.postgresdb.connectionstrings[0].composed
}

output "password" {
  value = var.admin_password
}

output "cert" {
  value = ibm_database.postgresdb.connectionstrings[0].certbase64
}