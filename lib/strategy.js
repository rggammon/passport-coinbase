// Load modules.
var OAuth2Strategy = require('passport-oauth2')
  , util = require('util')
  , Profile = require('./profile')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * The Coinbase authentication strategy authenticates requests by delegating to
 * Coinbase using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
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
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://www.coinbase.com/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://www.coinbase.com/oauth/token';
  options.scopeSeparator = options.scopeSeparator || ' ';

  if (options.account) {
    this._account = options.account;
  }

  if (options.referral) {
    this._referral = options.referral;
  }

  if (options.accountCurrency) {
    this._accountCurrency = options.accountCurrency;
  }

  if (options.sendLimitAmount) {
    this._sendLimitAmount = options.sendLimitAmount;
  }

  if (options.sendLimitCurrency) {
    this._sendLimitCurrency = options.sendLimitCurrency;
  }

  if (options.sendLimitPeriod) {
    this._sendLimitPeriod = options.sendLimitPeriod;
  }

  OAuth2Strategy.call(this, options, verify);

  this.name = 'coinbase';
  this._userProfileURL = options.userProfileURL || 'https://api.coinbase.com/v2/user';
}

// Inherit from `OAuth2Strategy`.
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
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json;
    if (err) { return done(new InternalOAuthError('Failed to fetch user profile', err)); }

    try {
      var parsed = JSON.parse(body);
      json = parsed.data;
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    var profile = Profile.parse(json);
    profile.provider = 'coinbase';
    profile._raw = body;
    profile._json = json;

    done(null, profile);
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

    var account = options.account || this._account;
    if (account) {
      params['account'] = account;
    }

    var referral = options.referral || this._referral;
    if (referral) {
      params['referral'] = referral;
    }

    if (options.sessionName) {
      params['meta[name]'] = options.sessionName;
    }

    var accountCurrency = options.accountCurrency || this._accountCurrency;
    if (accountCurrency) {
      params['account_currency'] = accountCurrency;
    }

    var sendLimitAmount = options.sendLimitAmount || this._sendLimitAmount;
    if (sendLimitAmount) {
      params['meta[send_limit_amount]'] = sendLimitAmount;
    }

    var sendLimitCurrency = options.sendLimitCurrency || this._sendLimitCurrency;
    if (sendLimitCurrency) {
      params['meta[send_limit_currency]'] = sendLimitCurrency;
    }

    var sendLimitPeriod = options.sendLimitPeriod || this._sendLimitPeriod;
    if (this._sendLimitPeriod) {
      params['meta[send_limit_period]'] = sendLimitPeriod;
    }

    return params;
}

// Expose constructor.
module.exports = Strategy;
