const express = require('express');
const app = express();


const axios = require('axios');
const iconv = require('iconv-lite');
const Encoding = require('encoding-japanese');

const bodyParser = require('body-parser');
// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(express.json()); 

const cors = require('cors');
app.use(cors());

function string_to_buffer(src) {
  return (new Uint16Array([].map.call(src, function(c) {
    return c.charCodeAt(0)
  })));
}
var str2array = function(str){
	var array = [],i,il=str.length;
	for(i=0;i<il;i++) array.push(str.charCodeAt(i));
	return array;
};
function serializeFormEUCJP( idForm ){

	var forms = document.getElementById( idForm );
	var array = [];
	for(var i = 0; i < forms.length; i++){
		var elem = forms.elements[i];
		var strArray = str2array( elem.value );
		strArray = Encoding.convert(strArray,"EUCJP");
		array.push(encodeURIComponent(elem.name) + '=' + Encoding.urlEncode(strArray) );
	}
	return array.join('&');
}

function convEUCJP (str){
  var strArray = str2array( str );
  strArray = Encoding.convert(strArray,"EUCJP");
  return Encoding.urlEncode(strArray);
};

app.get('/', async (req, res) => {
  console.log("test")
  //res.send('Hello World!');
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Content-Type', 'text/plain');
        //const url = 'https://jbbs.shitaraba.net/bbs/rawmode.cgi/internet/26196/1735542868/'
        const url1 = req.query.url1;
        const url2 = req.query.url2;
        const url3 = req.query.url3;
        const url = "https://jbbs.shitaraba.net/bbs/rawmode.cgi/" + url1.toString() + "/" + url2.toString() + "/" + url3.toString() + "/";
        const response = await axios.get(url, {responseType: "arraybuffer",  transformResponse: [ (data) => {
                                        return iconv.decode(data, 'EUCJP').toString()
                                    }]})
        res.send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});



// POST method route
app.post('/',async (req, res) => {

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Content-Type', 'text/plain');
  const rawData = req.body;
  const url1 = rawData.url1;
  const url2 = rawData.url2;
  const url3 = rawData.url3;
  const name = rawData.name;
  const mail = rawData.mail;
  const message = rawData.message;

  const date = Math.round((new Date()).getTime() / 1000).toString();
  let rawUrl = "https://jbbs.shitaraba.net/bbs/read.cgi/" + url1 + "/" + url2 + "/" + url3 + "/";
  const data = { dir : url1, 
                  bbs: url2,
                  time: date,
                  name: convEUCJP(name),
                  mail: convEUCJP(mail),
                  message: convEUCJP(message),
                  key : url3 }
  let url = "https://jbbs.shitaraba.net/bbs/write.cgi/" + url1 + "/" + url2 + "/" + url3 + "/";
  url += ("?DIR=" + data.dir)
  url += ("&BBS=" + data.bbs)
  url += ("&TIME=" + data.time)
  url += ("&NAME=" + data.name)
  url += ("&MAIL=" + data.mail)
  url += ("&MESSAGE=" + data.message)
  url += ("&KEY=" + data.key)
  url += "/"
  const headers = {
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Specify allowed methods
            "Access-Control-Allow-Headers": "Content-Type, Authorization", // Specify allowed headers
            "Access-Control-Max-Age": 86400, 
            'Referer': rawUrl,
            'User-Agent': 'JaneStyle/3.74',
            'Content-Type': 'application/x-www-form-urlencoded',
            //'Content-Type': 'text/plain',
  }
   const response = await axios.post(url, data, {headers: headers})

          .then(() => {
              console.log(url)
              res.send('success')
          })

          .catch(err => {
          if(err != null){
            console.log('err', iconv.decode(err.toString(), 'EUCJP'));
            res.send('error', iconv.decode(err.toString(), 'EUCJP'))
          }
          //console.log('err', err)
          res.send('err', err)
          //res.send('err', iconv.decode(err.data, 'EUCJP').toString())
          });
})

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});