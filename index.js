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
function garble (text, times = 3, recipient, langs_used){
    //console.log (text);
    //console.log (times);
    if (times > 0){
        lang_key = randLang();
        translate(text , {to: lang_key}
        ).then ( res => {
           garble (res.text, times - 1, recipient, langs_used + " → " + languages[lang_key]);
        }).catch (err => {
            console.error(err);
        });
    } 
    else {
        translate(text, {to: 'en'}
        ).then (res => {
            langs_used += " →` English";
            if (res.text.length < 30) {
                console.log ("Finished garble: \"" + res.text +"\"");
            }
            else {
                console.log ("Finished garble: \"" + res.text.slice(0, 27) +"...\"");
            }
            recipient.send (res.text + "<p2 style =\"font-size:.8em; color:#36454f;\" ><br><hr>" + langs_used + "</p2>");
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
    if (req.body.text.length < 30) {
        console.log("Recived request: \"" + req.body.text + "\" for " + req.body.count + " rounds.");
    }
    else {
        console.log("Recived request: \"" + req.body.text.slice(0,27) + "...\" for " + req.body.count + " rounds.");
    }
    garble (req.body.text, req.body.count , res, "Your input");
})
app.listen(process.env.PORT || 5000)
