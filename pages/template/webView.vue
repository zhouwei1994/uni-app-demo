<template>
	<web-view :src="webViewUrl"></web-view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
		};
	},
	//第一次加载
	onLoad(e) {
	},
	//页面显示
	onShow() {},
	computed: {
		...mapState(['webViewUrl'])
	},
	//方法
	methods: {},
	//页面隐藏
	onHide() {},
	//页面卸载
	onUnload() {},
	//页面下来刷新
	onPullDownRefresh() {},
	//页面上拉触底
	onReachBottom() {},
	//用户点击分享
	onShareAppMessage(e) {
		return this.wxShare();
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
