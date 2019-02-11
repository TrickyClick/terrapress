output "ID" {
  value     = "${acme_certificate.certificate.id}"
  sensitive = true
}

output "CERTIFICATE_URL" {
  value     = "${acme_certificate.certificate.certificate_url}"
  sensitive = true
}

output "CERTIFICATE_DOMAIN" {
  value     = "${acme_certificate.certificate.certificate_domain}"
  sensitive = true
}

output "ACCOUNT_REF" {
  value     = "${acme_certificate.certificate.account_ref}"
  sensitive = true
}

output "PRIVATE_KEY_PEM" {
  value     = "${acme_certificate.certificate.private_key_pem}"
  sensitive = true
}

output "CERTIFICATE_PEM" {
  value     = "${acme_certificate.certificate.certificate_pem}"
  sensitive = true
}

output "ISSUER_PEM" {
  value     = "${acme_certificate.certificate.issuer_pem}"
  sensitive = true
}
