provider "github" {
  version      = "1.3"
  token        = "${var.GITHUB_TOKEN}"
  organization = "${var.GITHUB_ORG}"
}

resource "github_repository_deploy_key" "server" {
  title      = "${var.DOMAIN}-ssh"
  read_only  = "true"
  repository = "${var.GITHUB_REPOSITORY}"
  key        = "${var.SERVER_KEY}"
}
