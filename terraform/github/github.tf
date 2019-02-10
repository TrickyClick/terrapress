provider "github" {
  version      = "1.3"
  token        = "${var.github_token}"
  organization = "${var.github_org}"
}

resource "github_repository_deploy_key" "server" {
  title      = "${var.domain}-ssh"
  read_only  = "true"
  repository = "${var.repository_name}"
  key        = "${var.server_key}"
}
