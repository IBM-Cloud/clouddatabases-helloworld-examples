resource "ibm_database" "elasticdb" {
  resource_group_id = ibm_resource_group.resource_group.id
  name              = "elasticdb-hello-world"
  service           = "databases-for-elasticsearch"
  plan              = "enterprise"
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
  deployment_id = ibm_database.elasticdb.id
  user_type     = "database"
  user_id       = "admin"
  endpoint_type = "public"
}

output "url" {
  value = data.ibm_database_connection.icd_conn.https[0].composed[0]
}

output "cert" {
  value = data.ibm_database_connection.icd_conn.https[0].certificate[0].certificate_base64
}

output "password" {
  value = var.admin_password
}