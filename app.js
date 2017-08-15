const express = require('express');
const bodyParser = require('body-parser');
const index = require('./routes/index');


const application = express();

// parse applicationlication/json
application.use(bodyParser.json());

application.use(index);

application.listen(3000, function(){
    console.log('Server listening on port 3000');
});

module.exports = application;