provider "digitalocean" {
  version = "1.0.2"
  token   = "${var.digitalocean_token}"
}

resource "digitalocean_droplet" "web" {
  name     = "${var.domain}-web"
  size     = "s-1vcpu-1gb"
  region   = "ams3"
  image    = "debian-9-x64"
  ssh_keys = ["${var.fingerprint}"]
}
