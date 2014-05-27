
NFD Web app
===========

Nearform deployer web app

## Setup

```bash
npm install
```

### Bower

```bash
npm install -g bower
bower install
```

### Mongo

On OSX:
```bash
brew install mongodb
mongod --config /usr/local/etc/mongod.conf
```

To install Mongo on other environment see [http://docs.mongodb.org/manual/installation/](http://docs.mongodb.org/manual/installation/).

## Run

```bash
node server.js
```

And open [localhost:9000](http://localhost:9000)

### Admin

Open [localhost:9000](http://localhost:9000), login with an admin user (admin credentials defined in lib/config/env/all.js) and go to [localhost:9000/admin](http://localhost:9000/admin).

## Gulp

```bash
npm i -g gulp
```

### Running app and watch for changes

```bash
gulp serve
```

## Testing

TODO


