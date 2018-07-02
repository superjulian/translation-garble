const express = require('express');
const app = express();
const translate = require('google-translate-api');
const languages = require('./node_modules/google-translate-api/languages.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var langs = Object.keys(languages);
function randLang (){
    return langs [Math.floor(Math.random() * (langs.length - 2))];
}
function garble (text, times = 30, recipient){
    //console.log (text);
    //console.log (times);
    if (times > 0){
        translate(text , {to: randLang()}
        ).then ( res => {
           garble (res.text, times - 1, recipient);
        }).catch (err => {
            console.error(err);
        });
    } 
    else {
        translate(text, {to: 'en'}
        ).then (res => {
            console.log ("Finished garble\": " + res.text +"\"");
            recipient.send (res.text);
        }).catch(err => {
            console.error(err);
        });
    }
}   
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
app.post('/', function (req, res) {
        //console.log (req.body);
        console.log("Recived request: \"" + req.body.text + "\" for " + req.body.count + " rounds.");
        garble (req.body.text, req.body.count , res);
})
app.listen(process.env.PORT || 5000)
