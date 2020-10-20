var vows = require('vows');
var assert = require('assert');
var coinbase = require('../lib/passport-coinbase/index.js');


vows.describe('passport-coinbase').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(coinbase.version);
    },
  },
  
}).export(module);
