provider "cloudflare" {
  version = "1.9"
  email   = "${var.cloudflare_email}"
  token   = "${var.cloudflare_token}"
}

resource "cloudflare_record" "main" {
  name       = "${var.domain}"
  domain     = "${var.domain}"
  value      = "${digitalocean_droplet.web.ipv4_address}"
  type       = "A"
  ttl        = 1
  proxied    = true
  depends_on = ["digitalocean_droplet.web"]
}

resource "cloudflare_record" "www" {
  name    = "www"
  domain  = "${var.domain}"
  value   = "${var.domain}"
  type    = "CNAME"
  ttl     = 1
  proxied = true
}

resource "cloudflare_page_rule" "ssl" {
  zone   = "${var.domain}"
  target = "*${var.domain}/*"

  actions = {
    ssl = "full"
  }
}
