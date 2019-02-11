provider "acme" {
  server_url = "https://acme-staging-v02.api.letsencrypt.org/directory"
}

resource "tls_private_key" "private_key" {
  algorithm = "RSA"
}

resource "acme_registration" "reg" {
  account_key_pem = "${tls_private_key.private_key.private_key_pem}"
  email_address   = "${var.SUPPORT_EMAIL}"
}

resource "acme_certificate" "certificate" {
  account_key_pem           = "${acme_registration.reg.account_key_pem}"
  common_name               = "${var.DOMAIN}"
  subject_alternative_names = ["www.${var.DOMAIN}"]

  dns_challenge {
    provider = "cloudflare"

    config = {
      CLOUDFLARE_EMAIL   = "${var.CLOUDFLARE_EMAIL}"
      CLOUDFLARE_API_KEY = "${var.CLOUDFLARE_TOKEN}"
    }
  }
}
