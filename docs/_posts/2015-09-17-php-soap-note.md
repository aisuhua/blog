---
layout: post
title:  "学习 PHP SOAP 扩展的一些笔记"
date:   2015-09-17 15:18:44
category: soap
author: aisuhua
copyright: true
advertisement: true
---

## 如何理解 ##

因为 SOAP Web 服务是基于 HTTP 协议的，发出一个 SOAP 消息请求，实际上利用 HTTP 动词中的 `POST`，然后把 SOAP 消息放置在 HTTP body 里面发送。简单来说就是：每调用一次 SOAP 服务，就是发送一条 POST 请求。

下面是一次请求接口所发送的内容：

	POST /webservices/qqOnlineWebService.asmx HTTP/1.1
	Host: www.webxml.com.cn
	Connection: Keep-Alive
	User-Agent: PHP-SOAP/5.4.29
	Content-Type: application/soap+xml; charset=utf-8; action="http://WebXml.com.cn/qqCheckOnline"
	Content-Length: 247

	<?xml version="1.0" encoding="UTF-8"?>
	<env:Envelope
	    xmlns:env="http://www.w3.org/2003/05/soap-envelope"
	    xmlns:ns1="http://WebXml.com.cn/">
	    <env:Body>
	        <ns1:qqCheckOnline>
	            <ns1:qqCode>8698053</ns1:qqCode>
	        </ns1:qqCheckOnline>
	    </env:Body>
	</env:Envelope>

我们可以看到，一次 SOAP 请求，实际上就是向服务器端发送了一个 `POST` 请求。而发送的内容正是 SOAP 消息（它表明你本次调用的接口方法以及参数等等）。

这个 POST 请求，有一些特点，比如：它发送的内容类型为：`application/soap+xml`，用户代理为 `PHP-SOAP/5.4.29` ，其他特点自己观察，不多说。

## SOAP 扩展的作用 ##

实际上，既然我们知道请求一次接口只是发送一次 POST 请求，那么我们完全可以使用一些工具或 PHP 本身自带的一些库（比如 curl、fsockopen）模拟发送 POST 请求，而不需要使用 PHP 的 SOAP 扩展。对，没错！在 PHP 还没有提供 SOAP 扩展前，的确很多人也是这样做的。

那干嘛要用 SOAP 扩展呢？ 因为它官网的呗，因为它用 C 语言写的，速度杠杠的，而且封装得很好用，也不需要自己编写繁琐的 XML 代码了，所以就用它。

换句话说，实际上 SOAP 扩展就是一个更好用，速度更快，专门用于处理 SOAP 服务的 HTTP 封装库，没有什么很深奥的东西。


## 使用方法 ##

PHP 的帮助手册，有关于 SOAP 扩展的详细说明文档，已经对如何使用说得很清楚了，特别手册后面的一些用户的评论和贡献的代码片段，基本上可以解决你大部分的问题。下面记录一下自己在开发过程中遇到的一些问题，以及解决的方法和一些需要注意的地方。

### WSDL 和 non-WSDL ###

现在基本上所有 SOAP Web 服务都提供 WSDL 接口描述文件，所以 non-WSDL 这种模式基本上不用考虑。

### 关于 SOAP 版本 ###

PHP SOAP 扩展同时支持 SOAP 1.1 和 SOAP 1.2 两个版本。一般来说，现在的接口基本上也同时支持这两个 SOAP 协议版本进行通信，那么在这种情况下，当然是采用高版本的 SOAP 1.2 了。实际上，无论你是使用哪个版本，如果你是使用 SOAP 扩展来调用服务的话，在使用该扩展过程中没有任何区别，对你来说都是一样的。唯一需要你去做的是在 `SoapCient` 进行初始化时，把 soap_version 设置为 SOAP_1_1 或 SOAP_1_2 即可，就像下面这样：

	// SOAP 1.1 
	$client = new SoapClient($wsdl, [
	    'soap_version' => SOAP_1_1
	]);

	// SOAP 1.2
	$client = new SoapClient($wsdl, [
	    'soap_version' => SOAP_1_2
	]);

### SoapParam 和 SoapVar ###

上面已经说了，现在的服务基本上都提供 WSDL 描述文件，如果是这样的话，这两个类 `SoapParam` 和 `SoapVar` 你基本上可以不用管，因为 SOAP 之所以提供这两个类，主要还是为了 PHP SOAP 扩展能够去使用一些没有 WSDL 描述文件的服务，当然这种情况基本上已经不存在了。

### 关于 __soapCall 方法 ###

该方法也一样，一般都它只会用于 non-WSDL 模式下，因为在 WSDL 模式下，完全可以把你需要调用的方法作为 `SoapClient` 对象的一个方法进行调用。不过，如果调用方法的 uri 与 默认的 uri 不一样时，又或者调用该方法时，你必须为它带上一个 SOAP Header 时，就需要使用 `__soapCall` 方法了。下面是摘自官方手册的一段话：

> This is a low level API function that is used to make a SOAP call. Usually, in WSDL mode, SOAP functions can be called as methods of the SoapClient object. This method is useful in non-WSDL mode when soapaction is unknown, uri differs from the default or when sending and/or receiving SOAP Headers.

`__soapCall` 在使用上与通过方法名直接调用的方式有一些区别。下面我们来看看几个例子。同样的，我们还是使用一个网络上可以免费使用的 SOAP 服务配合我们，该服务的主要作用是通过 QQ 号来查询该用户的在线状态。[服务地址](http://www.webxml.com.cn/webservices/qqOnlineWebService.asmx?op=qqCheckOnline)

下面是请求该服务时，应该发送的 SOAP 消息：

	<?xml version="1.0" encoding="utf-8"?>
	<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
	    <soap12:Body>
	        <qqCheckOnline xmlns="http://WebXml.com.cn/">
	            <qqCode>string</qqCode>
	        </qqCheckOnline>
	    </soap12:Body>
	</soap12:Envelope>

通过方法名调用该接口：

	<?php
	$wsdl = 'http://www.webxml.com.cn/webservices/qqOnlineWebService.asmx?wsdl';
    $client = new SoapClient($wsdl, [
        'soap_version' => SOAP_1_2
    ]);

    $client->qqCheckOnline([
        'qqCode' => 8698053
    ]));

使用 `__soapCall` 方法调用该接口：

	<?php
	$wsdl = 'http://www.webxml.com.cn/webservices/qqOnlineWebService.asmx?wsdl';
    $client = new SoapClient($wsdl, [
        'soap_version' => SOAP_1_2
    ]);

    $client->__soapCall('qqCheckOnline', [
        ['qqCode' => 8698053]
    ]);

重点关注两种调用方式时，参数的不一样。通过方法名直接调用的方式，参数是一维数组，而通过 `__soapCall` 方法调用时，参数是二维数组，这是它们之间的区别之一。

还有第二个区别，就是 `__soapCall` 方法可以在调用接口时，添加额外的 SOAP Header，比如这样：


	$wsdl = 'http://www.example.com/service.asmx?wsdl';
    $client = new SoapClient($wsdl, [
        'soap_version' => SOAP_1_2
    ]);

    $auth = ['sAuthenticate' => 'ab3cde34f5r4545g'];
    $namespace = 'http://www.example.com';
    
    $header = new SoapHeader($namespace, 'AuthenHeader', $auth, false);
	$client->__soapCall("SomeFunction", $parameters, null, $header);

虽然 `SoapClient` 也有 `__setSoapHeaders` 方法，但是它会给该实例的所有方法都添加上 SOAP Header，如果存在有些方法需要 SOAP Header 而有些又不需要的话，那么就必须使用 `__soapCall` 方法，针对某个方法来添加 SOAP Header 了。

### 关于命名空间（namespace） ###

实际上，在 WSDL 模式下，如果不需要发送 SOAP Header 的话，那么 `namespace` 是用不上的，因为 `namespace` 实际上已经在 WSDL 文件中有所描述了，PHP 的 SOAP 扩展会自动把它从 WSDL 文件中解析出来，用于构造 SOAP 请求。如果 SOAP 消息中，需要添加 SOAP Header 的话，那么必须提供 `namespace`。举个例子：

比如说，有一个服务它需要你发送的 SOAP 消息中必须有 SOAP Header，像下面一样：

	<?xml version="1.0" encoding="utf-8"?>
	<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
	    <soap12:Header>
	        <AuthenHeader xmlns="http://www.example.cn">
	            <sAuthenticate>string</sAuthenticate>
	        </AuthenHeader>
	    </soap12:Header>
	    <soap12:Body>
	        <GetUserInfoById xmlns="http://www.example.cn">
	            <UserID>int</UserID>
	        </GetUserInfoById>
	    </soap12:Body>
	</soap12:Envelope>

下面是构造该 SOAP 请求的代码：

	<?php
	$wsdl = 'http://www.example.com/service.asmx?wsdl';
    $client = new SoapClient($wsdl, [
        'soap_version' => SOAP_1_2
    ]);

    $auth = ['sAuthenticate' => 'ab3cde34f5r4545g'];
    $namespace = 'http://www.example.com';
    
    $header = new SoapHeader($namespace, 'AuthenHeader', $auth, false);
    $client->__setSoapHeaders($header);    
    
    $response = $client->GetUserInfoById([
        'UserID' => 100
    ]);

可以看到，使用 `SoapHeader` 来构建一个 SOAP Header 时，必须提供 `namespace`，而且是正确的命名空间。

其实，构造一个 SOAP Header 的方法不止这一种写法，还有其他写法，比如你还可以这样构造与上面一样的 SOAP 消息：

	<?php
	class AuthenHeader
    {
        private $sAuthenticate;
        
        public function __construct($auth)
        {
            $this->sAuthenticate = $auth;
        }
    }
    
    $wsdl = 'http://www.example.com/service.asmx?wsdl';
    $client = new SoapClient($wsdl, [ 
        'soap_version' => SOAP_1_2 
    ]);
    
    $auth = 'ab3cde34f5r4545g';
    $namespace = 'http://www.example.com';
    
    $authenHeader = new AuthenHeader($auth);
    
    $header = new SoapHeader($namespace, 'AuthenHeader', $authenHeader, false);
    $client->__setSoapHeaders($header);
    
    $response = $client->GetUserInfoById([ 
        'UserID' => 100 
    ]);

关于 `SoapHeader` 其他更多的用法，推荐翻阅 PHP 手册中的 [SOAP 章节](http://php.net/manual/zh/book.soap.php)。

### 关于 SoapFault ###

服务端在处理客户端请求发生错误时，将会抛出 SoapFault 异常。对于 SOAP 扩展中，哪些方法可能会抛出异常可以查看手册。一旦发生了异常，我们都应该捕捉它们，并妥善处理。像下面这样：

	try {
        $client = new SoapClient($wsdl, [
            'trace' => true,
            'soap_version' => SOAP_1_2
        ]);

        .....
    } catch(SoapFault $e) {
        //在这里处理异常
    }


### getLastRequest 和 getLastResponse ###

这两个方法可以查看最近一次请求和响应的内容，这两个方法对于调试很有帮助。当然，这两个方法只有在 `SoapClient` 实例化时，`trace` 参数设置为 `true` 才会生效。比如像这样：

	<?php
	$wsdl = 'http://www.webxml.com.cn/webservices/qqOnlineWebService.asmx?wsdl';
    $client = new SoapClient($wsdl, [
        'trace' => true,
        'soap_version' => SOAP_1_2
    ]);

    $client->qqCheckOnline([
        'qqCode' => 8698053
    ]));

    echo $client->__getLastRequest();
	echo $client->__getLastResponse();

getLastRequest() 输出的内容：

	<?xml version="1.0" encoding="UTF-8"?>
	<env:Envelope
	    xmlns:env="http://www.w3.org/2003/05/soap-envelope"
	    xmlns:ns1="http://WebXml.com.cn/">
	    <env:Body>
	        <ns1:qqCheckOnline>
	            <ns1:qqCode>8698053</ns1:qqCode>
	        </ns1:qqCheckOnline>
	    </env:Body>
	</env:Envelope>

getLastResponse() 输出的内容：

	<?xml version="1.0" encoding="utf-8"?>
	<soap:Envelope
	    xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
	    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	    xmlns:xsd="http://www.w3.org/2001/XMLSchema">
	    <soap:Body>
	        <qqCheckOnlineResponse
	            xmlns="http://WebXml.com.cn/">
	            <qqCheckOnlineResult>Y</qqCheckOnlineResult>
	        </qqCheckOnlineResponse>
	    </soap:Body>
	</soap:Envelope>

### SoapUI 调试工具 ###

在调试 SOAP 服务接口时，我们可以使用功能强大的 [SoapUI](http://www.soapui.org/) 工具，可以很方便地调试接口。

[![SoapUI](http://7xluvh.com1.z0.glb.clouddn.com/2015-8-18/soapui.png)](http://7xluvh.com1.z0.glb.clouddn.com/2015-8-18/soapui.png)

## 总结 ##

上面都是自己在学习 PHP SOAP 扩展时的一些零散的笔记，如果有不对的地方，希望大家指出，谢谢。
