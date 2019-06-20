// All server code uses ES5 because of Airtable plugin
require('dotenv').config()    // Access .env variables
const express = require('express')
const next = require('next')
const dashcore = require('@dashevo/dashcore-lib');

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT
const app = next({ dev })

const serialize = data => JSON.stringify({ data })

app.prepare()
  .then(() => {
    const server = express()

    // Internal API call to get Airtable data
    server.get('/verify_message', (req, res) => {

      var address = req.query.addr;
      var signature = req.query.sig;
      const msg = dashcore.Message(req.query.msg);

      isValidSig = msg.verify(address, signature);

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(isValidSig))
    })

    // Routing to main page
    server.get('*', (req, res) => {
      const actualPage = '/index'

      app.render(req, res, actualPage)
    })

    server.listen(port, (err) => {
      if (err) throw err
    })
  }).catch((ex) => {
    //console.error(ex.stack)
    process.exit(1)
  })