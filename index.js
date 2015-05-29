var config = require('./config.js');

var fs = require('fs');
var _ = require('underscore');
var request = require('request');
var moment = require('moment');

// Check every...
var minutes = 5;

// var url = 'http://signalnoise.dropmark.com/activity.json';
var url = 'http://sites.local/_git/slackmark/activity.json';
var lastTimestamp = 0;
var hasInit = false;

var templates = {};

var getTemplates = function() {
	return {
		message: _.template(fs.readFileSync('message.template', 'utf8')),
		description: _.template(fs.readFileSync('description.template', 'utf8'))
	}
};

var sendMessage = function(item) {
	var message = templates.message(item);
	var description = templates.description(item);
	var url = 'https://slack.com/api/chat.postMessage?token=' + config.token + '&channel=' + config.channel + '&pretty=1';

	var attachments = [
        {
            "fallback": message,
            "color": "#00dfdf",
            "pretext": message,
            "author_name": "",
            "author_link": "",
            "author_icon": "",
            "title": item.name,
            "title_link": item.link,
            "text": description,
            "image_url": item.thumbnail,
            "thumb_url": item.thumbnail,
            "mrkdwn_in": ["pretext"]
        }
    ];

    // url += '&text=' + text;
    // url += '&icon_url=http://anthonycossins.com/uploads/slackmark-' + Math.floor(Math.random() * 4) + '.png';
    url += '&attachments=' + encodeURIComponent(JSON.stringify(attachments))
    url += '&username=Slackmark';
    url += '&icon_url=http://anthonycossins.com/uploads/slackmark.png';

    request(url, function (error, response, body) {

    });
};

var slackAlert = function(items) {
	console.log('Slack Alert!', items.length, 'new item(s)');

	_.each(items, sendMessage);
};

var getMaxTimestamp = function(items) {
	return _.chain(items)
			.pluck('updated_at')
			.map(function(date) {
				return moment(date).format('x');
			})
			.max()
			.value();
};

var checkActivity = function() {
	templates = getTemplates();
	
	request(url, function (error, response, body) {
		if (error) return console.log('Error');

		var json = JSON.parse(body);

		if (hasInit) {
			var newItems = _.filter(json, function(item) {
				return moment(item.updated_at).format('X') > lastTimestamp;
			});

			if (!_.isEmpty(newItems)) {
				lastTimestamp = getMaxTimestamp(newItems);

				slackAlert(newItems);
			}
		} else {
			lastTimestamp = getMaxTimestamp(json);
		}

		setTimeout(function() {
			hasInit = true;
			checkActivity();
		}, minutes * 60 * 1000);
	}).auth(config.username, config.password, false);
};

checkActivity();