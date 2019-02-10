output "id" {
  value     = "${acme_certificate.certificate.id}"
  sensitive = true
}

output "certificate_url" {
  value     = "${acme_certificate.certificate.certificate_url}"
  sensitive = true
}

output "certificate_domain" {
  value     = "${acme_certificate.certificate.certificate_domain}"
  sensitive = true
}

output "account_ref" {
  value     = "${acme_certificate.certificate.account_ref}"
  sensitive = true
}

output "private_key_pem" {
  value     = "${acme_certificate.certificate.private_key_pem}"
  sensitive = true
}

output "certificate_pem" {
  value     = "${acme_certificate.certificate.certificate_pem}"
  sensitive = true
}

output "issuer_pem" {
  value     = "${acme_certificate.certificate.certificate_pem}"
  sensitive = true
}
