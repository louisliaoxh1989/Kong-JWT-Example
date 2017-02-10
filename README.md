使用开源的ApiGateWay套件[Kong](https://getkong.org/)搭建一个JWT认证的Restful实例

# 安装Kong

```
参考文档：https://getkong.org/install/ubuntu/
```

```
Kong支持 PostgreSQL 9.4+ and Cassandra 2.2.x 这两种数据库，但使用PostgreSQL需要先使用语句
CREATE USER kong; CREATE DATABASE kong OWNER kong;
建好数据库，才可启动Kong
```
## 使用文件安装
``` bash
1. http://mirrors.hust.edu.cn/apache/cassandra/2.2.8/apache-cassandra-2.2.8-bin.tar.gz 
2. tar -xvf apache-cassandra-2.2.8-bin.tar.gz
3. cd apache-cassandra-2.2.8
4. vi conf/cassandra.yaml设置日志及数据库存放路径
5. 启动：bin/cassandra；停止：pkill -f CassandraDaemon

```

## 使用apt安装

```
1. echo "deb http://www.apache.org/dist/cassandra/debian 39x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
2. curl https://www.apache.org/dist/cassandra/KEYS | sudo apt-key add -
3. sudo apt-key adv --keyserver pool.sks-keyservers.net --recv-key A278B781FE4B2BDA
4. sudo apt-get update
5. sudo apt-get install cassandra
6. 配置/etc/cassandra，设置日志及数据库存放路径，默认为/var/log/cassandra/ and /var/lib/cassandra.
7. 启动 sudo service cassandra start
```

## 第二步安装Kong

https://getkong.org/install/ubuntu/

```
1. wget https://github.com/Mashape/kong/releases/download/0.9.7/kong-0.9.7.trusty_all.deb
2. sudo apt-get install netcat openssl libpcre3 dnsmasq procps perl
```


# 搭建过程


## 1. 先在Kong上新增一个需要使用Jwt认证的API


```
# 新增一个Api
curl -i -X POST http://localhost:8001/apis/ -d "name=testjwt" -d "request_path=/testjwt" -d "upstream_url=http://localhost:3000/" -d "strip_request_path=true"

# 为该API增加JWT认证插件
curl -X POST http://localhost:8001/apis/testjwt/plugins -d "name=jwt" -d "config.uri_param_names=jwt" -d "config.claims_to_verify=exp" 
```
> ***config.uri_param_names是url参数设定jwt认证对应token的值的参数名称***

> ***config.claims_to_verify=exp表示要验证token是否过期***



## 2.在应用程序(业务系统)新增调用API的用户时调用Kong的Consumers的API创建对应的Kong的用户

```
curl -X POST http://kong:8001/consumers \
    --data "username=<USERNAME>" \
    --data "custom_id=<CUSTOM_ID>"
```

>***此处的username和custom_id很重要，因为在token通过验证后，会在请求的头部(Headers)在增加x-consumer-custom-id(对应custom_id)和x-consumer-username(对应username)这两个值，这样在API接口端获取这两个值来做对应的业务逻辑，如获取用户的值，所以这两个值建议设置成为业务系统的用户名和用户唯一ID值***


## 3.继续在业务系统中为该新用户设置该用户在Kong中的JWT credential

```
curl -X POST http://172.16.52.89:8001/consumers/{username}/jwt -d "secret={publicSecretKey}" -d "key={userid}"

```

> ***其中{username}为用户名,secret的值是作为Kong验证token是解密的密钥，建议使用业务系统为用户创建的密钥或者可以使用用户唯一ID值，key的值是作为JWT验证token时必须的"iss"值，建议使用业务系统中用户的唯一ID值。***


## 4.在应用程序(业务系统)实现token的生成

>可以在https://jwt.io/#libraries-io 中查找对应编程语言的lib库来帮助你生成JWT的Token值
如使用nodejs的jwt-simple来生成token值

```
var jwt = require('jwt-simple');
var moment = require('moment');
var expires = moment().add('seconds', 120).valueOf()	var token = jwt.encode(
{
    iss: "5c08e9a934934bfe95f3a671e48bb73b",//user._id,
	exp: expires
}, 
	app.get('jwtTokenSecret')
);
```


## 5. 用户使用业务系统定义的接口得到Token

```
如 http://localhost/usercenter/gettoken?username=xxxx&pwd=yyyyyy
```

## 6. 用户使用得到的Token访问该API

```
http://localhost:8000/testjwt/userinfo?jwt=xxxxxxxxxxxxx
```


