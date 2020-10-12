import Vue from 'vue'
import App from './App'
//数据管理中心
import store from '@/store'
Vue.prototype.$store = store;
//权限配置中心
import base from '@/config/baseUrl'
Vue.prototype.$base = base;
//挂载全局http请求
import $http from '@/config/requestConfig'
Vue.prototype.$http = $http;
// #ifdef MP-WEIXIN
//挂载全局微信分享
import { wxShare } from '@/config/utils'
Vue.prototype.wxShare = wxShare;
// #endif
//判断是否登录
import { judgeLogin } from '@/config/login';
Vue.prototype.judgeLogin = judgeLogin;
Vue.config.productionTip = false;
// #ifdef H5
//微信SDK
import '@/plugins/wxJsSDK.js';
// #endif

//全局组件
import zhouWeiNavBar from "@/components/common/zhouWei-navBar";
Vue.component("nav-bar", zhouWeiNavBar);
import publicModule from "@/components/common/public-module.vue";
Vue.component("public-module", publicModule);
import MescrollBody from "@/components/common/mescroll-uni/mescroll-body.vue";
Vue.component("mescroll-body", MescrollBody);
App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount();