// All server code uses ES5 because of Airtable plugin
require('dotenv').config()    // Access .env variables
const express = require('express')
const next = require('next')
const dashcore = require('@dashevo/dashcore-lib');

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT
const app = next({ dev })

app.prepare()
  .then(() => {
    const server = express()

    // Internal API call to get Airtable data
    server.get('/verify_message', (req, res) => {      
      try {
        var address = req.query.addr;
        var input_sig = req.query.sig.toString();
        const message = dashcore.Message(req.query.msg);

        if (input_sig.match(' ') !== null) {
          var signature = input_sig.split(' ').join('+');
        } else {
          var signature = input_sig
        }
        
        isValidSig = message.verify(address, signature);

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(isValidSig))
      } catch(e) {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify('Error:'+e+req.query.sig.toString()))
      }
      
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