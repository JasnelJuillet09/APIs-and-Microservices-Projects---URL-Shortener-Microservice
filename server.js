'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var dns = require('dns');
var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  const links = [];
let id = 0;
// your first API endpoint... 
app.post("/api/shorturl/new", function (req, res) {
  let  { url } = req.body;
 
  // console.log(url);
  
  // console.log(removeHttps);
  const removeHttps = url.replace(/^https?:\/\//, '');
  
   // verify invalid url
  dns.lookup(removeHttps, function( err, adresses, family){
    // console.log('name ', removeHttps);
    // console.log('adresses', adresses);
    // console.log('family', family);
    if(err){
      return res.json({
        error:"invalid URL"
      });
    }else{
      id++;
      const link = ({
        original_url:url,
        short_url:`${id}`
      })
      links.push(link);
      
      return res.json(link);
        
      
    }
  })
});

app.get('/api/shorturl/:id', function(req, res){
  const { id } = req.params;
  const link = link.find(l => l.short_url === id);
  if(link){
    return res.redirect(link.original_url);
  }else{
    return res.json({
      error: 'link not available'
    })
  }
});
app.listen(port, function () {
  console.log('Node.js listening ...');
});
