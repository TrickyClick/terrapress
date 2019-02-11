# Terraform
Here we store provisioning plans for different infrastructure,
which we save as code (e.g. IaC via terraform).

The following information is regarding the different plans used
within the application and their individual purpose.

Even tho plans can be executed individually, they are triggered
top to bottom, in the order specified in this document, whilst
running `./scripts/setup-digitalocean.sh` or by calling `npm run setup` and should be used with care, as it allows the end user to
tear down the whole previous infrastructure, if not used with care!

# service
This plan creates a Digital Ocean droplet, and grants access
to that machine via SSH pubkey authentication. After lifting the droplet, CloudFlare DNS records are created for the domain (`A` and `CNAME` to `www`).

### Required arguments
* `DIGITALOCEAN_TOKEN` - to access your DO account
* `DOMAIN` - root domain to be registered for CloudFlare
* `ACCESS_KEY` - SSH key to add to the created droplet
* `CLOUDFLARE_TOKEN` - to manage DNS records to Cloud Flare
* `CLOUDFLARE_EMAIL` - e-mail to pair with the token for auth

### Output variables
* `IP` - the IP of the provisioned droplet

# github
Adds access for the server to the source repository after
a SSH key is provided

### Required arguments
* `DOMAIN` - the server's domain
* `GITHUB_TOKEN` - with admin access to the repo
* `GITHUB_ORG` - root user/organization owner of the repo
* `REPOSITORY_NAME`
* `SERVER_KEY` - pub key to get read privileges granted
