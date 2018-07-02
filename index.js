const express = require('express');
const app = express();
const translate = require('google-translate-api');
const languages = require('./node_modules/google-translate-api/languages.js');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
var text = "20 teeth start at age 2 and end at age 6. Then 24 teeth last from age 6–12. Then 28 teeth last till age 16–20. The last 4 wisdom teeth emerge then, but only if there is room, which is unlikely among some northerners."
var langs = Object.keys(languages);
function randLang (){
    return langs [Math.floor(Math.random() * (langs.length - 2))];
}
function garble (text, times = 30, recipient){
    console.log (text);
    console.log (times);
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
            console.log ("done: " + res.text);
            recipient.send (res.text);
        }).catch(err => {
            console.error(err);
        });
    }
}   
/*app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})*/
app.get('/', function (req, res) {
    res.send("Hello");
})
app.post('/', function (req, res) {
        console.log (req.body);
        console.log("begining garble on: " + req.body.text);
        garble (req.body.text, req.body.count , res);
})
app.listen(5000, () => console.log('Translator listening on port 5000!'))
//garble(text, 3)
