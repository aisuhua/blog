---
layout: post
title:  "SOAP 介绍"
date:   2015-09-11 17:40:44
category: soap
author: aisuhua
copyright: true
---

## 简介 ##

SOAP（Simple Object Access Protoco）简单对象访问协议是在分散或分布式的环境中交换信息的简单的协议，是一个基于 XML 的协议。此协议规范由 IBM、Microsoft、UserLand 和 DevelopMentor 在1998年共同提出，并得到 IBM，莲花（Lotus），康柏（Compaq）等公司的支持，于2000年提交给万维网联盟（World Wide Web Consortium；W3C）。现在，SOAP 协议规范由万维网联盟的 XML工作组维护。SOAP 1.2 版在2003年6月24日成为 W3C 的推荐版本。

SOAP 协议包括以下四个部分的内容：

1. SOAP 封装（envelop），封装定义了一个描述消息中的内容是什么，是谁发送的，谁应当接受并处理它以及如何处理它们的框架；
2. SOAP 编码规则（encoding rules），它定义了不同应用程序间交换信息时，需要使用到的数据类型；
3. SOAP RPC 表示（RPC representation），它定义了一个表示远程过程调用和应答的协定；
4. SOAP 绑定（binding），它定义 SOAP 使用哪种底层协议交换信息的协定。使用 HTTP/TCP/UDP 协议都可以；

### 四个部分之间的关系 ###

SOAP 消息基本上是从发送端到接收端的单向传输，但它们常常结合起来执行类似于请求 / 应答的模式。所有的 SOAP 消息都使用 XML 编码。一条 SOAP 消息就是一个包含有一个必需的 SOAP 的封装包，一个可选的 SOAP 标头（Header）和一个必需的 SOAP 体块（Body）的 XML 文档。

把 SOAP 绑定到 HTTP 提供了同时利用 SOAP 的样式和分散的灵活性的特点以及 HTTP 的丰富的特征库的优点。在HTTP上传送 SOAP 并不是说 SOAP 会覆盖现有的 HTTP 语义，而是 HTTP 上的 SOAP 语义会自然的映射到 HTTP 语义。在使用 HTTP 作为协议绑定的场合中， RPC 请求映射到 HTTP 请求上，而 RPC 应答映射到 HTTP 应答。然而，在 RPC 上使用 SOAP 并不仅限于 HTTP 协议绑定。SOAP也可以绑定到TCP和UDP协议上。

虽然这四个部分都作为 SOAP 的一部分，作为一个整体定义的，但他们在功能上是相交的、彼此独立的。特别的，信封（envelop）和编码规则（encoding rules）是被定义在不同的 XML 命名空间中，这样使得定义更加简单。

## 语法规则 ##

1. SOAP 消息必须用 XML 来编码；
1. SOAP 消息必须使用 SOAP Envelope 命名空间；
1. SOAP 消息必须使用 SOAP Encoding 命名空间；
1. SOAP 消息不能包含 DTD 引用；
1. SOAP 消息不能包含 XML 处理指令；

## SOAP 消息格式 ##
	
SOAP 消息的格式比较简单，如下图：

[![SOAP 消息格式](https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SOAP.svg/225px-SOAP.svg.png)](https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SOAP.svg/225px-SOAP.svg.png)

下面是一条 SOAP 消息的基本格式：

	<?xml version="1.0" encoding="utf-8"?>
	<soap:Envelope
	    xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
	    soap:encodingStyle="http://www.w3.org/2003/05/soap-encoding">
	    <soap:Header>
	        <!-- 消息头，可选 -->
	    </soap:Header>
	    <soap:Body>
	        <!-- 消息内容，必需 -->

	        <soap:Fault>
	            <!-- 错误信息，可选 -->
	        </soap:Fault>
	    </soap:Body>
	</soap:Envelope>

一条 SOAP 消息就是一个普通的 XML 文档，包含如下元素：

1. 必需的 Envelope 元素，据此可把该 XML 文档标识为一条 SOAP 消息；
1. 可选的 Header 元素，包含头部信息，一般用于身份验证；
1. 必需的 Body 元素，包含所有的调用和响应信息；
1. 可选的 Fault 元素，提供有关在处理此消息时，所发生的错误的描述信息；


## 语法规则详解 ##

### SOAP Envelope ###

`Envelope` 是 SOAP 消息结构的主要容器，也是 SOAP 消息的根元素，它必须出现在每个 SOAP 消息中，用于把此 XML 文档标示为一条 SOAP 消息。

在 SOAP 中，使用命名空间将 SOAP 消息元素与应用程序自定义的元素区分开来，将 SOAP 消息元素的作用域限制在一个特定的区域。

	<soap:Envelope
	    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
	    soap:encodingStyle="http://www.w3.org/2003/05/soap-encoding">
	</soap:Envelope>

SOAP 的 `encodingStyle` 属性用于定义在文档中使用的数据类型。此属性可出现在任何 SOAP 元素中，并会被应用到元素的内容及元素的所有子元素上。

### SOAP Header ###

这个是可选的，如果需要添加 `Header` 元素，那么它必须是 `Envelope` 的第一个子元素。`Header` 还可以包含0个或多个可选的子元素，这些子元素称为 Header 项，所有的 Header 项一般来说是属于某个特定与接口相关的命名空间。

	<soap:Envelope
	    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
	    soap:encodingStyle="http://www.w3.org/2003/05/soap-encoding">
	    <soap:Header>
	        <AuthenHeader xmlns="http://www.example.com">
	            <sAuthenticate>string</sAuthenticate>
	        </AuthenHeader>
	    </soap:Header>
	    <soap:Body>
	    </soap:Body>
	</soap:Envelope>

`Header` 元素用于与消息一起传输一些附加的消息，如身份验证信息等。

## SOAP Body ##

SOAP 消息的 `Body` 元素可以包含以下任何元素：

1. 远程过程调用（RPC）的方法及其参数；
1. 目标应用程序（消息接收者即接口调用者）所需要的数据；
1. 报告故障和状态消息的 SOAP Fault；

所有 `Body` 元素的直接子元素都称为 Body 项，所有 Body 项一般是属于某个特点的命名空间的。

SOAP 请求消息例子：

	<soap:Envelope
	    xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
	    soap:encodingStyle="http://www.w3.org/2003/05/soap-encoding">
	    <soap:Body>
	        <getMobileCodeInfo xmlns="http://www.example.com">
	            <mobileCode>string</mobileCode>
	            <userID>string</userID>
	        </getMobileCodeInfo>
	    </soap:Body>
	</soap:Envelope>

SOAP 响应消息例子：

	<soap:Envelope
	    xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
	    soap:encodingStyle="http://www.w3.org/2003/05/soap-encoding">
	    <soap:Body>
	        <getMobileCodeInfoResponse xmlns="http://www.example.com">
	            <getMobileCodeInfoResult>string</getMobileCodeInfoResult>
	        </getMobileCodeInfoResponse>
	    </soap:Body>
	</soap:Envelope>

注：以上例子表示通过手机号获取手机号归属地等信息。第一个例子是请求消息，第二个例子是它的响应消息。

## SOAP Fault ##

`Fault` 元素用于在 SOAP 消息中传输错误及状态信息。如果 SOAP 消息中包括 `Fault` 元素，它必须作为一个 `Body` 的子元素出现，而且至多出现一次。`Fault` 元素本身也包含有描述错误详细信息的子元素。它包含以下子元素：`faultcode`，`faultstring`，`faultactor`，`detail`。

| 子元素 | 描述  |
| ------------ | ------------ |
| `faultcode`  |  供识别故障的代码 |
| `faultstring`  |  可供人阅读的有关故障的说明 |
| `faultactor`  |  有关是谁引发故障的信息 |
| `detail`  |  有关涉及 `Body` 元素的应用程序专用错误信息 |

其中 `faultcode` 是每一条错误消息都会提供的元素，它的值一般是以下错误代码之一：

| 错误代码 | 描述  |
| ------------ | ------------ |
| VersionMismatch  | 无效的 SOAP Envelope 命名空间 |
| MustUnderstand  | 无法理解 `Header` 中拥有属性 `mustUnderstand = 1` 的子元素 |
| Client  |  消息结构错误，或包含了不正确的信息 |
| Server  |  服务器出现错误 |

注：以上关于 SOAP Fault 的描述不完全适用于 SOAP 1.2 版本。因为 SOAP 1.2 版本在返回错误信息时，`Fault` 的子元素及其内容已经有所不同。具体看下面的例子：

SOAP v1.1 错误消息例子：

	<soap:Envelope
	    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" 
	    soap:encodingStyle="http://www.w3.org/2001/12/soap-encoding">
	    <soap:Body>
	        <soap:Fault>
	            <faultcode>soap:Client</faultcode>
	            <faultstring>Input string was not in a correct format.</faultstring>
	        <detail/>
	    </soap:Fault>
	</soap:Body>
	</soap:Envelope>

SOAP v1.2 错误消息例子：

	<soap:Envelope
	    xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
	    soap:encodingStyle="http://www.w3.org/2003/05/soap-encoding">
	    <soap:Body>
	        <soap:Fault>
	            <soap:Code>
	                <soap:Value>soap:Sender</soap:Value>
	            </soap:Code>
	            <soap:Reason>
	                <soap:Text xml:lang="en">Input string was not in a correct format.</soap:Text>
	            </soap:Reason>
	            <soap:Detail/>
	        </soap:Fault>
	    </soap:Body>
	</soap:Envelope>

从以上返回结果来看，其实所返回的错误信息内容并没有太多改变，只是 XML 的元素发生了一些变化，具体还需要读者自己理解。

## 总结 ##

本文章节有点乱，还算是把 SOAP 的基本知识点都过了一遍。接下来，我将会结合一些实例，进一步说明 SOAP 的特点以及如何使用 SOAP Web 服务。

## 参考文献 ##

1. [浅谈 SOAP](http://www.ibm.com/developerworks/cn/xml/x-sisoap/)
2. [SOAP 详解](http://blog.csdn.net/wooshn/article/details/8145763)
3. [简单对象访问协议（百度百科）](http://baike.baidu.com/link?url=dWy5VmzeqzGhJxcTNO42FqJ1nLH3cwKfOdaJ9YfR5T3eFSPRQkP-xJQQNABi_hvBN_qNsWxj1P1U6rwvvafUOfgoZNZlGssdq48XYhjK3M91lFj1T0SucuAtavpr8ZEirrVFLzcALpol1SMG0fePmK)
4. [简单对象访问协议（维基百科）](https://zh.wikipedia.org/wiki/SOAP)
5. [XML 命名空间（XML Namespaces）](http://www.w3school.com.cn/xml/xml_namespaces.asp)
6. [SOAP 和 WSDL 的一些必要知识](http://www.cnblogs.com/JeffreySun/archive/2009/12/14/1623766.html)
7. [WebService 笔记=>SOAP 消息结构 ](http://blog.sina.com.cn/s/blog_3d7bed65010004vo.html)

## 其他 ##

1. 查询手机归属地信息服务：[http://webXml.com.cn](http://webservice.webxml.com.cn/WebServices/MobileCodeWS.asmx)
2. SOAP 服务调试工具：[SoapUI 5.2](http://www.soapui.org/)
3. XML 在线格式化工具：[Web Toolkit Online](http://www.webtoolkitonline.com/xml-formatter.html)
