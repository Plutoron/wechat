var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const jssdk = require('../libs/jssdk')

/* GET home page. */
router.get('/wechat/hello', function(req, res, next) {
 	jssdk.getSignPackage(`http://123.206.212.174${req.url}`, function(err, signPackage) {
		if(err) {
			return next(err);
		}
		res.render('index', {
			title: 'hah',
			signPackage: signPackage,
			pretty: true
		})
	})	
});


const token = 'CZFKjfryooFv9C5Hmcew';

const handleWechatRequest = function(req, res ,next) {
        const { signature, timestamp, nonce, echostr } = req.query;
        if (!signature || !timestamp || !nonce ) {
                return res.send('invalid request');        
	}

	if(req.method === 'POST') {
		console.log('handlerWecahtRequest.post', { body: req.body, query: req.query })
	}	
	
	if(req.method === 'GET') {
		console.log('handlerWechatRequset.get', { get: req.body })
		if(!echostr) {
			return res.send('invalid request');
		}
	}

        const params = [token, timestamp, nonce];
        params.sort();

        const hash = crypto.createHash('sha1');
        const sign = hash.update(params.join('')).digest('hex');

        if(signature === sign) {
		if(req.method === 'GET') {
			res.send(echostr ? echostr : 'invalid request')
		} 
		else {
			const tousername = req.body.xml.tousername[0].toString();
			const fromusername = req.body.xml.fromusername[0].toString();
			const createtime = Math.round(Date.now() / 1000);
			const msgtype = req.body.xml.msgtype[0].toString();
			const content = req.body.xml.content[0].toString();
			const msgid =req.body.xml.msgid[0].toString();
		
			const response = `<xml>
					 <ToUserName><![CDATA[${fromusername}]]></ToUserName>
					 <FromUserName><![CDATA[${tousername}]]></FromUserName>
					 <CreateTime>${createtime}</CreateTime>
					 <MsgType><![CDATA[${msgtype}]]></MsgType>
					 <Content><![CDATA[${content}]]></Content>
					 </xml>`

			console.log(tousername);
			console.log(msgid)	
			console.log(response);
			res.set('Content-Type', 'text/xml')		
			res.send(response)
		}	
        }
	else {
                res.send('invalid sign');
        }
};

router.get('/api/wechat', handleWechatRequest);
router.post('/api/wechat', handleWechatRequest);


module.exports = router;
