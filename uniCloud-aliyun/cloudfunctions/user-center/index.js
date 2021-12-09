'use strict';

const uniID = require('uni-id')
const uniCaptcha = require('uni-captcha')
const db = uniCloud.database()
const dbCmd = db.command

exports.main = async (event, context) => {
	const uniIDIns = uniID.createInstance({
		context
	});
	// 登录记录
	const loginLog = async (res = {}, type = 'login') => {
		const now = Date.now()
		const uniIdLogCollection = db.collection('uni-id-log')
		let logData = {
			deviceId: params.deviceId || context.DEVICEID,
			ip: params.ip || context.CLIENTIP,
			type,
			ua: context.CLIENTUA,
			create_date: now
		};
	
		Object.assign(logData,
			res.code === 0 ? {
				user_id: res.uid,
				state: 1
			} : {
				state: 0
			})
	
		return uniIdLogCollection.add(logData)
	}
	// 查询最近登录是否登录失败
	const getNeedCaptcha = async () => {
		const now = Date.now()
		// 查询是否在 {2小时} 内 {前2条} 有 {登录失败} 数据，来确定是否需要验证码
		const recordSize = 2;
		const recordDate = 120 * 60 * 1000;
	
		const uniIdLogCollection = db.collection('uni-id-log')
		let recentRecord = await uniIdLogCollection.where({
				deviceId: params.deviceId || context.DEVICEID,
				create_date: dbCmd.gt(now - recordDate),
				type: 'login'
			})
			.orderBy('create_date', 'desc')
			.limit(recordSize)
			.get();
	
		return recentRecord.data.filter(item => item.state === 0).length === recordSize;
	}
	
	switch (event.action) {
		case 'register':  // 注册
			await uniIDIns.register(params);
			break;
		case 'loginBySms':  // 验证码登录
			let passed = false;
			let needCaptcha = await getNeedCaptcha();
			
			if (needCaptcha) {
				res = await uniCaptcha.verify(params)
				if (res.code === 0) passed = true;
			}
			
			if (!needCaptcha || passed) {
				res = await uniIDIns.login(params);
				await loginLog(res);
				needCaptcha = await getNeedCaptcha();
			}
			res.needCaptcha = needCaptcha;
			break;
		case 'loginByPwd': // 密码登录
			if (!params.code) {
				return {
					code: 500,
					msg: '请填写验证码'
				}
			}
			if (!/^1\d{10}$/.test(params.mobile)) {
				return {
					code: 500,
					msg: '手机号码填写错误'
				}
			}
			res = await uniIDIns.loginBySms(params)
			loginLog(res)
			break;
		case 'createCaptcha': // 创建验证码
			res = await uniCaptcha.create(params)
			break;
		case 'refreshCaptcha': // 刷新验证码
			res = await uniCaptcha.refresh(params)
			break;
		case 'forget':  // 忘记密码
		
			break;
		case 'logout':  // 退出登录
			await uniIDIns.logout(event.uniIdToken)
			break;
	}
	let params = event.params || {}

	

	

	//event为客户端上传的参数
	console.log('event : ' + event)

	let payload = {}
	let noCheckAction = [
		'register', 'loginByWeixin', 'checkToken',
		'login', 'logout', 'sendSmsCode',
		'loginBySms', 'inviteLogin', 'loginByUniverify',
		'loginByApple', 'createCaptcha', 'verifyCaptcha',
		'refreshCaptcha'
	]

	if (noCheckAction.indexOf(event.action) === -1) {
		if (!event.uniIdToken) {
			return {
				code: 403,
				msg: '缺少token'
			}
		}
		payload = await uniIDIns.checkToken(event.uniIdToken)
		if (payload.code && payload.code > 0) {
			return payload
		}
		params.uid = payload.uid
	}

	let res = {}

	switch (event.action) {
		case 'register':
			res = await uniIDIns.register(params);
			break;
		case 'login':
			let passed = false;
			let needCaptcha = await getNeedCaptcha();

			if (needCaptcha) {
				res = await uniCaptcha.verify(params)
				if (res.code === 0) passed = true;
			}

			if (!needCaptcha || passed) {
				res = await uniIDIns.login(params);
				await loginLog(res);
				needCaptcha = await getNeedCaptcha();
			}

			res.needCaptcha = needCaptcha;
			break;
		case 'loginByWeixin':
			res = await uniIDIns.loginByWeixin(params);
			loginLog(res)
			break;
		case 'checkToken':
			res = await uniIDIns.checkToken(event.uniIdToken);
			break;
		case 'logout':
			res = await uniIDIns.logout(event.uniIdToken)
			break;
		case 'sendSmsCode':
			// 简单限制一下客户端调用频率
			const ipLimit = await db.collection('uni-verify').where({
				ip: context.CLIENTIP,
				created_at: dbCmd.gt(Date.now() - 60000)
			}).get()
			if (ipLimit.data.length > 0) {
				return {
					code: 429,
					msg: '请求过于频繁'
				}
			}
			const templateId = '' // 替换为自己申请的模板id
			if (!templateId) {
				return {
					code: 500,
					msg: 'sendSmsCode需要传入自己的templateId，参考https://uniapp.dcloud.net.cn/uniCloud/uni-id?id=sendsmscode'
				}
			}
			const randomStr = '00000' + Math.floor(Math.random() * 1000000)
			const code = randomStr.substring(randomStr.length - 6)
			res = await uniIDIns.sendSmsCode({
				mobile: params.mobile,
				code,
				type: params.type,
				templateId
			})
			break;
		case 'loginBySms':
			if (!params.code) {
				return {
					code: 500,
					msg: '请填写验证码'
				}
			}
			if (!/^1\d{10}$/.test(params.mobile)) {
				return {
					code: 500,
					msg: '手机号码填写错误'
				}
			}
			res = await uniIDIns.loginBySms(params)
			loginLog(res)
			break;
		case 'inviteLogin':
			if (!params.code) {
				return {
					code: 500,
					msg: '请填写验证码'
				}
			}
			res = await uniIDIns.loginBySms({
				...params,
				type: 'register'
			})
			break;
		case 'getInviteCode':
			res = await uniIDIns.getUserInfo({
				uid: params.uid,
				field: ['my_invite_code']
			})
			if (res.code === 0) {
				res.myInviteCode = res.userInfo.my_invite_code
				delete res.userInfo
			}
			break;
		case 'getInvitedUser':
			res = await uniIDIns.getInvitedUser(params)
			break;
		case 'loginByUniverify':
			res = await uniIDIns.loginByUniverify(params)
			break;
		case 'loginByApple':
			res = await uniIDIns.loginByApple(params)
			loginLog(res)
			break;
		case 'updatePwd':
			res = await uniIDIns.updatePwd({
				uid: params.uid,
				...params
			})
			break;
		case 'createCaptcha':
			res = await uniCaptcha.create(params)
			break;
		case 'refreshCaptcha':
			res = await uniCaptcha.refresh(params)
			break;
		default:
			res = {
				code: 403,
				msg: '非法访问'
			}
			break;
	}
	//返回数据给客户端
	return res
};
