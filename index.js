const axios = require('axios')

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
    axios({
        method: "post",
        url: config.URL_NEW_2FA,
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    }).then((response)=>{
        var data = query.parse(response.data.data.url)
        console.log("QR", response.data)
        axios({
            method: "post",
            url: config.URL_2FA,
            headers: {
                Authorization: `Bearer ${jwt}`
            },
            data: {
                code: data.secret
            }
        }).then((response)=>{
            console.log("ENABLED", response)
            axios({
                method: "post",
                url: config.URL_API_KEY,
                headers: {
                    Authorization: `Bearer ${jwt}`
                },
                data: {
                    code: "AIzaSyCx-EMi-FX3YfsuqmL45uG_QYd0g1_Q1rM",
                    public_key: config.PUBLIC_KEY,
                    scopes: 'external'
                }
            }).then((response)=>{
                console.log(response)
            }).catch((err)=>{
                console.log("ERROR when ADD API KEY", err.response.status, err.response.statusText, err.response.data)
            })
        }).catch((err)=>{
            console.log("ERROR when enabled 2FA", err.response.status, err.response.statusText, err.response.data)
        })
    }).catch((err)=>{
        console.log("ERROR when CREATE 2FA", err.response.status, err.response.statusText, err.response.data)
    })
}).catch((err)=>{
    console.log("ERROR when GET JWT", err.response.data)
})