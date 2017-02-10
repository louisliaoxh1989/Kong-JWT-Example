/**
 * Created by lxh on 17-2-10.
 */
var colors = require('colors');
var got = require('got');
var bodyData = {"name":"jwt","config.claims_to_verify":"exp"};
got("http://localhost:8001/apis/jwttest/plugins ", {body:bodyData,json: true}).then(response => {
    console.log('Kong Add JWT to  Api Success'.green);
console.log(colors.green(JSON.stringify(response.body)));
process.exit();
}).catch(error => {
    console.log('Kong Add JWT to  Api Err'.red);
console.log(colors.red(JSON.stringify(error.response.body)));
process.exit();
});