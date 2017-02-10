```
使用Nodejs+Mongodb+Kong ApiGateWay实现用户JWT认证
```

# 安装及配置

## 安装基础环境

安装Kong
安装Nodejs(>6.9.5)
安装Mongodb(>3.2.10)


## 安装工程依赖

```
sudo npm install -y
```

## 创建一个用户

```
node createdbuser.js
```
> 运行后将创建一个用户名为jwtuser和密码为jwtuser的用户



# 使用

## 创建Kong用户并创建JWT credential

```
node createkonguser.js
```
> 运行后将在Kong中创建一个username为jwtuser,custom_id为用户jwtuser在mongodb数据库中的ID，并会该用户创建一个JWT credential（"secret":"589d7eba0e5b702ea8548ace","key":"589d7eba0e5b702ea8548ace"其中key为JWT认证所需要的iss值,secret为解密值；这里都设置为用户ID）


## 在Kong中新增一个Api

```
node createapi.js
```
> 运行后将在Kong中创建一个名为jwttest的API接口，该接口指向http://localhost:3000/


## 在Kong中为Api接口增加JWT认证插件

```
node addjwtapi.js
```

## 为用户创建Token

```
node createtoken.js
```

> 运行后将会得到一个token值如eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1ODlkN2ViYTBlNWI3MDJlYTg1NDhhY2UiLCJleHAiOjE0ODY3MTg3MTk2Mjh9.ikAARRCxM4v2FzglC690FPQvx5RVddcOPW-ZBosOT-8

## 运行Node APP

```
node app.js
```

## 验证功能

```
culr http://localhost:8000/jwttest/userinfo?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1ODlkN2ViYTBlNWI3MDJlYTg1NDhhY2UiLCJleHAiOjE0ODY3MTg3MTk2Mjh9.ikAARRCxM4v2FzglC690FPQvx5RVddcOPW-ZBosOT-8
```

> 如输出jwtuser则证明成功


