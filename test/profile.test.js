/* global describe, it, before, expect */
/* jshint expr: true */

var Profile = require('../lib/profile')
  , fs = require('fs');


describe('Profile.parse', function() {

  describe('full profile', function() {
    var profile;

    before(function(done) {
      fs.readFile('test/fixtures/fulluser.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = Profile.parse(data);
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.id).to.equal('9da7a204-544e-5fd1-9a12-61176c5d4cd8');
      expect(profile.displayName).to.equal("User One");
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal("user1@example.com");
      expect(profile.username).to.equal("user1");
      expect(profile.photos).to.have.length(1);
      expect(profile.photos[0].value).to.equal("https://images.coinbase.com/avatar?h=vR%2FY8igBoPwuwGren5JMwvDNGpURAY%2F0nRIOgH%2FY2Qh%2BQ6nomR3qusA%2Bh6o2%0Af9rH&s=128");

      expect(profile.profileLocation).to.be.null;
      expect(profile.profileBio).to.be.null;
      expect(profile.profileUrl).to.equal("https://coinbase.com/user1");
      expect(profile.timeZone).to.equal("Pacific Time (US & Canada)");
      expect(profile.nativeCurrency).to.equal("USD");
      expect(profile.bitcoinUnit).to.equal("bits");
      expect(profile.country.code).to.equal("US");
      expect(profile.country.name).to.equal("United States");
      expect(profile.createdAt.toISOString()).to.equal("2015-01-31T20:49:02.000Z");
    });
  });

  describe('min profile', function() {
    var profile;

    before(function(done) {
      fs.readFile('test/fixtures/minuser.json', 'utf8', function(err, data) {
        if (err) { return done(err); }
        profile = Profile.parse(data);
        done();
      });
    });

    it('should parse profile', function() {
      expect(profile.id).to.equal('9da7a204-544e-5fd1-9a12-61176c5d4cd8');
      expect(profile.displayName).to.equal("User One");
      expect(profile.emails).to.be.undefined;
      expect(profile.username).to.equal("user1");
      expect(profile.photos).to.have.length(1);
      expect(profile.photos[0].value).to.equal("https://images.coinbase.com/avatar?h=vR%2FY8igBoPwuwGren5JMwvDNGpURAY%2F0nRIOgH%2FY2Qh%2BQ6nomR3qusA%2Bh6o2%0Af9rH&s=128");

      expect(profile.profileLocation).to.be.null;
      expect(profile.profileBio).to.be.null;
      expect(profile.profileUrl).to.equal("https://coinbase.com/user1");
      expect(profile.timeZone).to.be.undefined;
      expect(profile.nativeCurrency).to.be.undefined;
      expect(profile.bitcoinUnit).to.be.undefined;
      expect(profile.country).to.be.undefined;
      expect(profile.createdAt).to.to.be.undefined;
    });
  });
});
