const OAuth2Strategy = require('passport-oauth2');
const util = require('util');
const InternalOAuthError = require('passport-oauth2').InternalOAuthError;

function urlFactory(url) {
    return path => url.replace(/\/$/, '') + path;
}
/**
 * `Strategy` constructor.
 *
 * The LVConnect authentication strategy authenticates requests by delegating to
 * LVConnect using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your LVConnect application's Client ID
 *   - `clientSecret`  your LVConnect application's Client Secret
 *   - `callbackURL`   URL to which LVConnect will redirect the user after granting authorization
 *   - `scope`         array of permission scopes to request.  valid scopes include:
 *                     'user', 'public_repo', 'repo', 'gist', or none. TODO
 *                     (see http://developer.github.com/v3/oauth/#scopes for more info)
 *
 * Examples:
 *
 *     passport.use(new LVConnectStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/github/callback',
 *         userAgent: 'myapp.com'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy (options, verify) {
    options = options || {};
    const url = urlFactory(options.baseUrl || 'https://lvconnect.link-value.fr');

    options.authorizationURL = options.authorizationURL || url('/oauth/authorize');
    options.tokenURL = options.tokenURL || url('/oauth/token');
    options.scope = options.scope || 'profile:get';
    options.scopeSeparator = options.scopeSeparator || ' ';
    options.customHeaders = options.customHeaders || {};

    OAuth2Strategy.call(this, options, verify);
    this.name = 'lvconnect';
    this._userProfileURL = options.userProfileURL || url('/users/me');
    this._oauth2.useAuthorizationHeaderforGET(true);
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function (accessToken, done) {
    this._oauth2.get(this._userProfileURL, accessToken, function (err, body) {

        if (err) {
            return done(new InternalOAuthError('Failed to fetch user profile', err));
        }

        try {
            const userLV = JSON.parse(body);
            done(null, {
                provider: 'lvconnect',
                id: userLV.id,
                displayName: userLV.firstName + ' ' + userLV.firstName,
                name: {
                    givenName: userLV.firstName,
                    familyName: userLV.lastName,
                },
                emails: [{ value: userLV.email }],
                photos: [{ value: userLV.profilePictureUrl }],
                _raw: body,
                _json: userLV,
            });
        } catch (ex) {
            done(new Error('Failed to parse user profile:' + body));
        }
    });
};


OAuth2Strategy.prototype.parseErrorResponse = function (body, status) {
    console.log({ body, status });
    return OAuth2Strategy.parseErrorResponse(body, status);
};

module.exports = exports.LVConnectStrategy = exports.default = Strategy;
