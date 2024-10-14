resource "ibm_resource_key" "resourceKey" {
  name                 = "etcdkey"
  role                 = "Administrator"
  resource_instance_id = ibm_database.etcddb.id

  timeouts {
    create = "15m"
    delete = "15m"
  }
}

output "username" {
    value =  ibm_resource_key.resourceKey.credentials["connection.grpc.authentication.username"]
    sensitive = true
}

output "password" {
    value =  ibm_resource_key.resourceKey.credentials["connection.grpc.authentication.password"]
    sensitive = true
}