var Q = require('q'),
	_ = require('underscore'),
	nconf = require('nconf'),
	request = require('request'),
	Slack = require('slack-node'),
	Slackmark = require('./lib/slackmark.js');

var App = function() {
	var app = {
		initialize: function() {
			console.log('Starting Slackmark...');

			Q.fcall(this.readConfig)
			 	.then(this.testSlackConnection)
			 	.then(this.testDropmarkConnection)
			 	.done(this.initializeSlackMark);
		},

		initializeSlackMark: function() {
			var slackmark = new Slackmark();
		},

		readConfig: function() {
			var deferred = Q.defer();

			nconf.argv().env().add('credentials', {type: 'file', file: './config/credentials.json'})
				.defaults({
					"dropmark_url": "",
					"dropmark_username": "",
					"dropmark_password": "",
					"slack_token": "",
					"slack_channel": ""
			});

			nconf.save(function(error) {
				if (error) deferred.reject(new Error('Could not save config.json'));

				deferred.resolve();
			});

			return deferred.promise;
		},

		testSlackConnection: function() {
			var deferred = Q.defer();
			var channel = nconf.get('slack_channel');
			var slack = new Slack(nconf.get('slack_token'));

			slack.api('channels.list', function(error, response) {
				if (error) return console.log;

				var filtered = _.where(response.channels, {id: channel});

				if (filtered.length !== 0) {
					deferred.resolve();
				} else {
					deferred.reject(new Error('Slack channel does not exist'));
				}
			});

			return deferred.promise;
		},

		testDropmarkConnection: function() {
			var deferred = Q.defer();
			var url = nconf.get('dropmark_url');
			var username = nconf.get('dropmark_username');
			var password = nconf.get('dropmark_password');

			request(url, function (error, response, body) {
				if (error) deferred.reject(new Error('Could not connect to Dropmark'));

				try {
					JSON.parse(body);
					deferred.resolve();
				} catch(e) {
					deferred.reject(new Error('Error parsing Dropmark activity.json. Dropmark username/password is probably wrong!'));
				}
			}).auth(username, password, false);

			return deferred.promise;
		}
	};

	app.initialize();
	return app;
};

var app = new App();