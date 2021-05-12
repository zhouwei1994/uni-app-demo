<template>
	<view>
		<z-nav-bar title="公众号登录"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_title">使用前需要配置的参数</view>
			<view class="table_content">
				<text>config/baseUrl.js => 对应的环境添加publicAppId参数值（微信公众号APPID）</text>
			</view>
			<view class="table_content">
				<text>登录获取的用户数据会自动储存到vuex里面config/store.js => state.userInfo</text>
			</view>
			<view class="table_head">
				<text>文件夹</text>
				<text>描述</text>
			</view>
			<view class="table_content">
				<text>config/html5Utils.js</text>
				<text>188行 => 配置公众号登录接口</text>
			</view>
			<view class="table_head">
				<text>登录接口参数</text>
				<text>描述</text>
			</view>
			<view class="table_content">
				<text>code</text>
				<text>微信公众号登录code</text>
			</view>
			<view class="table_content">
				<text>recommendCode</text>
				<text>推荐码（可没有）</text>
			</view>
		</view>
		<view class="input_form_box">
			<view class="input_box btm_line">
				<view class="name">公众号登录</view>
				<view class="select_info" @click="onLogin">
					<view class="select">点击登录</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
// #ifdef H5
import { h5Login, getBrowser } from '@/config/html5Utils.js';
// #endif
export default {
	data() {
		return {
			
		};
	},
	//方法
	methods: {
		onLogin() {
			// #ifdef H5
			if(getBrowser() == "微信"){
				// 第一个参数不用里，H5其他环境会询问跳转到登录页
				h5Login("judge", function(){
					uni.showToast({
						title:"登录成功",
						icon:"none"
					});
				});
			}else{
				uni.showToast({
					title:"请在微信公众号环境使用",
					icon:"none"
				});
			}
			// #endif
			// #ifndef H5
			uni.showToast({
				title:"请在微信公众号环境使用",
				icon:"none"
			});
			// #endif
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
