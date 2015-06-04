# Slackmark - Slack notifications for Dropmark

Slackmark is a node server that checks Dropmark every so often and posts to a Slack channel of your choice when there's something new.

## Setup
Create a file called config.js at the root and fill in the details:

```JavaScript
module.exports = {
	username: '',			// Username for dropmark
	password: '',			// Password for dropmark
	token: '',				// Token for Slack
	channel: '',			// Slack channel
	millis: 5 * 60 * 1000	// How often Slackmark should check Dropmark
}
```

Install the dependencies
```bash
$ npm install
```

Then run the index.js file
```bash
$ node index.js
```

Then that's it really. Sort of just threw this together one night so it's pretty rough at the moment.

## CLI Commands
When index.js is running, you can use these CLI commands to do things:

```
check				 - Forces a manual Dropmark check
say [message] 		 - Sends a message to the channel as Slackmark bot
config [key] [value] - Edit the config at runtime. 
					   Note that changes are lost once you terminate Slackmark
```

## HELP SLACKMARK BOT TOOK OVER AND IS ON A MURDEROUS RAMPAGE!!
Hold CTRL/CMD + C to terminate index.js

## Todo
- Crop thumbnails so they are nice and big and not super tall
- Rewrite the whole thing so it's more organised
- Add ablity to add filters for specific item attributes (e.g if someone adds a video type then post to the video channel in slack)
- Add broken thumbnail detection (probably more effort than it's worth)
- Cron job those timeouts maybe (part of rewrite)
