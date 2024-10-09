resource "ibm_database" "postgresdb" {
  resource_group_id = ibm_resource_group.resource_group.id
  name              = "pg-hello-world"
  service           = "databases-for-postgresql"
  plan              = "standard"
  service_endpoints = "public"
  location          = var.region
  adminpassword = var.admin_password

 
  timeouts {
    create = "120m"
    update = "120m"
    delete = "15m"
  }
}

data "ibm_database_connection" "icd_conn" {
  deployment_id = ibm_database.postgresdb.id
  user_type     = "database"
  user_id       = "admin"
  endpoint_type = "public"
}

output "url" {
  value = data.ibm_database_connection.icd_conn.postgres[0].composed[0]
}

output "cert" {
  value = data.ibm_database_connection.icd_conn.postgres[0].certificate[0].certificate_base64
}

output "password" {
  value = var.admin_password
}