provider "digitalocean" {
  version = "1.0.2"
  token   = "${var.digitalocean_token}"
}

resource "digitalocean_ssh_key" "access_key" {
  name       = "${var.public_key_name}"
  public_key = "${var.public_key}"
}
