resource "ibm_database" "elasticdb" {
  resource_group_id = ibm_resource_group.resource_group.id
  name              = "elasticdb-hello-world"
  service           = "databases-for-elasticsearch"
  plan              = "standard"
  version           = "7.10"
  location          = var.region
  adminpassword = var.admin_password

 
  timeouts {
    create = "120m"
    update = "120m"
    delete = "15m"
  }
}

output "url" {
  value = ibm_database.elasticdb.connectionstrings[0].composed
}

output "password" {
  value = var.admin_password
}

output "cert" {
  value = ibm_database.elasticdb.connectionstrings[0].certbase64
}