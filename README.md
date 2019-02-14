# LVConnect Passport
 
[Passport](http://passportjs.org/) strategy for authenticating with [LVConnect](https://gitlab.com/LinkValue/Lab/LVConnect/LvConnect)
using the OAuth 2.0 API.

This module lets you authenticate using LVConnect in your Node.js applications.
By plugging into Passport, LVConnect authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

[Linkvalue](https://link-value.fr) is a french web/mobile agency.

**This package is an internal tool. You can download it and use it as an example for making your own, but it will be unusable if you're not a Linkvalue partner.**

## Install

```bash
$ npm install lvconnect-passport
```

## Usage

#### Create an Application

Before using `lvconnect-passport`, you must register an application with LVConnect.
If you have not already done so, a new application can be created at
[developer applications](https://lvconnect.com/settings/applications/new) within
LVConnect's settings panel.  Your application will be issued a client ID and client
secret, which need to be provided to the strategy.  You will also need to
configure a callback URL which matches the route in your application.

#### Configure Strategy

The LVConnect authentication strategy authenticates users using a LVConnect account
and OAuth 2.0 tokens.  The client ID and secret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's
LVConnect profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

```js
const LVConnectStrategy = require('lvconnect-passport');

passport.use(new LVConnectStrategy({
    clientID: LVCONNECT_CLIENT_ID,
    clientSecret: LVCONNECT_CLIENT_SECRET,
    callbackURL: "/auth/lvconnect/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ lVConnectId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'lvconnect'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/lvconnect',
  passport.authenticate('lvconnect'));

app.get('/auth/lvconnect/callback', 
  passport.authenticate('lvconnect', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-facebook-example)
as a starting point for their own web applications.  The example shows how to
authenticate users using Facebook.  However, because both Facebook and LVConnect
use OAuth 2.0, the code is similar.  Simply replace references to Facebook with
corresponding references to LVConnect.

## License

This LVConnect Passport package is an open-sourced software licensed under the MIT license.

## Contributing

Issues and PRs are obviously welcomed and encouraged, as well for new features and documentation.
