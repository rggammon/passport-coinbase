/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }

  var profile = {};
  // Properties from passport.Profile
  profile.id = String(json.id);
  profile.displayName = json.name;
  if (json.email) {
    profile.emails = [{ value: json.email }];
  }
  profile.username = json.username;
  if (json.avatar_url) {
    profile.photos = [{ value: json.avatar_url }];
  }

  // Additional coinbase profile properties
  profile.profileLocation = json.profile_location;
  profile.profileBio = json.profile_bio;
  profile.profileUrl = json.profile_url;
  profile.timeZone = json.time_zone;
  profile.nativeCurrency = json.native_currency;
  profile.bitcoinUnit = json.bitcoin_unit;
  if (json.country) {
    profile.country = {
      code: json.country.code,
      name: json.country.name
    }
  }
  if (json.created_at) {
    var time = Date.parse(json.created_at);
    if (time !== NaN) {
      profile.createdAt = new Date();
      profile.createdAt.setTime(time);
    }
  }

  return profile;
};
