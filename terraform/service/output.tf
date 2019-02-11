output "IP" {
  value = "${digitalocean_droplet.web.ipv4_address}"
}

