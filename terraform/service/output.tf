output "ip" {
  value = "${digitalocean_droplet.web.ipv4_address}"
}

output "domain" {
  value = "${var.domain}"
}
