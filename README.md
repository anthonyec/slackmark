# slackmark
Slack notifications for Dropmark

## Setup
Create a file called config.js at the root and fill in the details:

```JavaScript
module.exports = {
	username: '',			/ Username for dropmark
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