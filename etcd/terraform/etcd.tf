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

output "url" {
  value = ibm_database.etcddb.connectionstrings[0].composed
}

output "password" {
  value = var.admin_password
}

output "cert" {
  value = ibm_database.etcddb.connectionstrings[0].certbase64
}

output "host" {
  value = ibm_database.etcddb.connectionstrings[0].hosts[0].hostname
}

output "port" {
  value = ibm_database.etcddb.connectionstrings[0].hosts[0].port  
}

output "user" {
  value = ibm_database.etcddb.connectionstrings[0].name  
}
