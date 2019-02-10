output "ip" {
  value = "${digitalocean_droplet.web.ipv4_address}"
}

