var fs = require('fs');
var _ = require('underscore');
var request = require('request');

// var url = 'http://signalnoise.dropmark.com/activity.json';
var url = 'http://sites.local/_git/slackmark/activity.json';

var ids = [];
var hasInit = false;

var credentials = {
	username: '', 	// Username for dropmark
	password: '', 	// Password for dropmark
	token: '',		// Token for slack
	channel: ''		// Slack channel
}

// var message = {

// };
// _.reduce()

// var requestTemplate = fs.readFileSync('request.template', 'utf8');

// console.log(requestTemplate)

var sendMessage = function(message) {
	var url = 'https://slack.com/api/chat.postMessage?token=' + credentials.token + '&channel=' + credentials.channel + '&pretty=1';

	var attachments = [
        {
            "fallback": "Required plain-text summary of the attachment.",
            "color": "#36a64f",
            "pretext": "Optional text that appears above the attachment block",
            "author_name": "Bobby Tables",
            "author_link": "http://flickr.com/bobby/",
            "author_icon": "http://flickr.com/icons/bobby.jpg",
            "title": "Slack API Documentation",
            "title_link": "https://api.slack.com/",
            "text": "Optional text that appears within the attachment",
            "image_url": "http://my-website.com/path/to/image.jpg",
            "thumb_url": "http://example.com/path/to/thumb.png"
        }
    ];
};

var slackAlert = function(diffIds, json) {
	console.log('Slack Alert!', diffIds);

	var items = _.filter(json, function(item) {
		return _.contains(diffIds, item.id);
	});

	_.each(items, function(item) {
		console.log(item.name);

		sendMessage({

		})
	});
};

var checkActivity = function() {
	request(url, function (error, response, body) {
		if (error) return console.log('Error');

		var json = JSON.parse(body);
		var newIds = _.pluck(json, 'id');
		var diffIds = _.difference(newIds, ids);

		if (hasInit && !_.isEmpty(diffIds)) {
			slackAlert(diffIds, json);
		}

		ids = newIds;

		setTimeout(function() {
			checkActivity();

			hasInit = true;
		}, 1000)

	}).auth(credentials.username, credentials.password, false);
};

checkActivity();