/* This node server is used to proxy all the api calls, which lets us hide all
 * the environmental constiables from the UI and gives us more control over
 * CORS headers, funtion of the api and stuff
 */
require('dotenv').config()
// Local back-end boilerplate to fetch data from API
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const app = express()
const PORT = process.env.PORT || 1337

app.use(bodyParser.json({extended: true}))

// Define CORS headers you want to use
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorz, Authorization'
  )
  next()
})

app.get('/*', (req, res, next) => {

    try {
      // console.log(req.headers)
      res.status(200).json('hello')
    } catch(err) {
      err.response
        ? res.status(err.response.status).send(err.response.data)
        : res.status(500).send({message: err.toString()})
    }
})

app.post('/*', (req, res, next) => {
    const userName = req.body.user_name
    const botPayload = {
      text: 'Hello ya cunts!'
    }
    try {
      if (userName !== 'willebot') {
        return res.status(200).json(botPayload)
      } else {
        return res.status(200).end()
      }
    } catch(err) {
      err.response
        ? res.status(err.response.status).send(err.response.data)
        : res.status(500).send({message: err.toString()})
    }
})

app.put('/*', (req, res, next) => {

    try {
      res.status(200).json('hello')
    } catch(err) {
       err.response
         ? res.status(err.response.status).send(err.response.data)
         : res.status(500).send({message: err.toString()})
   }
})

// SERVER LISTENER
app.listen(PORT, () => {
  console.log('Server is listening on port: %s', PORT)
})
