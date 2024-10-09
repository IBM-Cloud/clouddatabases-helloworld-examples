resource "ibm_database" "etcddb" {
  resource_group_id = ibm_resource_group.resource_group.id
  name              = "etcd-hello-world"
  service           = "databases-for-etcd"
  plan              = "standard"
  service_endpoints = "public"
  location          = var.region
  adminpassword     = var.admin_password


  timeouts {
    create = "120m"
    update = "120m"
    delete = "15m"
  }
}

data "ibm_database_connection" "icd_conn" {
  deployment_id = ibm_database.etcddb.id
  user_type     = "database"
  user_id       = "admin"
  endpoint_type = "public"
}

output "url" {
  value = data.ibm_database_connection.icd_conn.grpc[0].composed[0]
}

output "cert" {
  value = data.ibm_database_connection.icd_conn.grpc[0].certificate[0].certificate_base64
}

output "password" {
  value = data.ibm_database_connection.icd_conn.grpc[0].authentication[0].password
}

output "host" {
  value = data.ibm_database_connection.icd_conn.grpc[0].hosts[0].hostname
}

output "port" {
  value = data.ibm_database_connection.icd_conn.grpc[0].hosts[0].port  
}

output "user" {
  value = data.ibm_database_connection.icd_conn.grpc[0].authentication[0].username  
}
