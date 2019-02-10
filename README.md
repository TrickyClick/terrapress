# Terrapress

Infrstructure as code for provisioning WordPress sites,
hosted on DigitalOcean, with certificate self signing,
running behind CloudFlare.

All code persisted from your WordPress files are the contents
of the `wp-content` folder of your WordPress. The rest of
the library code is reused, as is.

## Setting up the application
The first thing that you need to do is to clone the repository,
install the dependencies and run the init script.

```sh
git clone git@github.com:TrickClick/terrapress.git
cd terrapress
npm install
npm run init
```