variable "digitalocean_token" {}

variable "domain" {
  description = "Root domain to be registered for CloudFlare"
}

variable "fingerprint" {
  description = "Public key fingerprint for SSH access to host"
}

variable "cloudflare_token" {}

variable "cloudflare_email" {}
