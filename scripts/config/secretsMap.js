const secretsMap = {
  // SSH settings should be first
  SSH_PUBLIC_KEY: 'SSH Public Key (root access to server)',
  SSH_PRIVATE_KEY: 'SSH Private Key (root access to server)',
  SSH_KEY_NAME: 'SSH Key\'s name',

  // Non-ssh settings
  GITHUB_TOKEN: 'GitHub access token',
  DIGITALOCEAN_TOKEN: 'DigitalOcean access token',
  CLOUDFLARE_EMAIL: 'Cloudflare account e-mail',
  CLOUDFLARE_TOKEN: 'Cloudflare global token',
};

module.exports = secretsMap;
