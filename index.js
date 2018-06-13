const axios = require('axios')
const base64 = require('base-64')
 
const jsonwebtoken = require('jsonwebtoken')

const config = require('./config.js')

// get new JWT for user
var payload = {
    iat: Math.round(new Date().getTime() / 1000) - 1,
    exp: Math.round(new Date().getTime() / 1000) + 4 * 3600,
    sub: 'api_key_jwt',
    iss: 'external',
    jti: 'D304AF7134FC22506E06CF93'
}
// sign payload
var newJWT = jsonwebtoken.sign(
    payload,
    base64.decode(config.PRIVATE_KEY),
    { algorithm: 'RS256'}
)
// generate peatio JWT
axios({
    method: 'post',
    url: config.URL_NEW_JWT,
    data: {
        kid: config.KID,
        jwt_token: newJWT
    }
}).then((response)=>{
    var peatio_token = response.data.token
    console.log("NEW TOKEN", peatio_token)
    // axios({
    //     method: 'post',
    //     url: config.URL_PEATIO,
    //     headers: {
    //         Authorization: `Bearer ${peatio_token}`
    //     },
    // }).then((resp)=>{
    //     console.log(resp.data)
    // }).catch((err)=>{
    //     console.log(err.response.data, err.response.status, err.response.statusText)
    // })
}).catch((err)=>{
    console.log(err.response.data, err.response.status, err.response.statusText)
})