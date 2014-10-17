/*
 GET     /postings                      // get all postings
 POST    /postings                      // create new posting
 GET     /postings/:PID                 // get posting with PID
 (PUT    /postings/:PID                 // update posting with PID)
 DELETE  /postings/:PID                 // delete posting with PID

 GET     /comments/:PID                 // get all comments for posting with PID
 POST    /comments/:PID                 // create new comment for posting with PID
 DELETE  /comments/:CID                 // delete comment with CID

 PUT     /ratings/:PID/:USER/:STARS     // add/change rating for posting with PID and USER with STARS (0 .. 5)

 GET     /session/:USER                 // get user-settings for USER
 POST    /session/:USER/:PWD            // register with USER (username) and PWD (password)
 PUT     /session/:USER                 // update user-setting for USER
 POST    /login/:USER/:PWD              // login user with USER (username) and PWD (password)
 POST    /logout/:USER                  // logout user with USER (username)
 */

var express = require('express');
var router = express.Router();
// var path = require('path');
var shredditUtil = require('../shreddit-utils');

var Nedb = require('nedb');
var postings = new Nedb({ filename: '../server/db/postings', autoload: true });
var comments = new Nedb({ filename: '../server/db/comments', autoload: true });

// GET     /postings                      // get all postings
router.get('/postings', function(req, res) {
    var order = req.param("order");
    var userName = req.param("user");
    var sortOrder ={time:1};
    var find  ={};
//    console.log(req);

    if (order === "TOP") {
        sortOrder = {rating:-1} ;  // rating
        find = {};
    } else if (order === "MY") {
        sortOrder = {time:-1};  // user
        find = {user:userName};
    } else {
        sortOrder = {time:-1}; // latest
        find = {};
    }

    postings.find(find).sort(sortOrder).exec(function(err, docs) {

        if ( err ){

            console.log('error '+req.method +': ' + req.originalUrl +': all'+ err);
        }else {
            if (docs.length <= 0) {
                console.log('Databas has no element: '+req.originalUrl);
            } else {
                console.log('Databas '+req.method +':'+req.path+' has ' + docs.length + ' elements. '+req.originalUrl );
            }
            res.json(docs);
        }
    });
});

// POST    /postings                      // create new posting
router.post("/postings", function(req, res) {
  // res.json(DB.createPosting(req.body.user, req.body.title, req.body.content, req.body.link, req.body.url, req.body.tags));

    postings.insert(req.body, function (err, newDoc) {

        if ( err ){
            console.log('error '+req.method +': ' + req.originalUrl +' : '+ err);
        }else {
            /* wegen Kompatibilität setzen wir die ursprüngliche ID auch auf die _id */
            postings.update({ _id:newDoc._id }, { $set: { id:newDoc._id }},{},function (err, numReplaced) {

                postings.find({id:newDoc._id},function(err, doc){
                    if (err = 0){
                        console.log('error post/find: ' + err );
                    }else {
                        if (doc.length <= 0 ) {
                            console.log('error no element found '+req.originalUrl );
                        }else{
                            console.log('Databas '+req.method +':'+req.path+' has ' + doc.length + ' elements. '+req.originalUrl );
                            console.log('new posting:  id ' + doc[0].id + ' ' + doc[0].title + ' _id ' + doc[0]._id);
                        }
                    }
                    res.json(doc);
                });
            });
        }
    });
});

// GET     /postings/:PID                 // get posting with PID
router.get("/postings/:PID", function(req, res) {
  // res.json(DB.getPosting(req.params.PID));
    var sortOrder ={time:-1};
    var find      ={id:req.params.PID};

    postings.find(find).sort(sortOrder).exec(function(err, docs) {

        if ( err ){

            console.log('error '+req.method +': ' + req.originalUrl +' : '+ err);
        }else {
            if (docs.length <= 0) {
                console.log('Databas has no element: '+req.originalUrl);
            } else {
                console.log('Databas '+req.method +': '+req.path+' has ' + docs.length + ' elements. '+req.originalUrl );
            }
            res.json(docs);
        }
    });
});

// DELETE  /postings/:PID                 // delete posting with PID
router.delete("/", function(req, res) {
  // res.json(DB.deletePosting(req.params.PID));
    var _pid = req.params.PID;

    comments.remove({pid:_pid},{multi:true}, function( err, numRemoved){

        if ( err ){
            console.log('error comment '+req.method +': ' + req.originalUrl +' : '+ err);
        }else {
            console.log('Databas '+req.path +' element '+ _pid +' count '+ numRemoved );
        }
    });

    postings.remove({id:_pid},{multi:true}, function( err, numRemoved){

        if ( err ){
            console.log('error posting '+req.method +': ' + req.originalUrl +' : '+ err);
        }else {
            console.log('Databas '+req.path +' element '+ _pid +' count '+ numRemoved );
        }
        res.json(numRemoved);
    });
});

// GET     /comments/:PID                 // get all comments for posting with PID
router.get("/comments/:PID", function(req, res) {
  // res.json(DB.getComments(req.params.PID));

    if ( err ){
        console.log('error '+req.method +': ' + req.originalUrl +' : '+ err);
    }else {
        comments.find({pid: req.params.PID}, function (err, doc) {

            if (doc.length <= 0) {
                console.log('Databas has no element: '+req.originalUrl);
            } else {
                console.log('Databas '+req.method +': '+req.path+' has ' + docs.length + ' elements. '+req.originalUrl );
            }
            res.json(doc);
        });
    }
});

// POST    /comments/:PID                 // create new comment for posting with PID
router.post("/comments/:PID", function(req, res) {
  // res.json(DB.createComment(req.params.PID, req.body.user, req.body.comment));

});

// DELETE  /comments/:CID                 // delete comment with CID
router.delete("/comments/:CID", function(req, res) {
  // res.json(DB.deleteComment(req.params.CID));

    comments.remove({id:req.params.CID},{multi:false}, function( err, numRemoved){

        if ( err ){
            console.log('error '+req.method +': ' + req.originalUrl +' : '+ err);
        }else {
            console.log('Databas '+req.path +' element '+ req.body.CID +' count '+ numRemoved );
        }
        res.json(numRemoved);
    })
});

// PUT     /ratings/:PID/:USER/:STARS     // add/change rating for posting with PID and USER with STARS (0 .. 5)
router.put("/ratings/:PID/:USER/:STARS", function(req, res) {
  // res.json(DB.updateRatings(req.params.PID, req.params.USER, req.params.STARS));
});

// GET     /session/:USER                 // get user-settings for USER
router.get("/session/:USER", function(req, res) {
  // res.json(DB.getUserSetting(req.params.USER));
});

// POST    /session/:USER/:PWD            // register with USER (username) and PWD (password)
router.post("/session/:USER/:PWD", function(req, res) {
  // res.json(DB.registerUser(req.params.USER, req.params.PWD));
});

// PUT     /session/:USER                 // update user-setting for USER
router.put("/session/:USER", function(req, res) {
  // res.json(DB.updateSetting(req.params.USER, req.body.password, req.body.email, req.body.notify, req.body.locale));
});

// POST    /login/:USER/:PWD              // login user with USER (username) and PWD (password)
router.post("/login/:USER/:PWD", function(req, res) {
  res.json(); // TODO
});

// POST    /logout/:USER                  // logout user with USER (username)
router.post("/logout/:USER", function(req, res) {
  res.json(); // TODO
});

module.exports = router;
