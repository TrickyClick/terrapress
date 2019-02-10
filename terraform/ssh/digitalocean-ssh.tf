provider "digitalocean" {
  version = "1.0.2"
  token   = "${var.DIGITALOCEAN_TOKEN}"
}

resource "digitalocean_ssh_key" "access_key" {
  name       = "${var.SSH_KEY_NAME}"
  public_key = "${var.SSH_PUBLIC_KEY}"
}
