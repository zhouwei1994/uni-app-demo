<template>
	<view>
		<z-nav-bar title="接口请求（全端支持）"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_title">使用文档</view>
			<view class="table_content">
				<text @click="onJumpWebview('https://ext.dcloud.net.cn/plugin?id=822')">文档地址：https://ext.dcloud.net.cn/plugin?id=822</text>
			</view>
		</view>
		<view class="input_form_box">
			<view class="input_box btm_line">
				<view class="name">GET请求</view>
				<view class="select_info" @click="onGet">
					<view class="select">点击请求</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">POST请求</view>
				<view class="select_info" @click="onPost">
					<view class="select">点击请求</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">通用请求方式</view>
				<view class="select_info" @click="onRequest">
					<view class="select">点击请求</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import $http from '@/config/requestConfig.js';
export default {
	data() {
		return {
			
		};
	},
	created() {
	},
	//方法
	methods: {
		onGet(){
			$http.get("api/common/v1/protocol", {type: 1000},{
				isPrompt: true,//（默认 true 说明：本接口抛出的错误是否提示）
				load: true,//（默认 true 说明：本接口是否提示加载动画）
				header: { //默认 无 说明：请求头
					'Content-Type': 'application/json'
				},
				isFactory: true //（默认 true 说明：本接口是否调用公共的数据处理方法，设置false后isPrompt参数将失去作用）
			}).then(res => {
				console.log("接口获取成功! 数据 =>",res);
				uni.showToast({
					title:"接口获取成功，请查看控制台",
					icon:"none"
				});
			});
		},
		onPost(){
			$http.post("api/common/v1/login", {
				email: 11111,
				password: 123456
			},{
				isPrompt: true,//（默认 true 说明：本接口抛出的错误是否提示）
				load: true,//（默认 true 说明：本接口是否提示加载动画）
				header: { //默认 无 说明：请求头
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				isFactory: true //（默认 true 说明：本接口是否调用公共的数据处理方法，设置false后isPrompt参数将失去作用）
			}).then(res => {
				console.log("接口获取成功! 数据 =>",res);
				uni.showToast({
					title:"接口获取成功，请查看控制台",
					icon:"none"
				});
			});
		},
		onRequest(){
			$http.request({
				url: "api/common/v1/protocol",
				method: "GET", // POST、GET、PUT、DELETE，具体说明查看官方文档
				data: {
					type: 1000,
				},
				timeout: 30000,  // 默认 30000 说明：超时时间，单位 ms，具体说明查看官方文档
				dataType: "json",  // 默认 json 说明：如果设为 json，会尝试对返回的数据做一次 JSON.parse，具体说明查看官方文档
				responseType: "text",  // 默认 text 说明：设置响应的数据类型。合法值：text、arraybuffer，具体说明查看官方文档
				withCredentials: false,  // 默认 false 说明：跨域请求时是否携带凭证（cookies），具体说明查看官方文档
				isPrompt: true, //（默认 true 说明：本接口抛出的错误是否提示）
				load: true,//（默认 true 说明：本接口是否提示加载动画）
				header: { //默认 无 说明：请求头
					'Content-Type': 'application/json'
				},
				isFactory: true, //（默认 true 说明：本接口是否调用公共的数据处理方法，设置false后isPrompt参数将失去作用）
			}).then(function (res) {
				//这里只会在接口是成功状态返回
				console.log("接口获取成功! 数据 =>",res);
				uni.showToast({
					title:"接口获取成功，请查看控制台",
					icon:"none"
				});
			}).catch(function (error) {
				//这里只会在接口是失败状态返回，不需要去处理错误提示
				console.log(error);
			});
		},
		onJumpWebview(url){
			// #ifdef H5
			window.open(url);
			// #endif
			// #ifndef H5
			this.$store.commit("setWebViewUrl", url);
			uni.navigateTo({
				url: '/pages/template/webView'
			});
			// #endif
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
