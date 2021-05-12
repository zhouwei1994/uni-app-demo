<template>
	<view>
		<!-- 加载动画组件 -->
		<z-loading></z-loading>
		<!-- #ifdef MP-WEIXIN -->
		<!-- 小程序登录弹窗组件 -->
		<applets-login></applets-login>
		<!-- #endif -->
        <!-- #ifdef APP-PLUS -->
        <guide-pages></guide-pages>
        <!-- #endif -->
	</view>
</template>

<script>
	export default {
	};
</script>
<style lang="scss" scoped>

</style>
