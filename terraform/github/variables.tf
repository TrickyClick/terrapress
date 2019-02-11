variable "GITHUB_TOKEN" {}

variable "DOMAIN" {}

variable "GITHUB_ORG" {
  description = "GitHub organization/user"
}
variable "GITHUB_REPOSITORY" {
  description = "GitHub repository name"
}

variable "SERVER_KEY" {
  description = "Server's id_rsa.pub"
}