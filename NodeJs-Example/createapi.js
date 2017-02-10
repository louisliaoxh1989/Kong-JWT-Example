/**
 * Created by lxh on 17-2-10.
 */
var colors = require('colors');
var got = require('got');

var bodyData = {"name":"jwttest","request_path":"/jwttest","upstream_url":"http://localhost:3000/","strip_request_path":true};
got("http://localhost:8001/apis/", {body:bodyData,json: true}).then(response => {
    console.log('Kong Create Api Success'.green);
    console.log(colors.green(JSON.stringify(response.body)));
    process.exit();
}).catch(error => {
    console.log('Kong Create Api Err'.red);
    console.log(colors.red(JSON.stringify(error.response.body)));
    process.exit();
});