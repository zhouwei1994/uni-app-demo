import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
//变量
const state = {
	//用户数据
	userInfo: {},
	//webView地址
	webViewUrl: "",
	loadingShow: false,
	//微信场景参数
	chatScenesInfo: {},
	//登录弹窗状态
	loginPopupShow: false,
	//当前位置
	currentAddress: {
		areaName: "请选择",
		areaId: ''
	},
};
//缓存浏览器的数据名称
const cacheNameList = ["userInfo"];
let clearTime;
const mutations = {
	//取出缓存数据（打开APP就取出）
	setCacheData(state) {
		for (let name of cacheNameList) {
			// #ifndef H5
			let data = uni.getStorageSync(name);
			// #endif
			// #ifdef H5
			let data = sessionStorage.getItem(name) || localStorage.getItem(name);
			// #endif
			if (data) {
				// #ifdef H5
				try {
					data = JSON.parse(data);
				} catch (e) {
				}
				// #endif
				state[name] = data;
			}
		}
	},
	//储存用户信息
	setUserInfo(state, data) {
		if (data) {
			state.userInfo =  Object.assign(state.userInfo,data);
			// #ifdef H5
			window.sessionStorage.setItem('userInfo', JSON.stringify(state.userInfo));
			// #endif
			// #ifndef H5
			uni.setStorageSync('userInfo', state.userInfo);
			// #endif
		}
	},
	// 退出APP
	emptyUserInfo(state) {
		state.userInfo = {};
		// #ifdef H5
		window.sessionStorage.removeItem("userInfo");
		// #endif
		// #ifndef H5
		uni.removeStorageSync("userInfo");
		// #endif
	},
	//WebView地址
	setWebViewUrl(state, data) {
		if (data) {
			state.webViewUrl = data;
			// #ifdef H5
			window.sessionStorage.setItem('webViewUrl', data);
			// #endif
		}
	},
	//数据加载状态
	setLoadingShow(state, data) {
		if(state.loadingShow){
			clearTime && clearTimeout(clearTime);
			clearTime = setTimeout(function(){
				state.loadingShow = data;
			},300);
		} else {
			state.loadingShow = data;
		}
	},
	//微信场景参数
	setChatScenesInfo(state, data) {
		if (data) {
			state.chatScenesInfo = data;
		}
	},
	//登录弹窗状态
	setLoginPopupShow(state, data) {
		state.loginPopupShow = data;
	},
	//当前地址
	setCurrentAddress(state, data) {
		if (data) {
			state.currentAddress = Object.assign(state.currentAddress, data);
			let addressInfo = {
				"provinceId": state.currentAddress.provinceId,
				"provinceName": state.currentAddress.provinceName,
				"cityId": state.currentAddress.cityId,
				"cityName": state.currentAddress.cityName,
				"areaId": state.currentAddress.areaId,
				"areaName": state.currentAddress.areaName,
			};
			// #ifdef H5
			window.sessionStorage.setItem('currentAddress', JSON.stringify(addressInfo));
			// #endif
			// #ifndef H5
			uni.setStorageSync('currentAddress', addressInfo);
			// #endif
		}
	}
};
//异步处理
const actions = {};
export default new Vuex.Store({
	state,
	mutations,
	actions
});
