// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
//  ******** change this when models created ******
const Requests = require('../models/request');

const User = require('../models/user')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()


/* 
Action:      INDEX
Method:      GET
URI:        /api/requests
Description: Get  all requests
*/
router.get('/api/requests', requireToken,(req, res) => {
    Requests.find({})
    .then((request) => {
        res.status(200).json({message: request})
    })
    .catch((error) => {
        res.status(500).json({error: error})
    })
})


/* 
Action:      INDEX
Method:      GET
URI:        /api/requests/pending
Description: Get pending requests
*/
router.get('/api/requests/pending', requireToken,(req, res) => {
    Requests.find({requestStatus: 'pending' })
    .then((request) => {
        res.status(200).json({message: request})
    })
    .catch((error) => {
        res.status(500).json({error: error})
    })
})


/* 
Action:      INDEX
Method:      GET
URI:        /api/requests/token
Description: Get all request for a spacific patient
*/
router.get('/api/requests/patientrequests', requireToken,(req, res) => {
    console.log(req.user._id);
    // const currentUser = User.find({_id: req.user});
    // console.log(currentUser._id);
    
    
    Requests.find({patient: req.user._id})
    .then((requests) => {
        res.status(200).json({requests: requests})
    })
    .catch((error) => {
        res.status(500).json({error: error})
    })
})


/* 
Action:      CREATE
Method:      POST
URI:        /api/requests
Description: create a new request
*/

router.post('/api/requests', requireToken,(req, res) => {
    // req.body.request.patient = req.user.id
    Requests.create(req.body.request)
    /*  on a succesful create action respond with 201
    http status and content of new article */
    .then((newRequest) => {
        res.status(201).json({newRequest:newRequest})
    })
    /*  catch any error that may occur */
    .catch((error) => {
        res.status(500).json({error: error})
    })   
})



/* 
Action:      SHOW
Method:      GET
URI:        /api/requests/42x3sdc5vfg6fb7h8njki9
Description: Get a spacific request  by request  ID
*/
router.get('/api/requests/:id',requireToken, (req, res, next) => {
      console.log(req.user.id,"req.user.id") 
      console.log(req.params.id,"req.params.id")

    Requests.findById(req.params.id, (error, request) => {
        if(request){
            res.status(200).json({request: request})
        } else {
            res.status(404).json({
                error: {
                    name: 'DocumentNotFoundError',
                    message: 'The provided ID doesn\'t match any documents'
                }
            })
        } 
    })
})


/**
 * Action:      UPDATE
 * Method:      PATCH
* URI:          /api/requests/5d664b8b68b4f5092aba18e9
* Description:  Update a request by request ID
 */
router.patch('/api/requests/:id', requireToken, function(req, res) {
    Requests.findById(req.params.id)
      .then(function(request) {
        if(request) {
          // Pass the result of Mongoose's `.update` method to the next `.then`
          return request.update(req.body.request);
        } else {
          // If we couldn't find a document with the matching ID
          res.status(404).json({
            error: {
                name: 'DocumentNotFoundError',
                message: 'The provided ID doesn\'t match any documents'
            }
          });
        }
      })
      .then(function() {
        // If the update succeeded, return 204 and no JSON
        res.status(204).end();
      })
      // Catch any errors that might occur
      .catch(function(error) {
        res.status(500).json({ error: error });
      });
  });


/* 
Action:      DESTROY
Method:      DELETE
URI:        /api/requests/9plok8m7nijh6ubg5vyft4
Description: delete a spacific article with article ID
*/
router.delete('/api/requests/:id', requireToken, (req, res) => {
    Requests.findById(req.params.id)
    .then ((request) => {
        if (request) {
            // pass the result of mongose  .delete method to next.then statment
            return request.remove();
        } else {
            // if we couldent find a document with the matching ID
            res.status(404).json({
                error: {
                    name: 'DocumentNotFoundError',
                    message: 'The provided ID doesn\'t match any documents'
                }
            })
        }
    })
    .then(() => {
        // if delete succeded, return 204 and no JSON
        res.status(204).end();
    })
    // catch any errors that may occur
    .catch((error) => {
        res.status(500).json({error: error})
    })
})



// exports router to server
module.exports = router
