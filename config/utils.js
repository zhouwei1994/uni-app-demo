import $http from '@/config/requestConfig'
import store from '@/store';
import base from '@/config/baseUrl';
import { getAppWxLatLon } from '@/plugins/utils';
// #ifdef H5
import { getLatLonH5, publicShareFun, wxPublicPay, getBrowser,appMutual } from '@/config/html5Utils';
// 公众号分享
export const publicShare = publicShareFun;
// #endif
// #ifdef APP-PLUS
import appShareFun, {closeShare} from '@/uni_modules/zhouWei-APPshare/js_sdk/appShare';
// APP分享
export const appShare = function(data,callbcak){
	let userInfo = store.state.userInfo;
	if(!(userInfo && userInfo.uid)){
		userInfo = uni.getStorageSync("userInfo");
	}
	let shareData = {
		shareTitle: data.shareTitle || base.share.title,
		shareUrl: data.shareUrl || base.share.link,
		shareContent: data.shareContent || base.share.desc,
		shareImg: data.shareImg || base.share.imgUrl,
	}
	if (userInfo && userInfo.uid) {
		if(data.shareUrl){
			if(data.shareUrl.indexOf("?") >= 0){
				shareData.shareUrl = data.shareUrl + "&recommend=" + userInfo.uid
			} else {
				shareData.shareUrl = data.shareUrl + "?recommend=" + userInfo.uid
			}
		} else if(base.share && base.share.link){
			if(base.share.link.indexOf("?") >= 0){
				shareData.shareUrl = base.share.link + "&recommend=" + userInfo.uid
			} else {
				shareData.shareUrl = base.share.link + "?recommend=" + userInfo.uid
			}
		}
	}
	return appShareFun({
		shareTitle: data.shareTitle || base.share.title,
		shareUrl: data.shareUrl || base.share.link,
		shareContent: data.shareContent || base.share.desc,
		shareImg: data.shareImg || base.share.imgUrl,
	},callbcak);
};
export const closeAppShare = closeShare;
// #endif

// #ifdef MP-WEIXIN
// 微信小程序分享
export const wxShare = function (data = {}) {
	let shareInfo = {
		title: data.title || base.share.title,
	};
	if(data.path && typeof(data.path) == "string"){
		shareInfo.path = data.path;
	} else if(data.path != 1){
		shareInfo.path = "pages/home/home";
	}
	if(data.imageUrl){
		shareInfo.imageUrl = data.imageUrl;
	}
	let userInfo = store.state.userInfo;
	if(!(userInfo && userInfo.uid)){
		userInfo = uni.getStorageSync("userInfo");
	}
	if (userInfo && userInfo.uid) {
		if(data.query && typeof(data.query) == "object"){
			data.query.recommendCode = userInfo.uid;
		} else {
			data.query = {
				recommendCode: userInfo.uid
			};
		}
	}
	if(data.query && typeof(data.query) == "object"){
		Object.keys(data.query).forEach((key,index) => {
			if(index > 0 && shareInfo.query){
				shareInfo.query += "&" + key + "=" + data.query[key];
				shareInfo.path += "&" + key + "=" + data.query[key];
			} else {
				shareInfo.query = key + "=" + data.query[key];
				shareInfo.path += "?" + key + "=" + data.query[key];
			}
		});
	}
	return shareInfo;
}
// #endif

//支付（APP微信支付、APP支付宝支付、微信小程序支付）
export const setPay = function(payInfo, callback) {
	let httpUrl = "";
	if (payInfo.type == 'wxpay') {
		// APP微信支付
		httpUrl = 'api/pay/v1/pay_sign_wx'
	} else if (payInfo.type == 'alipay') {
		// APP支付宝支付
		httpUrl = 'api/pay/v1/pay_sign_ali'
	} else if (payInfo.type == 'smallPay') {
		// 微信小程序支付
		httpUrl = 'api/pay/v1/small_pay_sign_wx'
	}
	$http.get(httpUrl, {
		orderNo: payInfo.orderNo
	}).then(data => {
		let payData = {
			success: function(res) {
				callback && callback({
					success: true,
					data: res
				});
				console.log('success:' + JSON.stringify(res));
			},
			fail: function(err) {
				callback && callback({
					success: false,
					data: err
				});
				console.log('fail:' + JSON.stringify(err));
			}
		};
		if (payInfo.type == 'smallPay') {
			// 小程序
			payData.provider = 'wxpay';
			payData.timeStamp = data.timeStamp;
			payData.nonceStr = data.nonceStr;
			payData.package = data.package;
			// payData.package = "prepay_id=" + data.prepayid;
			payData.signType = "MD5";
			payData.paySign = data.sign;
		} else if (payInfo.type == 'wxpay') {
			// app微信
			payData.provider = 'wxpay';
			payData.orderInfo = data;
		} else if (payInfo.type == 'alipay') {
			// app 支付宝
			payData.provider = 'alipay';
			payData.orderInfo = data;
		} else if (payInfo.type == 'baidu') {
			payData.provider = 'baidu';
			payData.orderInfo = data;
		}
		console.log("支付参数", payData);
		uni.requestPayment(payData);
	}, err => {
		callback && callback({
			success: false,
			data: err
		});
	});
}
// 支付统一分配
export const setPayAssign = function(orderInfo, callback) {
	orderInfo.price = orderInfo.price || orderInfo.pricePay;
	orderInfo.title = orderInfo.title || orderInfo.orderTitle;
	//支付
	// #ifdef APP-PLUS
	uni.navigateTo({
		url: '/pages/home/weChatPay?orderNo=' + orderInfo.orderNo + '&price=' + orderInfo.price + '&title=' + orderInfo.title
	});
	// #endif 
	// #ifdef MP-WEIXIN
	setPay({
		...orderInfo,
		type: "smallPay"
	}, res => {
		if(res.success){
			uni.redirectTo({
				url: "/pages/shopCar/paySuccess?orderNo=" + orderInfo.orderNo
			});
		}
	});
	// #endif
	// #ifdef H5
	if (getBrowser() === '微信') {
		wxPublicPay({
			orderNo: orderInfo.orderNo
		}, function(){
			uni.redirectTo({
				url: "/pages/shopCar/paySuccess?orderNo=" + orderInfo.orderNo
			});
		});
	} else {
		appMutual('setJumpPay', orderInfo);
	}
	// #endif
}
// 获取地址信息 （微信小程序、APP、公众号）
export const getLatLon = function(tip){
	return new Promise((resolve, reject) => {
		const successProcess = function(res){
			store.commit("setCurrentAddress", {
				latitude: res.latitude,
				longitude: res.longitude
			});
			resolve(res);
		};
		const errProcess = function(err){
			reject(err);
			if(tip){
				uni.showToast({
					title: err,
					icon: "none"
				});
			}
		};
		// #ifdef H5
		getLatLonH5(successProcess,errProcess);
		// #endif
		// #ifndef H5
		getAppWxLatLon(successProcess,errProcess);
		// #endif
	});
}




