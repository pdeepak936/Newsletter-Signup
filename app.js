//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { response } = require('express');

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})
app.post('/', (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/bef3fdf4c2";

    const options = {
        method: "POST",
        auth: "Deepak:7927e06331010c7fe10fa32baa77fdc5-us14"
    }

    const request = https.request(url, options, (response) =>{

        if(response.statusCode === 200){
            res.sendFile(__dirname + '/success.html');
        }else{
            res.sendFile(__dirname+'/failure.html');
        }

        response.on(data,(data)=>{
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post('/failure',(req,res)=>{
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, () =>{
    console.log('server started on port 3000');
})

//Api key
//7927e06331010c7fe10fa32baa77fdc5-us14
//List Id
//bef3fdf4c2