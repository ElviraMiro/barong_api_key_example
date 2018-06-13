const axios = require('axios')
const OTPAuth = require('otpauth');
const base64 = require('base-64')
 
const jsonwebtoken = require('jsonwebtoken')

const config = require('./config.js')
const query = require('query-string')

//get jwt for BARONG_USER (var jwt)
axios({
    method: "post",
    url: config.URL_JWT,
    data: config.BARONG_USER
}).then((response)=>{
    var jwt = response.data;
    // create secret code
    let totp = new OTPAuth.TOTP({
        issuer: "Barong",
        label: config.BARONG_USER,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromB32(config.SECRET)
    });
    // Generate TOTP token.
    let code = totp.generate();
    console.log(code);
    axios({
        method: "post",
        url: config.URL_API_KEY,
        headers: {
            Authorization: `Bearer ${jwt}`
        },
        data: {
            totp_code: code,
            public_key: config.PUBLIC_KEY,
            scopes: 'external'
        }
    }).then((response)=>{
        var kid = response.data.uid
        console.log("API KEY inserted with KID:", kid)
    }).catch((err)=>{
        console.log("ERROR when ADD API KEY", err.response.status, err.response.statusText, err.response.data)
    })
}).catch((err)=>{
    console.log("ERROR when GET JWT", err)
})