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
npm run exec init
npm run exec local:wordpress:setup
npm start
```

## Running commands
All commands are executed using `npm run exec <command>`. Executing
`npm run exec help` will give you more details. Some of the more
important ones:

```
npm run exec deploy     # creates the infrastructure
npm run exec destroy    # destroys the infrastructure
```