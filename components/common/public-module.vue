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
	import zLoading  from "@/components/common/loading.vue"
	// #ifdef MP-WEIXIN
	import appletsLogin  from "@/components/common/applets-login.vue"
	// #endif
    // #ifdef APP-PLUS
    import guidePages  from "@/components/module/guide-pages.vue"
    // #endif
	export default {
		components:{
			zLoading,
			// #ifdef MP-WEIXIN
			appletsLogin,
			// #endif
            // #ifdef APP-PLUS
            guidePages,
            // #endif
		}
	};
</script>
<style lang="scss" scoped>

</style>
