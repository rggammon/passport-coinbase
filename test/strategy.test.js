/* global describe, it, expect */
/* jshint expr: true */

var $require = require('proxyquire')
  , chai = require('chai')
  , util = require('util')
  , path =require('path')
  , fs = require('fs')
  , existsSync = fs.existsSync || path.existsSync // node <=0.6
  , CoinbaseStrategy = require('../lib/strategy');


describe('Strategy', function() {
  
  describe('constructed', function() {
    var strategy = new CoinbaseStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, function() {});
    
    it('should be named coinbase', function() {
      expect(strategy.name).to.equal('coinbase');
    });
  })
  
  describe('constructed with undefined options', function() {
    it('should throw', function() {
      expect(function() {
        var strategy = new CoinbaseStrategy(undefined, function(){});
      }).to.throw(Error);
    });
  })
     
  describe('handling a response with an authorization code', function() {
    var OAuth2Strategy = require('passport-oauth2').Strategy;
    var OAuth2;
    if (existsSync('node_modules/oauth')) { // npm 3.x
      OAuth2 = require('oauth').OAuth2;
    } else {
      OAuth2 = require('passport-oauth2/node_modules/oauth').OAuth2;
    }
    
    var MockOAuth2Strategy = function(options, verify) {
      OAuth2Strategy.call(this, options, verify);
      
      this._oauth2 = new OAuth2(options.clientID,  options.clientSecret,
        '', options.authorizationURL, options.tokenURL, options.customHeaders);
      this._oauth2.getOAuthAccessToken = function(code, options, callback) {
        if (code != 'SplxlOBeZQQYbYS6WxSbIA+ALT1') { return callback(new Error('wrong code argument')); }
        
        return callback(null, 's3cr1t-t0k3n', undefined, {});
      };
      this._oauth2.get = function(url, accessToken, callback) {
        if (url != 'https://api.coinbase.com/v2/user') { return callback(new Error('wrong url argument')); }
        if (accessToken != 's3cr1t-t0k3n') { return callback(new Error('wrong token argument')); }
    
        var body = '{ "data": { "id": "9da7a204-544e-5fd1-9a12-61176c5d4cd8", "name": "User One", "email": "user1@example.com", "username": "user1" } }';
        callback(null, body, undefined);
      };
    }
    util.inherits(MockOAuth2Strategy, OAuth2Strategy);
    
    var CoinbaseStrategy = $require('../lib/strategy', {
      'passport-oauth2': MockOAuth2Strategy
    })
    
    var strategy = new CoinbaseStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, function verify(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        return done(null, profile);
      })
    });
    
    
    var user;

    before(function(done) {
      chai.passport.use(strategy)
        .success(function(u) {
          user = u;
          done();
        })
        .req(function(req) {
          req.query = {};
          req.query.code = 'SplxlOBeZQQYbYS6WxSbIA+ALT1';
        })
        .authenticate({});
    });

    it('should authenticate user', function() {
      expect(user.id).to.equal("9da7a204-544e-5fd1-9a12-61176c5d4cd8");
      expect(user.username).to.equal('user1');
    });
  });  
});
