var vows = require('vows');
var assert = require('assert');
var util = require('util');
var CoinbaseStrategy = require('passport-coinbase/strategy');


vows.describe('CoinbaseStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new CoinbaseStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    },
    
    'should be named coinbase': function (strategy) {
      assert.equal(strategy.name, 'coinbase');
    },
  },
  
}).export(module);
