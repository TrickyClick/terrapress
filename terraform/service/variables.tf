variable "DIGITALOCEAN_TOKEN" {}

variable "DOMAIN" {
  description = "Root domain to be registered for CloudFlare"
}

variable "FINGERPRINT" {
  description = "Public key fingerprint for SSH access to host"
}

variable "CLOUDFLARE_TOKEN" {}

variable "CLOUDFLARE_EMAIL" {}
