resource "ibm_database" "redisdb" {
  resource_group_id = ibm_resource_group.resource_group.id
  name                                 = "redis-hello-world"
  service                              = "databases-for-redis"
  plan                                 = "standard"
  location                             = "eu-gb"
  tags                                 = []
  adminpassword = var.admin_password
}

resource "ibm_resource_key" "redis_credentials" {
  name                  = "my-redis-key"
  role                  = "Administrator"
  resource_instance_id  = ibm_database.redisdb.id
}

output "redis_credentials" {
  value = ibm_resource_key.redis_credentials.credentials
  sensitive = true
}
