const express = require('express');
const app = express();

const axios = require('axios');

app.get('/', async (req, res) => {
  //res.send('Hello World!');
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'text/plain');
        const response = await axios.get('https://jbbs.shitaraba.net/bbs/rawmode.cgi/internet/26196/1735542868/');
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});