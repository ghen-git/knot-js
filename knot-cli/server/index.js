const express = require('express');
const testRoute = require('./routes/test-route');
const cors = require('cors')

const app = express();

const port = 4300;

app.use(cors());
app.listen(port, () => console.log(`App listening on port ${port}`));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use('/test-route', testRoute);
app.use('/', express.static('./static'));