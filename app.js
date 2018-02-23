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
const { RtmClient, CLIENT_EVENTS, RTM_EVENT, WebClient } = require('@slack/client');

const channelId = 'C9EN8C66T';

// An access token (from your Slack app or custom integration - usually xoxb)
const token = process.env.SLACK_TOKEN;

// Cache of data
const appData = {};

// Initialize the RTM client with the recommended settings. Using the defaults for these
// settings is deprecated.
const rtm = new RtmClient(token, {
  dataStore: false,
  useRtmConnect: true,
});

// Need a web client to find a channel where the app can post a message
const web = new WebClient(token);

// Load the current channels list asynchrously
let channelsListPromise = web.channels.list();

// The client will emit an RTM.AUTHENTICATED event on when the connection data is available
// (before the connection is open)
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (connectData) => {
  // Cache the data necessary for this app in memory
  appData.selfId = connectData.self.id;
  console.log(`Logged in as ${appData.selfId} of team ${connectData.team.id}`);
})

// The client will emit an RTM.RTM_CONNECTION_OPENED the connection is ready for
// sending and receiving messages
rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  console.log(`Ready`)
  // Wait for the channels list response
  channelsListPromise.then((res) => {

    // Take any channel for which the bot is a member
    const channel = res.channels.find(c => c.is_member)

    if (channel) {
      // We now have a channel ID to post a message in!
      // use the `sendMessage()` method to send a simple string to a channel using the channel ID
      rtm.sendMessage('Hello, world!', channel.id)
        // Returns a promise that resolves when the message is sent
        .then(() => console.log(`Message sent to channel ${channel.name}`))
        .catch(console.error)
    } else {
      console.log('This bot does not belong to any channels, invite it to at least one and try again')
    }
  })
})

// Start the connecting process
rtm.start();

rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  // For structure of `message`, see https://api.slack.com/events/message

  // Skip messages that are from a bot or my own user ID
  if ( (message.subtype && message.subtype === 'bot_message') ||
    return;
  }

  rtm.sendMessage(`Did you say: ${message}`, channel.id)
    // Returns a promise that resolves when the message is sent
    .then(() => console.log(`Message sent to channel ${channel.name}`))
    .catch(console.error)

  // Log the message
  console.log('New message: ', message);
});

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
      text: 'Ya cunts!'
    }
    console.log(req)
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
