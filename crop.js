var fs = require('fs'),
	async = require('async'),
	nconf = require('nconf'),
	request = require('request'),
	easyimg = require('easyimage');

nconf.argv().env().file({ file: 'config.json' });

var url = "http://image.dropmark.com/6dc332c1aaa696a8e466a8bea57f7778/png/?viewport=1200x1200&fullpage=true&format=png&thumbnail_max_width=600&url=http%3A%2F%2Fblog.invisionapp.com%2Fhow-to-run-design-reviews%2F%3Futm_campaign%3DWeekly%2BDigest%26utm_source%3Dhs_email%26utm_medium%3Demail%26utm_content%3D17833079%26_hsenc%3Dp2ANqtz--Ad1gJWBGbXbosA2HKpkm6WIVhL5zpH-K72rohzDMIkp7ptDUFCi5m_3OPBGV9qp0G51XAaptYMHqc3HcxdERC8msQHQ%26_hsmi%3D17833079";

var download = function(uri, filename, callback) {
	request.head(uri, function(err, res, body) {
		// console.log('content-type:', res.headers['content-type']);
		// console.log('content-length:', res.headers['content-length']);

		var r = request(uri).pipe(fs.createWriteStream(filename));

		r.on('close', callback);
	});
};

download(url, './cache/thumbnail.png', function(){
	easyimg.crop({
		"src": "./cache/thumbnail.png",
		"dst": "./cache/cropped.png",
		"width": 600,
		"cropwidth": 600,
		"cropheight": 420,
		"gravity": "North"
	}).then(function(image) {
		console.log('Cropped!');
	}, function (error) {
		console.log('Error cropping!', error);
	})
});