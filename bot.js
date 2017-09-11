var twitter = require('twitter');
var config = require('./auth'); //stores Consumer Secret and access keys
var events = require('events');

//connect with your twitter app and create eventEmitter so we can use events to trigger an action
var connect = new twitter(config);
var eventEmitter = new events.EventEmitter();

//declare keywords we want to track; connect to the twitter stream
var keywords = {track: '#coding'};
var stream = connect.stream('statuses/filter', keywords);

//function to run when stream detects tracked keyword
var likeTweet = function(tweetId) {
	connect.post('favorites/create', tweetId, function(err,responses) {
		if (err) {
      console.log(err);
    } else {
      console.log('Liked! - tweet id: ' + tweetId.id);
    }
});
};

//event listener
eventEmitter.on('like', likeTweet);

//twitter stream listener, when data recieved, event is triggered and tweet id is passed t o likeTweet()
stream.on('data', function(data) {
  eventEmitter.emit('like', {id:data.id_str});
});

//error listeners
stream.on('error', function(err) {
  console.log(err);
});

