/**
 * Module dependencies.
 */
var util = require('util'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
    InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Coinbase authentication strategy authenticates requests by delegating to
 * Coinbase using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Coinbase application's Client ID
 *   - `clientSecret`  your Coinbase application's Client Secret
 *   - `callbackURL`   URL to which Coinbase will redirect the user after granting authorization
 *   - `scope`         array of permission scopes to request.  valid scopes include:
 *                     'user', 'balance', 'transactions', 'request', ...
 *                     (see https://coinbase.com/docs/api/permissions)
 *
 * Examples:
 *
 *     passport.use(new CoinbaseStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/coinbase/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://www.coinbase.com/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://www.coinbase.com/oauth/token';
  options.scopeSeparator = options.scopeSeparator || ' ';

  // Only request the profile if we have the scopes for it
  if(options.scope && options.scope.indexOf('user') < 0) this._skipUserProfile = true;
  this._userProfileURL = options.userProfileURL || 'https://api.coinbase.com/v2/user';

  OAuth2Strategy.call(this, options, verify);

  this.name = 'coinbase';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Coinbase.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `coinbase`
 *   - `id`               the user's Coinbase ID
 *   - `displayName`      the user's full name
 *   - `emails`           the user's email addresses
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

    try {
      var json = JSON.parse(body),
          user = json.data;

      var profile = { provider: 'coinbase' };
      profile.id = user.id;
      profile.displayName = user.name;
      profile.emails = [{ value: user.email }];
      
      profile._raw = body;
      profile._json = user;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
};

/**
 * Return extra Coinbase-specific parameters to be included in the authorization
 * request.
 *
 * @param {object} options
 * @return {object}
 * @access protected
 */
Strategy.prototype.authorizationParams = function(options) {
    var params = {};

    // https://developers.coinbase.com/docs/wallet/coinbase-connect/permissions
    if (options.account) {
        params['account'] = options.account;
    }

    if (options.layout) {
        params['layout'] = options.layout;
    }

    if (options.referral) {
        params['referral'] = options.referral;
    }

    if (options.sessionName) {
        params['meta[name]'] = options.sessionName;
    }

    if (options.accountCurrency) {
        params['account_currency'] = options.accountCurrency;
    }

    if (options.sendLimitAmount) {
      params['meta[send_limit_amount]'] = options.sendLimitAmount
    }

    if (options.sendLimitCurrency) {
        params['meta[send_limit_currency]'] = options.sendLimitCurrency
    }

    if (options.sendLimitPeriod) {
        params['meta[send_limit_period]'] = options.sendLimitPeriod
    }

    return params;
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
