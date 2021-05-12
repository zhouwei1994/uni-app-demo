<template>
	<view>
		<z-nav-bar title="项目主题色介绍"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_title">使用说明</view>
			<view class="table_content"><text>主题色配置文件在style/mixin.scss文件里面</text></view>
			<view class="table_content"><text>$themeColor是定义主题颜色的</text></view>
			<view class="table_content"><text>要使用主题色需要在每个页面的css里面引入@import '@/style/mixin.scss';</text></view>
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
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
