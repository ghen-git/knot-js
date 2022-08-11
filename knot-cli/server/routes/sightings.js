const express = require('express');
const router = express.Router();

router.get('/test-get', async (req, res) => 
{
    res.end('msg-get');
});

router.post('/test-post', async (req, res) => 
{ 
    res.end(`${req.body.msg}`);
});

module.exports = router;
