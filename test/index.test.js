var config  = require('path').resolve(__dirname+'/../config.env');
var env     = require('env2')(config);
var test    = require('tape');
var dir     = __dirname.split('/')[__dirname.split('/').length-1];
var file    = dir + __filename.replace(__dirname, '');
var decache = require('decache');

decache('../lib/index.js'); // clear cached email module
console.log("MANDRILL_APIKEY >>> "+process.env.MANDRILL_APIKEY)
var APIKEY = process.env.MANDRILL_APIKEY; // store for later
process.env.MANDRILL_APIKEY = null; // delete key to force fail
var email  = require('../lib/index.js'); // no api key

test(file+" Force Fail in Email", function(t) {
  var person = {
    "email"    : 'bad@example.com',
    "password" : "thiswill400"
  };
  email(person, function(eres) {
    setTimeout(function(){
      console.log(eres);
      t.equal(eres.status, 'error', "Invalid Mandrill Key");
      process.env.MANDRILL_APIKEY = APIKEY; // restore key for next tests
      // decache('../lib/'); // clear cached email module
      t.end();
    },50);
  })
});


// now make it pass
test(file+" Email Successfully Sent ", function(t) {
  var person = {
    "email"    : 'dwyl.test+email_welcome' +Math.random()+'@gmail.com',
    "password" : "NotRequiredToTestEmail!"
  };
  console.log("MANDRILL_APIKEY >>> "+APIKEY)
  process.env.MANDRILL_APIKEY = APIKEY; // restore key for next tests
  console.log("MANDRILL_APIKEY >>> "+process.env.MANDRILL_APIKEY)

  decache('../lib/index.js'); // clear cached email module
  var email  = require('../lib/index.js'); // WITH api key
  email(person, function(eres){
    console.log(' - - - - - - - - - - - - - - - - - - - ')
    console.log(eres);
    console.log(' - - - - - - - - - - - - - - - - - - - ')
    t.equal(eres[0].status, 'sent', "Email Sent "+eres[0]._id);
    // decache('../lib/email_welcome'); // clear cached email module
    t.end();
  })
});