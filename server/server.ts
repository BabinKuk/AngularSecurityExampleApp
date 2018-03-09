

import * as express from 'express';
import {Application} from "express";
import * as fs from 'fs';
import * as https from 'https';
import {readAllLessons} from "./read-all-lessons.route";
import { userInfo } from './user-info.route';
const bodyParser = require('body-parser');

const jwksRsa = require('jwks-rsa');
const jwt = require('express-jwt');

const app: Application = express();

app.use(bodyParser.json());

const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'secure', type: Boolean,  defaultOption: true },
];

const options = commandLineArgs(optionDefinitions);

// config middleware
// validate jwt (fetch public key from auth0 site)
const checkIfAuthenticated = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true, // default
    rateLimit: true, // default
    jwksUri: 'https://babinkuk.eu.auth0.com/.well-known/jwks.json' //JSON Web Key Set (from auth0)
  }),
  algorithms: ['RS256']
});

// middleware
app.use(checkIfAuthenticated);

// error handling middleware
app.use((err, req, res, next) => {
  if (err && err.name == 'UnauthorizedError') {
    res.status(err.status).json({message: err.message});
  } else {
    next(); // jwt validation ok
  }
});

// REST API
app.route('/api/lessons')
    .get(readAllLessons);

app.route('/api/userinfo')
    .put(userInfo);

if (options.secure) {

    const httpsServer = https.createServer({
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    }, app);

    // launch an HTTPS Server. Note: this does NOT mean that the application is secure
    httpsServer.listen(9000, () => console.log("HTTPS Secure Server running at https://localhost:" + httpsServer.address().port));

}
else {

    // launch an HTTP Server
    const httpServer = app.listen(9000, () => {
        console.log("HTTP Server running at https://localhost:" + httpServer.address().port);
    });

}

