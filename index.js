const express = require('express');
const app = express();


const axios = require('axios');
const iconv = require('iconv-lite');

app.get('/', async (req, res) => {
  //res.send('Hello World!');
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'text/plain');
        const url = 'https://jbbs.shitaraba.net/bbs/rawmode.cgi/internet/26196/1735542868/'
        const response = await axios.get(url, {responseType: "arraybuffer",  transformResponse: [ (data) => {
                                        return iconv.decode(data, 'EUCJP').toString()
                                    }]})
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});