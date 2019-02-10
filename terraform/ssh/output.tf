output "FINGERPRINT" {
  value     = "${digitalocean_ssh_key.access_key.fingerprint}"
  sensitive = true
}
