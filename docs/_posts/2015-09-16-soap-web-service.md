---
layout: post
title:  "SOAP Web 服务介绍"
date:   2015-09-16 09:18:44
category: soap
author: aisuhua
copyright: false
---

已经跨入 2015 年，当今最为常见的两种 Web 服务类型分别是： REST 和 SOAP 。不过，从趋势来看，越来越多人已经开始使用 REST 风格的 Web 服务。而 SOAP 大多也开始或已经转型 REST，应该说 REST 会慢慢成为主流。这篇文章不会对 REST 介绍太多，主要的重点还是介绍一下 SOAP 风格的 Web 服务。

## Web Service 三要素 ##

实际上，现在说 “Web Service 三要素”应该是不算很准确了，不过这个概念一直这样沿用，而且本文我们为了更能清楚阐释 SOAP Web 服务，那么就这样定义。

Web Service 的三个要素分别是：

1. SOAP（Simple Object Access Protoco） 简单对象访问协议；
2. WSDL（Web Services Description Language） 网络服务描述语言；
3. UDDI（Universal Description Discovery and Integration）一个用来发布和搜索 WEB 服务的协议（非必须）；

SOAP 用来描述传递信息的格式规范， WSDL 用来描述如何访问具体的接口（比如它会告诉你该服务有哪些接口可以使用，参数是什么等等）， UDDI 用来管理、分发和查询 Web Service。下面我们将逐一详细介绍这三个要素，并通过结合实例来进行阐释。

为了把这三个要素说得更清楚，我们将会使用一个免费的 SOAP Web 服务作为例子进行阐述。该服务只提供一个接口即：根据 QQ 号，获取 QQ 在线状态。[查看该服务](http://www.webxml.com.cn/webservices/qqOnlineWebService.asmx)

## SOAP ##

它是一个协议，可以简单的理解为：它定义了一个基于 XML 的可扩展消息信封格式。因为客户端与服务器进行交互，由于大家的平台和应用程序都不一样，所以大家约定都采用 SOAP 这个协议来规范交互时的需要传递的消息。

请求接口时，发送的消息例子：

	<?xml version="1.0" encoding="utf-8"?>
	<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	    <soap:Body>
	        <qqCheckOnline xmlns="http://WebXml.com.cn/">
	            <qqCode>8698053</qqCode>
	        </qqCheckOnline>
	    </soap:Body>
	</soap:Envelope>

接口响应时，返回的消息例子：

	<?xml version="1.0" encoding="utf-8"?>
	<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	    <soap:Body>
	        <qqCheckOnlineResponse xmlns="http://WebXml.com.cn/">
	            <qqCheckOnlineResult>Y</qqCheckOnlineResult>
	        </qqCheckOnlineResponse>
	    </soap:Body>
	</soap:Envelope>

注：以上例子是使用 SOAP 1.1 发送的消息，SOAP 1.2 发送的消息格式其实大同小异，具体自己[查看接口文档](http://www.webxml.com.cn/webservices/qqOnlineWebService.asmx?op=qqCheckOnline)。

下面对它结构进行详细说明。

### XML 声明 ###

	<?xml version="1.0" encoding="utf-8"?>

该行是 XML 声明。它定义 XML 的版本 (1.0) 和所使用的编码（utf-8）。

### Envelope 元素 ###

	<soap:Envelope
	    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
	    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	    xmlns:xsd="http://www.w3.org/2001/XMLSchema">
		....
	</soap:Envelope>

`Envelope` 元素是 SOAP 消息的固定根元素，SOAP 协议规定的，不能变，其中 `xmlns` 是 XML Namespace 的缩写，表示 XML 命名空间。`xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"` 是 `Envelope`的一个属性，它表示定义个以 `soap` 为前缀的命名空间 `http://schemas.xmlsoap.org/soap/envelope/`，即命名空间的名字是：`http://schemas.xmlsoap.org/soap/envelope/`，而它的前缀是 `soap`，这样子就把 `soap` 前缀与该命名空间进行了绑定。即任何用 `soap` 为前缀的元素都属于该命名空间的，包括根元素 `Envelope` 。举个例子：

	<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	    <soap:Body>
	        <qqCheckOnline xmlns="http://WebXml.com.cn/">
	            <qqCode>8698053</qqCode>
	        </qqCheckOnline>
	    </soap:Body>
	</soap:Envelope>

其中，`Envelope` 和 `Body` 元素就是以 `soap` 为前缀的，那么 `Envelope` 和 `Body` 元素都是属于 `http://schemas.xmlsoap.org/soap/envelope/` 这个命名空间的。

同时，SOAP 协议中规定，SOAP 消息必须使用 SOAP Envelope 命名空间，所以 `http://schemas.xmlsoap.org/soap/envelope/` 这个命名空间是固定的不能变（注意：这里只针对 SOAP 1.1 版本，SOAP 1.2 会有所不同）。所有 SOAP 消息元素，比如：`Envelope`、`Header`、`Body`、`Fault` 也都必须属于该命名空间。


### Body 元素 ###

	<soap:Body>
	    <qqCheckOnline xmlns="http://WebXml.com.cn/">
	        <qqCode>8698053</qqCode>
	    </qqCheckOnline>
	</soap:Body>

`Body` 元素里面，一般都是放一些请求和响应的内容。`qqCheckOnline` 表示要调用的接口方法，而 `qqCode` 就是调用该方法时，传入的参数，当然参数可以有多个。

其中，`qqCheckOnline` 元素上也定义了一个命名空间 `http://WebXml.com.cn/`。值得注意的是，这里在定义命名空间时，并没有设置命名空间前缀（namespace prefix）。这种设置方式，会把当前元素及其所有子元素，都归属于该命名空间。[了解 XML 命名空间](http://www.w3school.com.cn/xml/xml_namespaces.asp)。

我们看到，SOAP 消息元素和应用程序本身的元素是属于不同的命名空间，这样有利于把 SOAP 消息元素与其他元素区分开来，当然也防止了与自定义元素重名的问题。

### Header 元素 ###

	<?xml version="1.0" encoding="utf-8"?>
	<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	    <soap:Header>
	        <AuthenHeader xmlns="http://www.example.com">
	            <sAuthenticate>string</sAuthenticate>
	        </AuthenHeader>
	    </soap:Header>
	    <soap:Body>
		......
	    </soap:Body>
	</soap:Envelope>

有些接口需要提供 `Header` 元素，它和 `Body` 信息一起发送，它一般用于身份验证等作用。例子中的 `AuthenHeader` 和 `sAuthenticate` 都是接口自定义的参数。

### Fault 元素 ###

当调用服务发生错误时，错误信息一般会被放置在 `Fault` 元素内。例如：

	<?xml version="1.0" encoding="utf-8"?>
	<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	    <soap:Body>
	        <soap:Fault>
	            <faultcode>soap:Client</faultcode>
	            <faultstring>Input string was not in a correct format.</faultstring>
	            <detail/>
	        </soap:Fault>
	    </soap:Body>
	</soap:Envelope>

Fault 元素内还有 `faultcode`、`faultstring`、`detail`，用于描述错误信息用的。在上一篇文章：《SOAP 介绍》中已经对该知识点进行了比较详细的说明，有兴趣可以看看。

## WSDL ##

一个 XML 格式的文档。它用于描述该服务有哪些可用方法、参数的数据类型、命名空间等等信息。它的目的是让你知道该如何使用该服务，包括调用的各种细节信息。WSDL 文档通常用来辅助生成服务器和客户端代码及配置信息。

### 契约先行与代码先行模式 ###

在开发 Web Service 过程中有两种实现模式：契约先行（Contract first）模式和代码先行（Code first）模式。

**契约先行模式**：首要工作是定义针对这个 Web 服务的接口的 WSDL(Web Services Description Language，Web 服务描述语言 ) 文件。WSDL 文件中描述了 Web 服务的位置，可提供的操作集，以及其他一些属性。WSDL 文件也就是 Web 服务的 “契约”。“契约” 订立之后，再据此进行服务器端和客户端的应用程序开发。

**代码先行模式**：与契约先行模式不同，代码先行模式中，第一步工作是实现 Web 服务端，然后根据服务端的实现，用某种方法（自动生成或手工编写）生成 WSDL 文件。

实际上，一个 WSDL 文件也挺复杂的，一般自己也不会去直接看这个文件，而是需要用到某个方法时，直接看该方法的调用说明就好。比如：[获得腾讯QQ在线状态](http://www.webxml.com.cn/webservices/qqOnlineWebService.asmx?op=qqCheckOnline)


## UDDI ##

UDDI 是一个专门用来管理 Web 服务的地方。Web Service 服务提供商可以通过两种方式来暴露它的 WSDL 文件地址：

1. 注册到 UDDI 服务器，以便被人查找；
2. 直接告诉给客户端调用者；

是否需要注册到 UDDI 实际上是可选的，一般公司内部使用的服务，也不会注册到 UDDI。只有那些希望所有人都知道该服务的地址，才会注册到 UDDI。


## 最后 ##

这篇文章写得有点乱了，主要还是自己对 SOAP 的了解还不够，最起码我并没有真正开发过 SOAP 服务。不过没关系吧，慢慢来，文章可以随着知识的增长慢慢润色。上文其实有一些问题没有说清楚的，比如说：SOAP 服务的适合用在哪里，不适合用在哪里等等。如果你有兴趣，可以看看文章最后的几篇参考文献。

## 参考文献 ##

1. [简单对象访问协议（百度百科）](http://baike.baidu.com/link?url=dWy5VmzeqzGhJxcTNO42FqJ1nLH3cwKfOdaJ9YfR5T3eFSPRQkP-xJQQNABi_hvBN_qNsWxj1P1U6rwvvafUOfgoZNZlGssdq48XYhjK3M91lFj1T0SucuAtavpr8ZEirrVFLzcALpol1SMG0fePmK)
2. [Web服务](https://zh.wikipedia.org/wiki/Web%E6%9C%8D%E5%8A%A1)
3. [PHP SOAP 扩展](http://www.yeeyan.org/articles/view/jimmylee/5424)
4. [Web Service 到底是什么？](http://blog.csdn.net/wooshn/article/details/8069087)

## 其他 ##

1. 获得腾讯QQ在线状态服务：[qqCheckOnline](http://www.webxml.com.cn/webservices/qqOnlineWebService.asmx)
2. SOAP 服务调试工具：[SoapUI 5.2](http://www.soapui.org/)
3. XML 在线格式化工具：[Web Toolkit Online](http://www.webtoolkitonline.com/xml-formatter.html)










 

