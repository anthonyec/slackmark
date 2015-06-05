var Q = require('q'),
	_ = require('underscore'),
	moment = require('moment'),
	async = require('async-q');

var Item = function() {
	var item = {
		initalize: function() {
			console.log('Init item');
		},

		remove: function() {
			console.log('Rmove item');
		}
	}

	item.initalize();
	return item;
}

module.exports = Item;

/*
	
	Post()
		- id
		- message
		- data

		- setData()
			- Takes a item object passed in and sets data
		- getMessage()
			- Returns a query string formated message
		- generateThumbnail()
			- Creates a thumbnail image file with the id
		- removeThumbnail()
			- Deltes a thumbnail image file
		- remove()
			- Cleans up and calles removeThumbnail()

*/