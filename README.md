# Passport-Coinbase

[Passport](http://passportjs.org/) strategy for authenticating with [Coinbase](https://coinbase.com/)
using the OAuth 2.0 API.

This module lets you authenticate using Coinbase in your Node.js applications.
By plugging into Passport, Coinbase authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

[![npm](https://img.shields.io/npm/v/passport-coinbase.svg)](https://www.npmjs.com/package/passport-coinbase)
![CI](https://github.com/rggammon/passport-coinbase/workflows/Node.js%20CI/badge.svg)

## Install

```bash
$ npm install passport-coinbase
```

## Usage

#### Create an Application

Before using `passport-coinbase`, you must register an application with Coinbase.
If you have not already done so, a new application can be created at
[New OAuth2 application](https://www.coinbase.com/oauth/applications/new) within
Coinbase's settings panel.  Your application will be issued a client ID and client
secret, which need to be provided to the strategy.  You will also need to
configure a callback URL which matches the route in your application.

#### Configure Strategy

The Coinbase authentication strategy authenticates users using a Coinbase account
and OAuth 2.0 tokens.  The client ID and secret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's
GitHub profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

```js
var CoinbaseStrategy = require('passport-coinbase').Strategy;

passport.use(new CoinbaseStrategy({
    clientID: COINBASE_CLIENT_ID,
    clientSecret: COINBASE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/coinbase/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ coinbaseId: profile.id }, function (err, user) {
      return cb(err, user);
  }
));
```
#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'coinbase'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/coinbase',
  passport.authenticate('coinbase'));

app.get('/auth/coinbase/callback', 
  passport.authenticate('coinbase', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-facebook-example)
as a starting point for their own web applications.  The example shows how to
authenticate users using Facebook.  However, because both Facebook and Coinbase
use OAuth 2.0, the code is similar.  Simply replace references to Facebook with
corresponding references to Coinbase.

## Contributing

#### Tests
The test suite is located in the `test/` directory.  All new features are
expected to have corresponding test cases.  Ensure that the complete test suite
passes by executing:

```bash
$ make test
```

#### Coverage

Coverage reports can be viewed by executing:

```bash
$ make test-cov
$ make view-cov
```


## Credits
  - [Ryan Gammon](https://github.com/rggammon)
  - Forked from [idris/passport-coinbase](https://github.com/idris/passport-coinbase) by [Idris Mokhtarzada](https://github.com/idris)
  - Forked from [passport-github](https://github.com/jaredhanson/passport-github) by [Jared Hanson](https://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)
