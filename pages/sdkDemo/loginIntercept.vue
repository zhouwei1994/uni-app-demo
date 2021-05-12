<template>
	<view>
		<z-nav-bar title="登录拦截（公众号、APP、微信小程序）"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_title">使用文档</view>
			<view class="table_content">
				<text>登录拦截配置在 config/login.js => judgeLogin方法</text>
			</view>
			<view class="table_content">
				<text>根据自己的业务需求修改</text>
			</view>
		</view>	
		<view class="input_form_box">
			<view class="input_box btm_line">
				<view class="name">登录拦截</view>
				<view class="select_info" @click="onJudgeLogin">
					<view class="select">点击</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		};
	},
	//方法
	methods: {
		onJudgeLogin() {
			this.judgeLogin(() => {
				uni.showToast({
					title:"用户已登录，接下来可以处理用户的功能了",
					icon:"none"
				});
			}, "judge"); // judge:（默认值） 如果未登录询问是否登录  force：未登录直接强制登录
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
