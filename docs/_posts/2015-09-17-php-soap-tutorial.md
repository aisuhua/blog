---
layout: post
title:  "PHP SOAP 扩展的使用"
date:   2015-09-17 09:18:44
category: soap
author: aisuhua
copyright: false
---

原文地址：[PHP SOAP 扩展](http://www.yeeyan.org/articles/view/jimmylee/5424)，本文在原文基础上添加了一些内容和章节，也加入了一些注释，请读者注意。

## 简介 ##

PHP 的 SOAP 扩展可以用来提供和使用 Web Services。换句话说，PHP 开发者可以利用这个 PHP 扩展来写他们自己的 Web Services，也可以写一些客户端来使用给定的 Web Services。

PHP5 中的这个 SOAP 扩展目的是为了实现 PHP 对 Web Services 的支持。与其它实现 PHP 对 Web Services 的支持的方法不同，SOAP 扩展是用 C 写的，因此它比其它方法具有速度优势。注：SOAP 扩展是在 PHP5 才开始提供，所以在此之前人们要使用 SOAP 去调用 Web Services 时，一般是使用第三方提供的 SOAP 封装库来实现，比如：[NuSOAP](https://github.com/tinoadams/NuSOAP)。

SOAP 扩展支持以下规范：

* SOAP 1.1
* SOAP 1.2
* WSDL 1.1

SOAP 扩展主要用来处理 RPC 形式的 Web Services。不过，你也可以使用文本形式的 WSDL 文件配合 WSDL 模式的服务端和客户端。

这个扩展使用 [GNOME XML](http://www.xmlsoft.org/) 库来处理XML。

## 扩展中的类 ##

这个扩展实现了6个类。其中有三个高级的类，它们的方法很有用，它们是 SoapClient、SoapServer 和SoapFault。另外三个类除了构造器外没有其它别的方法，这三个是低级的类，它们是 SoapHeader、SoapParam 和 SoapVar。

SOAP 扩展关系图：

[![SOAP 扩展关系图1](http://7xluvh.com1.z0.glb.clouddn.com/2015-9-17soap_ext_class_diagram.png)](http://7xluvh.com1.z0.glb.clouddn.com/2015-9-17soap_ext_class_diagram.png)

上图并不是很准确，因为 SoapServer 也可以在响应时发送 SoapHeader。所有会有下面这个更加准确的关系图：

[![SOAP 扩展关系图2](http://7xluvh.com1.z0.glb.clouddn.com/2015-9-17soap_ext_class_diagram_2.gif)](http://7xluvh.com1.z0.glb.clouddn.com/2015-9-17soap_ext_class_diagram_2.gif)

### SoapClient 类 ###

这个类用来使用 Web Services。SoapClient 类可以作为给定 Web Services 的客户端。
它有两种操作形式：

- WSDL 模式
- Non-WSDL 模式

在 WSDL 模式中，构造器可以使用 WSDL 文件名作为参数，并自动从 WSDL 中提取使用服务时所需要的信息。

Non-WSDL 模式中使用参数来设置使用服务时所需要的信息。这个类有许多可以用来使用服务的有用的方法。其中 SoapClient::__soapCall() 是最重要的。这个方法可以用来调用服务中的某个操作。

### SoapServer 类 ###

这个类可以用来提供 Web Services。与 SoapClient 类似，SoapServer 也有两种操作模式：WSDL 模式和 non-WSDL模式。这两种模式的意义跟 SoapClient 的两种模式一样。在 WSDL 模式中，服务实现了 WSDL 提供的接口；在 non-WSDL 模式中，参数被用来管理服务的行为。

在 SoapServer 类的众多方法中，有三个方法比较重要。它们是 SoapServer::setClass()、SoapServer::addFunction() 和 SoapServer::handle()。

SoapServer::setClass()方法设定用来实现 Web Services 的类。SoapServer::setClass 所设定的类中的所有公共方法将成为 Web Services 的操作（operation）。

SoapServer::addFunction() 方法用来添加一个或多个作为 Web Services 操作（operation）的函数。

SoapServer:: handle() 方法指示 Web Services 脚本开始处理进入的请求。Web Services 脚本是用 PHP 脚本写的一个或多个 SoapServer 对象的实例。尽管你可以有不止一个的 SoapServer 对象，但通常的习惯是一个脚本只拥有一个 SoapServer 实例。在调用 SoapServer::handle() 方法之前，Web Services 脚本会使用设置在 SoapServer 对象实例上的任何信息来处理进入的请求和输出相应的内容。

### SoapFault 类 ###

这个类从 Exception 类继承而来，可以用来处理错误。SoapFault 实例可以抛出或获取 Soap 错误的相关信息并按程序员的要求处理。

### SoapHeader 类 ###

这个类可以用来描述 SOAP headers。它只是一个只包含构造器方法的数据容器。

### SoapParam 类 ###

SoapParam 也是一个只包含构造器方法的数据容器。这个方法可以用来描述传递给 Web Services 操作的参数。在 non-WSDL 模式中这是一个很有用的类，可以用来传递所期望格式的参数信息。

### SoapVar 类 ###

SoapVar 也是一个只包含构造器的低级类，与 SoapHeader 和 SoapParam 类相似。这个类可以用来给一个Web Services 操作传递编码参数。这个类对 non-WSDL 中传递类型信息是非常有用的。

----------

注：SoapParam 和 SoapVar 主要用来封装用于放入 SOAP 请求中的数据，他们主要在 non-WSDL 模式下使用。事实上，在 WSDL 模式下，SOAP 请求的参数可以通过数组方式包装，SOAP 扩展会根据 WSDL 文件将这个数组转化成为 SOAP 请求中的数据部分，所以并不需要这两个类。而在 non-WSDL 模式下，由于没有提供 WSDL 文件，所以必须通过这两个类进行包装。

SoapHeader 类用来构造 SOAP 头，SOAP 头可以对 SOAP 的能力进行必要的扩展。SOAP 头的一个主要作用就是用于简单的身份认证。

## WSDL VS. non-WSDL 模式 ##

Web Services 有两种实现模式：契约先行（Contract first）模式和代码先行（Code first）模式。

契约先行模式使用了一个用 XML 定义的服务接口的WSDL文件。WSDL 文件定义了服务必须实现或客户端可以使用的接口。SoapServer 和 SoapClient 的 WSDL 模式就基于这个概念。

在代码先行模式中，首先要先写出实现服务的代码。然后在大多数情况下，代码会产生一个契约（可以借助一些工具生成），换种说法，一个 WSDL 文件。接着客户端在使用服务的时候就可以使用那个 WSDL 来获得服务的接口及其他信息。尽管如此，PHP5 的扩展并没有从代码输出一个 WSDL 的实现，考虑到这种情况，可以在 non-WSDL 模式下使用 SoapServer 和 SoapClient。

## 使用 SOAP 扩展实现 Hello World ##

这一节介绍如何使用 WSDL 模式和 non-WSDL 模式来实现服务和客户端。相对而言，使用 WSDL 模式来实现服务和客户端会比较容易，假定已经有一个定义好了接口的 WSDL 文件。因此这一节会先介绍如何使用 WSDL 模式实现一个 Web Service。

### 安装 SOAP 扩展 ###

对于 Windows 平台，需要在 php.ini 中加入如下代码：

	extension = php_soap.dll

上面的工作完成之后，还需要注意的是 SOAP 扩展在配置文件中有独立的代码片段：

	[soap]
	; Enables or disables WSDL caching feature.
	; http://php.net/soap.wsdl-cache-enabled
	soap.wsdl_cache_enabled=1
	
	; Sets the directory name where SOAP extension will put cache files.
	; http://php.net/soap.wsdl-cache-dir
	soap.wsdl_cache_dir="D:/wamp/tmp"
	
	; (time to live) Sets the number of second while cached file will be used
	; instead of original one.
	; http://php.net/soap.wsdl-cache-ttl
	soap.wsdl_cache_ttl=86400
	
	; Sets the size of the cache limit. (Max. number of WSDL files to cache)
	soap.wsdl_cache_limit = 5

这些配置项主要是用来指定 PHP 处理 WSDL 文件时使用缓存的行为。这几个配置项分别说明：是否开启 WSDL 文件缓存、文件缓存位置、缓存时间、以及最大缓存文件数量。启用缓存会加快 PHP 处理 WSDL 文件的速度，但最好在调试代码时关闭缓存，以避免一些因缓存行为而出现的问题。

### WSDL 文件 ###

在这个 Hello World 例子的服务中有一个被命名为 greet 的操作。这个操作有一个字符串形式的名字参数并返回一个字符串形式的 Hello + 名字。所用到的 WSDL 如下：

	<wsdl:definitions
	    xmlns:impl='http://localhost/php-soap/wsdl/helloService'
	    xmlns:intf='http://localhost/php-soap/wsdl/helloService'
	    xmlns:wsdl='http://schemas.xmlsoap.org/wsdl/'
	    xmlns:wsdlsoap='http://schemas.xmlsoap.org/wsdl/soap/'
	    xmlns:xsd='http://www.w3.org/2001/XMLSchema' 
	    targetNamespace='http://localhost/php-soap/wsdl/helloService'>
	    <wsdl:types>
	        <schema elementFormDefault='qualified'
	            xmlns:impl='http://localhost/php-soap/wsdl/helloService'
	            xmlns:intf='http://localhost/php-soap/wsdl/helloService'
	            xmlns:wsdl='http://schemas.xmlsoap.org/wsdl/'
	            xmlns="http://www.w3.org/2001/XMLSchema" 
	            targetNamespace='http://localhost/php-soap/wsdl/helloService' >
	            <element name='greet'>
	                <complexType>
	                    <sequence>
	                        <element name='name' type='xsd:string' />
	                    </sequence>
	                </complexType>
	            </element>
	            <element name='greetResponse'>
	                <complexType>
	                    <sequence>
	                        <element name='greetReturn' type='xsd:string' />
	                    </sequence>
	                </complexType>
	            </element>
	        </schema>
	    </wsdl:types>
	    <wsdl:message name='greetRequest'>
	        <wsdl:part name='parameters' element='impl:greet' />
	    </wsdl:message>
	    <wsdl:message name='greetResponse'>
	        <wsdl:part name='parameters' element='impl:greetResponse' />
	    </wsdl:message>
	    <wsdl:portType name='helloService'>
	        <wsdl:operation name='greet'>
	            <wsdl:input name='greetRequest' message='impl:greetRequest' />
	            <wsdl:output name='greetResponse' message='impl:greetResponse' />
	        </wsdl:operation>
	    </wsdl:portType>
	    <wsdl:binding name='helloServiceSoapBinding' type='impl:helloService'>
	        <wsdlsoap:binding transport='http://schemas.xmlsoap.org/soap/http' style='document' />
	        <wsdl:operation name='greet'>
	            <wsdlsoap:operation soapAction='helloService#greet' />
	            <wsdl:input name='greetRequest'>
	                <wsdlsoap:body use='literal' />
	            </wsdl:input>
	            <wsdl:output name='greetResponse'>
	                <wsdlsoap:body use='literal' />
	            </wsdl:output>
	        </wsdl:operation>
	    </wsdl:binding>
	    <wsdl:service name='helloService'>
	        <wsdl:port binding='impl:helloServiceSoapBinding' name='helloService'>
	            <wsdlsoap:address location='http://localhost/php-soap/wsdl/hello_service_wsdl.php' />
	        </wsdl:port>
	    </wsdl:service>
	</wsdl:definitions>


### WSDL 模式服务端 ###

下面是 WSDL 模式的服务使用 SOAP 扩展来实现提供服务的代码：

	<?php
	function greet($param)
	{
	    $value  = 'Hello ' . $param->name;
	    $result = [
	        'greetReturn' => $value
	    ];
	    return $result;
	}
	
	$server = new SoapServer('hello.wsdl');
	$server->addFunction('greet');
	$server->handle();

在这个服务的实现过程中，函数实现了WSDL所定义的服务操作 greet，greet 操作有一个 WSDL 指定的参数，按照 greet 操作的语义，这个参数是一个用户的名字。最后 handle 调用了触发处理请求的服务对象。

 
### WSDL 模式客户端 ###

客户端代码如下:

	try {
	    $client = new SoapClient('hello.wsdl');
	    $result =  $client->__soapCall('greet', [
	        ['name' => 'Suhua']
	    ]);
	    printf("Result = %s", $result->greetReturn);
	} catch (Exception $e) {
	    printf("Message = %s",$e->__toString());
	}

客户端代码中，首先创建一个使用 WSDL 文件作参数的 SoapClient 实例。接着使用 __soapCall() 调用 greet 方法，并传入参数。

下面是客户端所发送的 SOAP 请求：

	<?xml version="1.0" encoding="UTF-8"?>
	<SOAP-ENV:Envelope
	    xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
	    xmlns:ns1="http://localhost/php-soap/wsdl/helloService">
	    <SOAP-ENV:Body>
	        <ns1:greet>
	            <ns1:name>Suhua</ns1:name>
	        </ns1:greet>
	    </SOAP-ENV:Body>
	</SOAP-ENV:Envelope>

下面是服务端响应上诉请求而发送的 SOAP 响应：

	<?xml version="1.0" encoding="UTF-8"?>
	<SOAP-ENV:Envelope
	    xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
	    xmlns:ns1="http://localhost/php-soap/wsdl/helloService">
	    <SOAP-ENV:Body>
	        <ns1:greetResponse>
	            <ns1:greetReturn>Hello Suhua</ns1:greetReturn>
	        </ns1:greetResponse>
	    </SOAP-ENV:Body>
	</SOAP-ENV:Envelope>

上面的 SOAP 消息都是利用 WSDL 模式下的服务端和客户端来获取的（可以使用 __getLastResponse 和 __getLastRequest 这两个方法获取，前提是客户端初始化时，要把 `trace` 参数设置为 `true`）。也可以利用 non-WSDL 模式的服务端和客户端来产生与上面相同的 SOAP 消息。但是，PHP 代码必须有一点改变。下一节会说明如何使用 non-WSDL 模式。

### non-WSDL 模式服务端 ###

	function greet($param)
	{
	    $value = 'Hello '.$param;
	    return new SoapParam($value, 'greetReturn');
	}
	
	$server = new SoapServer(null, [
	    'uri' => 'http://localhost/php-soap/non-wsdl/helloService'
	]);
	
	$server->addFunction('greet');
	$server->handle();

在 non-WSDL 模式中，像 WSDL 模式一样首先实现 greet 函数的功能，但是函数实现的方式跟 WSDL 模式稍稍有所不同。在 non-WSDL 模式中，我们必须返回一个 SoapParam 对象作为响应，而不是一个数组。创建服务时，第一个参数设为 null，说明没有提供 WSDL；接着传递一个选项作为参数，这个选项参数是服务的 URI。最后像 WSDL 模式一样调用剩下的方法。

### non-WSDL 模式客户端 ###

	try {
	    $client = new SoapClient(null, [
	        'location' => 'http://localhost/php-soap/non-wsdl/hello_service_non_wsdl.php',
	        'uri' => 'http://localhost/php-soap/non-wsdl/helloService'
	    ]);

	    $result =  $client->__soapCall('greet', [
	        new SoapParam('Suhua', 'name')
	    ]);

	    printf("Result = %s", $result);
	} catch (Exception $e) {
	    printf("Message = %s",$e->__toString());
	}

在 non-WSDL 模式中，因为没有使用 WSDL，传递了一个包含服务所在位置（location）和服务 URI 的参数数组作为参数。然后像 WSDL 模式中一样调用 __soapCall() 方法，但是使用了 SoapParam 类用指定格式打包参数。返回的结果将获取 greet 方法的响应。

注：客户端实例化时所传入的服务 URI，实际上，我们可以把它看作该服务的一个命名空间（namespace）。客户端所传入的 URI 必与服务端所命名的 URI 一样。

## 结论 ##

这篇文章介绍了 SOAP 扩展，可以在 PHP 中通过它来提供和使用 Web Services。PHP SOAP 扩展的强项是它的简单和快速。使用 C 写的 SOAP 扩展来运行服务端和客户端是非常简单的。虽然 SOAP 扩展在处理一些简单的 Web Services 时很有用，但是当用它来处理所有的 Web Services 时就表现出它的局限性。[WSO WSF/PHP](http://wso2.com/products/web-services-framework/php/) 就是为了弥补 PHP 扩展的缺陷而开发的，它是开源的，可以实现 SOAP 类似的功能并且支持 MTOM，WS-Addressing，WS- Security 和 WS-RelaiableMessaging。WSO2 WSF/PHP 支持与 SOAP 扩展类似的 API。我们正计划将 API 打包起来提供跟 SOAP 扩展一样的 API，会用 C 来写。

## 最后 ##

这篇文章的原文 [PHP SOAP Extension](http://wso2.com/library/1060/)，中文译文 [PHP SOAP     扩展](http://www.yeeyan.org/articles/view/jimmylee/5424)。在转载这篇文章的时候，对文章添加了一些注释以及本人的一些见解，而且例子也是重新编写的，所以与原文比会有所不同。本文的所有代码将会被放到 [Github](https://github.com/aisuhua) 仓库中，方便以后翻阅和复习。

## 参考文献 ##

1. [PHP SOAP 扩展](http://www.yeeyan.org/articles/view/jimmylee/5424)
2. [PHP SOAP Extension ](http://wso2.com/library/1060/)
3. [PHP SOAP 扩展详解](http://blog.csdn.net/lfq618/article/details/5514641)