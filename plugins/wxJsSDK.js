// 获取微信公众号SDK权限
//接口请求方法
import $http from '@/config/requestConfig';
import base from '@/config/baseUrl';
import { publicShareFun } from '@/config/html5Utils';
//获取地理位置
export const getLocation = () => {
	return new Promise((resolve, reject) => {
		//配置校验成功后执行
		jWeixin.ready(function () {
			// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
			jWeixin.getLocation({
				type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				success: function (res) {
					console.log(res);
					resolve(res);
				},
				fail: (err) => {
					reject(err);
				}
			});
		});
	});
}
//设置分享信息
export const setShare = (data, callback) => {
	//配置校验成功后执行
	jWeixin.ready(function () {
		if (!data.link) {
			let url = window.location.href;
			let index = url.indexOf("?");
			if (index != -1) {
				if (url.indexOf("#") != -1 && url.indexOf("#") > index) {
					url = url.substring(0, index) + url.substring(url.indexOf("#"));
				} else {
					url = url.substr(0, index);
				}
			}
			data.link = url;
		}
		// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		jWeixin.updateAppMessageShareData({
			title: data.title, // 分享标题
			desc: data.desc, // 分享描述
			link: data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: data.imgUrl, // 分享图标
			success: function () {
				// 设置成功
				callback && callback();
			}
		});
		jWeixin.updateTimelineShareData({
			title: data.title, // 分享标题
			link: data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: data.imgUrl, // 分享图标
			success: function () {
				// 设置成功
				callback && callback();
			}
		});
	});
}
//微信扫一扫
export const scanQRCode = ( callback,needResult = 0) => {
	//配置校验成功后执行
	jWeixin.ready(function () {
		jWeixin.scanQRCode({
		  needResult: needResult, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
		  scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
		  success: function (res) {
			callback && callback(res);
		  }
		});
	});
}
window.onload = function () {
	// 配置文件里面没有publicAppId将不激活微信SDK功能
	if (!base.publicAppId) {
		return;
	}
	//获取当前页面地址
	let url = window.location.href;
	url = url.substring(0, url.indexOf("#"));
	//获取微信公众号SDK权限的签名、随机数、时间戳
	$http.post("api/open/signature", {
		url: url
	}).then(res => {
		// 微信SDK配置
		jWeixin.config({
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: base.publicAppId, // 必填，公众号的唯一标识
			timestamp: res.timestamp, // 必填，生成签名的时间戳
			nonceStr: res.noncestr, // 必填，生成签名的随机串
			signature: res.signature,// 必填，签名
			jsApiList: [
				"getLocation",
				"updateAppMessageShareData",
				"updateTimelineShareData",
				'onMenuShareAppMessage',  //旧的接口，即将废弃
				'onMenuShareTimeline' //旧的接口，即将废弃
			] // 必填，需要使用的JS接口列表
		});
		//设置分享内容
		publicShareFun();
	});
	//配置校验失败后执行
	jWeixin.error(function (res) {
		// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
		console.log(res);
	});
};