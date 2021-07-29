import request from "@/uni_modules/zhouWei-request/js_sdk/request";
import store from '@/store';
import base from '@/config/baseUrl';
// #ifdef H5
import {
	h5Login
} from '@/config/html5Utils';
// #endif
// #ifdef MP-WEIXIN
import {
	onLogin
} from '@/config/login';
// #endif
let version_code = '';
// #ifdef APP-PLUS
import { getCurrentNo } from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
setTimeout(() => {
	getCurrentNo(function(res){
		console.log("版本号",res);
		version_code = res.versionCode;
	});
},200);
// #endif

//可以new多个request来支持多个域名请求
let $http = new request({
	//接口请求地址
	baseUrl: base.baseUrl,
	//服务器本地上传文件地址
	fileUrl: base.baseUrl,
	// 服务器上传图片默认url
	defaultUploadUrl: "api/common/v1/upload_image",
	// 服务器上传文件名称
	defaultFileName: "file",
	//设置请求头（如果使用报错跨域问题，可能是content-type请求类型和后台那边设置的不一致）
	header: {
		'Content-Type': 'application/json;charset=UTF-8',
		// 'project_token': base.projectToken, //项目token（可删除）
	}
});
// 添加获取七牛云token的方法
$http.getQnToken = function(callback){
	//该地址需要开发者自行配置（每个后台的接口风格都不一样）
	$http.get("api/common/v1/qn_upload").then(data => {
		/*
		 *接口返回参数：
		 *visitPrefix:访问文件的域名
		 *token:七牛云上传token
		 *folderPath:上传的文件夹
		 *region: 地区 默认为：SCN
		 */
		callback({
			visitPrefix: data.visitPrefix,
			token: data.token,
			folderPath: data.folderPath
		});
	});
}
// 添加获取阿里云token的方法
$http.getAliToken = function(callback){
	//该地址需要开发者自行配置（每个后台的接口风格都不一样）
	$http.get("api/open/v1/ali_oss_upload").then(data => {
		/*
		 *接口返回参数：
		 *visitPrefix:访问文件的域名
		 *folderPath:上传的文件夹
		 *accessKeyId: 您的oss的访问ID
		 *accessKeySecret: 您的oss的访问密钥
		 *timeout: 签名过期时间（毫秒）默认1800000
		 */
		callback({
			accessKeyId: data.accessKeyId,
			accessKeySecret: data.accessKeySecret,
			visitPrefix: data.visitPrefix,
			folderPath: data.folderPath,
			timeout: 1800000
		});
	});
}
//请求开始拦截器
$http.requestStart = function(options) {
	console.log("请求开始", options);
	if (options.load) {
		//打开加载动画
		store.commit("setLoadingShow", true);
	}
	// 图片、视频上传大小限制
	if (options.method == "FILE") {
		// 文件最大字节: options.maxSize 可以在调用方法的时候加入参数
		let maxSize = options.maxSize || '';
		for (let item of options.files) {
			if(item.fileType == 'image'){
				if (maxSize && item.size > maxSize) {
					setTimeout(() => {
						uni.showToast({
							title: "图片过大，请重新上传",
							icon: "none"
						});
					}, 500);
					return false;
				}
			} else if(item.fileType == "video"){
				if (item.duration < 3) {
					setTimeout(() => {
						uni.showToast({
							title: "视频长度不足3秒，请重新上传",
							icon: "none"
						});
					}, 500);
					return false;
				}
			}
		}
	}
	// #ifdef APP-PLUS
	// 添加当前版本号
	if(version_code){
		options.header['version_code'] = version_code;
	}
	// #endif
	//请求前加入token
	let storeUserInfo = store.state.userInfo;
	if(!storeUserInfo.token){ // nvue页面读取不到vuex里面数据，将取缓存
	    storeUserInfo = uni.getStorageSync("userInfo");
	}
	if (storeUserInfo.token) {
		options.header['user_token'] = storeUserInfo.token;
	};
	return options;
}
//请求结束
$http.requestEnd = function(options) {
	//判断当前接口是否需要加载动画
	if (options.load) {
		// 关闭加载动画
		store.commit("setLoadingShow", false);
	}
}
let loginPopupNum = 0;
//所有接口数据处理（此方法需要开发者根据各自的接口返回类型修改，以下只是模板）
$http.dataFactory = async function(res) {
	console.log("接口请求数据", {
		url: res.url,
		resolve: res.response,
		header: res.header,
		data: res.data,
		method: res.method,
	});
	if (res.response.statusCode && res.response.statusCode == 200) {
		let httpData = res.response.data;
		if(typeof(httpData) == "string"){
			httpData = JSON.parse(httpData);
		}
		/*********以下只是模板(及共参考)，需要开发者根据各自的接口返回类型修改*********/

		//判断数据是否请求成功
		if (httpData.success || httpData.code == 200) {
			// 返回正确的结果(then接受数据)
			return Promise.resolve(httpData.data);
		} else if (httpData.code == "1000" || httpData.code == "1001" || httpData.code == 1100 || httpData.code == 402) {
            
            // 失败重新请求（最多重新请求3次）
            // if(res.resend < 3){
            //     let result = await $http.request({
            //     	url: res.url,
            //     	data: res.data,
            //     	method: res.method,
            //     	header: res.header,
            //     	isPrompt: res.isPrompt,//（默认 true 说明：本接口抛出的错误是否提示）
            //     	load: res.load,//（默认 true 说明：本接口是否提示加载动画）
            //     	isFactory: res.isFactory, //（默认 true 说明：本接口是否调用公共的数据处理方法，设置false后isPrompt参数将失去作用）
            //      resend: res.resend += 1 // 当前重发次数
            //     });
            //     // 返回正确的结果(then接受数据)
            //     return Promise.resolve(result);
            // }
            // 返回错误的结果(catch接受数据)
            // return Promise.reject({
            // 	statusCode: 0,
            // 	errMsg: "【request】" +  (httpData.info || httpData.msg)
            // });
            
            //----------------------------------------分割线---------------------------------------------------
            
            // 刷新token在重新请求（最多重新请求2次）
            // if(res.resend < 2){
            //     let tokenResult = await $http.request({
            //     	url: "http://localhost:7001/api/common/v1/protocol", // 获取token接口地址
            //     	data: {
            //             type: 1000
            //         }, // 获取接口参数
            //     	method: "GET",
            //     	load: false,//（默认 true 说明：本接口是否提示加载动画）
            //     });
            //     // 储存token
            //     store.commit("userInfo", tokenResult);
            //     let result = await $http.request({
            //     	url: res.url,
            //     	data: res.data,
            //     	method: res.method,
            //     	header: res.header,
            //     	isPrompt: res.isPrompt,//（默认 true 说明：本接口抛出的错误是否提示）
            //     	load: res.load,//（默认 true 说明：本接口是否提示加载动画）
            //     	isFactory: res.isFactory, //（默认 true 说明：本接口是否调用公共的数据处理方法，设置false后isPrompt参数将失去作用）
            //         resend: res.resend += 1 // 当前重发次数
            //     });
            //     // 返回正确的结果(then接受数据)
            //     return Promise.resolve(result);
            // }
            // 返回错误的结果(catch接受数据)
            // return Promise.reject({
            // 	statusCode: 0,
            // 	errMsg: "【request】" +  (httpData.info || httpData.msg)
            // });
            
            
            
            
            
			store.commit("emptyUserInfo");
			// #ifdef MP-WEIXIN
			onLogin();
			// #endif
			// #ifdef H5
			h5Login("force"); 
			// #endif
			// #ifdef APP-PLUS
			var content = '此时此刻需要您登录喔~';
			if (httpData.code == "1000") {
				content = '此时此刻需要您登录喔';
			}
			if (loginPopupNum <= 0) {
				loginPopupNum++;
				uni.showModal({
					title: '温馨提示',
					content: content,
					confirmText: "去登录",
					cancelText: "再逛会",
					success: function(res) {
						loginPopupNum--;
						if (res.confirm) {
							uni.navigateTo({
								url: "/pages/user/login"
							});
						}
					}
				});
			}
			// #endif
			// 返回错误的结果(catch接受数据)
			return Promise.reject({
				statusCode: 0,
				errMsg: "【request】" +  (httpData.info || httpData.msg),
				data: res.data
			});
		} else if (httpData.code == "1004") {
			if (loginPopupNum <= 0) {
				loginPopupNum++;
				uni.showModal({
					title: "提示",
					content: "您还未绑定手机号，请先绑定~",
					confirmText: "去绑定",
					cancelText: "再逛会",
					success: (res) => {
						loginPopupNum--;
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/user/bindPhone'
							});
						}
					}
				});
			}
			// 返回错误的结果(catch接受数据)
			return Promise.reject({
				statusCode: 0,
				errMsg: "【request】" + (httpData.info || httpData.msg),
				data: res.data
			});
		} else { //其他错误提示   
			if (res.isPrompt) {
				uni.showToast({
					title: httpData.info || httpData.msg,
					icon: "none",
					duration: 3000
				});
			}
			// 返回错误的结果(catch接受数据)
			return Promise.reject({
				statusCode: 0,
				errMsg: "【request】" +  (httpData.info || httpData.msg),
				data: res.data
			});
		}
        
		/*********以上只是模板(及共参考)，需要开发者根据各自的接口返回类型修改*********/

	} else {
		// 返回错误的结果(catch接受数据)
		return Promise.reject({
			statusCode: res.response.statusCode,
			errMsg: "【request】数据工厂验证不通过",
			data: res.data
		});
	}
};
// 错误回调
$http.requestError = function(e){
	// e.statusCode === 0 是参数效验错误抛出的
	if(e.statusCode === 0){
		throw e;
	} else {
        console.log(e);
		uni.showToast({
			title: "网络错误，请检查一下网络",
			icon: "none"
		});
	}
}
export default $http;
