provider "cloudflare" {
  version = "1.9"
  email   = "${var.CLOUDFLARE_EMAIL}"
  token   = "${var.CLOUDFLARE_TOKEN}"
}

resource "cloudflare_record" "main" {
  name       = "${var.DOMAIN}"
  domain     = "${var.DOMAIN}"
  value      = "${digitalocean_droplet.web.ipv4_address}"
  type       = "A"
  ttl        = 1
  proxied    = true
  depends_on = ["digitalocean_droplet.web"]
}

resource "cloudflare_record" "www" {
  name    = "www"
  domain  = "${var.DOMAIN}"
  value   = "${var.DOMAIN}"
  type    = "CNAME"
  ttl     = 1
  proxied = true
}

resource "cloudflare_page_rule" "ssl" {
  zone   = "${var.DOMAIN}"
  target = "*${var.DOMAIN}/*"

  actions = {
    ssl = "full"
  }
}
