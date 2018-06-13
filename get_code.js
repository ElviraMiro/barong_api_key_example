const config = require('./config.js')
const axios = require('axios')
const query = require('query-string')
const OTPAuth = require('otpauth');

//get jwt for BARONG_USER (var jwt)
axios({
    method: "post",
    url: config.URL_JWT,
    data: config.BARONG_USER
}).then((response)=>{
    var jwt = response.data;
    // get secret code for generating google authenticator's code
    axios({
        method: "post",
        url: config.URL_QR,
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    }).then((response)=>{
        var queryData = query.parseUrl(response.data.data.url)
        console.log("Add below code to config.js in SECRET section")
        console.log("SECRET CODE: ", queryData.query.secret)
        let totp = new OTPAuth.TOTP({
            issuer: "Barong",
            label: "admin@barong.io",
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromB32(queryData.query.secret)
        });
        // Generate TOTP token.
        let code = totp.generate();
        
        console.log("=======================")
        // enable 2FA
        axios({
            method: "post",
            url: config.URL_2FA,
            headers: {
                Authorization: `Bearer ${jwt}`
            },
            data: {
                code: code
            }
        }).then((resp)=>{
            console.log("User is enabled 2FA")
        }).catch((err)=>{
            if (err.response) {
                console.log("ERROR when enabled 2FA", err.response.status, err.response.statusText)
            } else {
                console.log("ERROR when enabled 2FA", err)
            }
        })
    }).catch((err)=>{
        if (err.response) {
            console.log("ERROR when start 2FA", err.response.status, err.response.statusText, err.response.data)
        } else {
            console.log("ERROR when start 2FA", err)
        }
    })
}).catch((err)=>{
    console.log("ERROR when GET JWT", err)
})