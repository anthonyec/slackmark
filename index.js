var config = require('./config.js');

var fs = require('fs');
var _ = require('underscore');
var request = require('request');
var moment = require('moment');

var timeout;
var url = 'http://signalnoise.dropmark.com/activity.json';
// var url = 'http://sites.local/slackmark/planning/activity.json';
var lastTimestamp = 0;
var hasInit = false;

var templates = {};

var getTemplates = function() {
	return {
		message: _.template(fs.readFileSync('./templates/message', 'utf8')),
		description: _.template(fs.readFileSync('./templates/description', 'utf8'))
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
			.pluck('created_at')
			.map(function(date) {
				return moment(date).format('x');
			})
			.max()
			.value();
};

var checkActivity = function() {
	console.log(moment().format('MMMM Do YYYY, h:mm:ss a'), '-', 'Checking activity and loading templates');

	try {
		templates = getTemplates();
	} catch(e) {
		console.log('Error loading templates');
		return;
	}
	
	request(url, function (error, response, body) {
		if (error) return console.log('Error requesting activity!');

		var json = JSON.parse(body);

		if (hasInit) {
			var newItems = _.filter(json, function(item) {
				return moment(item.created_at).format('X') > lastTimestamp;
			});

			if (!_.isEmpty(newItems)) {
				lastTimestamp = getMaxTimestamp(newItems);

				slackAlert(newItems);
			}
		} else {
			lastTimestamp = getMaxTimestamp(json);
		}

		timeout = setTimeout(function() {
			hasInit = true;
			checkActivity();
		}, config.millis);
	}).auth(config.username, config.password, false);
};

checkActivity();



// Optional command stuff
var commands = {
	config: function(params) {
		var key = params[0];
		var value = params[1];

		if (_.isUndefined(value)) {
			console.log(config[key]);
		} else {
			config[key] = value;

			console.log(config);
		}

	},

	say: function(params) {
		var message = params.join(' ');
		var url = 'https://slack.com/api/chat.postMessage?token=' + config.token + '&channel=' + config.channel + '&pretty=1';

		url += '&text=' + encodeURIComponent(message);
		url += '&username=Slackmark';
	    url += '&icon_url=http://anthonycossins.com/uploads/slackmark.png';

		console.log('Sending message:', message);

		request(url, function (error, response, body) {
			console.log('Message sent!');
	    });
	},

	check: function() {
		checkActivity();
	}
};

process.stdin.resume();
process.stdin.setEncoding('utf8');
 
process.stdin.on('data', function (chunk) {
	var chunk = chunk.replace('\n', '');
	var split = chunk.split(' ');
	var command = _.first(split);
	var params = _.rest(split);

	if (commands[command]) commands[command](params);
});

