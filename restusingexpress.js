var MongoClient = require('mongodb').MongoClient, 
    ObjectID = require('mongodb').ObjectID,
    assert = require('assert'),
// express is used to develop restful web services
	express = require('express'),
// if you are supporting post, put or delete. Suppose if you response.body 
 	bodyParser = require('body-parser'),
	app = express(),
// suppose if you using forms then using multer will be helpful
	multer = require('multer'), // v1.0.5
	upload = multer(); // for parsing multipart/form-data

// within request if you are exoecting JSON request
app.use(bodyParser.json()); // for parsing application/json

// witing response body if you application/x-www-form-urlencoded
// format to parse messages we use
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//app.use(middleForAuthenatication);

var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
	// throw an error if its not null
  	assert.equal(null, err);
  	console.log("Connected correctly to server.");
  	app.get('/user', function(req,res){
		db.collection("user").find().toArray(function(err, docs){
			if(err) {
				res.status(500).send('Something broke!')
			}
			console.log(JSON.stringify(docs));
			res.json(docs);
		})
	});
	app.post('/user', function(req,res) {
		db.collection("user").insertOne(req.body, function(err, result){
			if(err) {
				res.status(500).send('Something broke!')
			}
			console.log(JSON.stringify(result));
			res.json(result);
		})
	});
	// getting only item
	app.get('/user/:id', function(req,res) {
		//console.log(req.params.id);
		var objectId = new ObjectID(req.params.id);
		var obj = {"_id":objectId};
		db.collection("user").find(obj).toArray(function(err, result){
			if(err) {
				res.status(500).send(JSON.stringify(err));
			}
			//console.log(JSON.stringify(result));
			res.json(result);
		});
	});
	// updating existing record
	app.put('/user/:id', function(req,res) {
		//console.log(req.params.id);
		var objectId = new ObjectID(req.params.id);
		var obj = {"_id":objectId};
		db.collection("user").update(obj, req.body, function(err, result){
			if(err) {
				res.status(500).send(JSON.stringify(err));
			}
			//console.log(JSON.stringify(result));
			res.json(result);
		});
	});

	app.delete('/user/:id', function(req,res) {
		//console.log(req.params.id);
		var objectId = new ObjectID(req.params.id);
		var obj = {"_id":objectId};
		db.collection("user").remove(obj, function(err, result){
			if(err) {
				res.status(500).send(JSON.stringify(err));
			}
			//console.log(JSON.stringify(result));
			res.json(result);
		});
	});
});
app.use('/public', express.static('public'))
app.listen(3000, function() {
	console.log('The server is running at http://localhost:3000 ')
})