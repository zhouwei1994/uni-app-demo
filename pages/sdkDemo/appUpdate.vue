<template>
	<view>
		<z-nav-bar title="APP版本更新"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_title">使用文档</view>
			<view class="table_content">
				<text @click="onJumpWebview('https://ext.dcloud.net.cn/plugin?id=1643')">文档地址：https://ext.dcloud.net.cn/plugin?id=1643</text>
			</view>
		</view>	
		<view class="input_form_box">
			<view class="input_box btm_line">
				<view class="name">获取版本号</view>
				<view class="select_info" @click="getVersionName">
					<view class="value" v-if="versionName">{{versionName}}</view>
					<view class="select" v-else>请选择</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">更新APP</view>
				<view class="select_info" @click="onAPPUpdate">
					<view class="select">点击更新</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef APP-PLUS
import APPUpdate, { getCurrentNo } from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
// #endif
export default {
	data() {
		return {
			versionName: ""
		};
	},
	//方法
	methods: {
		getVersionName() {
			// #ifdef APP-PLUS
			getCurrentNo(res => {
				this.versionName = res.versionName
			});
			// #endif
			// #ifndef APP-PLUS
			uni.showToast({
				title:"请在APP环境使用",
				icon:"none"
			});
			// #endif
		},
		onAPPUpdate(){
			// #ifdef APP-PLUS
			// true 在出现无新版本的情况下，有弹窗提示
			// false 无提示（一般在APP.vue使用）
			APPUpdate(true);
			// #endif
			// #ifndef APP-PLUS
			uni.showToast({
				title:"请在APP环境使用",
				icon:"none"
			});
			// #endif
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
