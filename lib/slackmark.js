var Q = require('q');
var fs = require('fs');
var _ = require('underscore');
var request = require('request');
var moment = require('moment');
var events = require('events');
var async = require('async-q');
var Slack = require('slack-node');

var Item = require('./item.js');


// var slack = new Slack('xoxp-4729872005-4729872007-5072976069-eb8c25');

// slack.api("users.list", function(err, response) {
// 	console.log(response);
// });

// var item = new Item();


var Slackmark = function() {
	var slackmark = {
		isReady: false,

		initialize: function() {
			console.log('Hey guys');
		},

		check: function() {

		},

		onFirstRun: function() {

		}
	}

	slackmark.initialize();
	return slackmark;
}

module.exports = Slackmark;