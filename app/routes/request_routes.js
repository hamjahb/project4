// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
//  ******** change this when models created ******
const Requests = require('../models/example')

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
Description: Get all pending requests
*/
router.get('/api/requests', (req, res) => {
    Requests.find({})
    .then((request) => {
        res.status(200).json({message: "dis shows all pending requests"})
    })
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
router.get('/api/requests/:id', (req, res) => {
    Requests.findById(req.params.id, (error, request) => {
        if(request){
            res.status(200).json({message: 'dis be show for requests'})
        } else {
            res.status(404).json({
                error: {
                  name: "DocumentNotFoundError",
                  message: "the provided id doesn't match any document"
                }
            })
        } 
    })
})



// exports router to server
module.exports = router