<template>
	<view>
		<z-nav-bar title="富文本编译"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_title">使用文档</view>
			<view class="table_content"><text @click="onJumpWebview('https://ext.dcloud.net.cn/plugin?id=805')">文档地址：https://ext.dcloud.net.cn/plugin?id=805</text></view>
		</view>
		<view class="content">
			<jyf-parser :html="html"></jyf-parser>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			html: `<p>微信小程序直播自2月14日开放内侧以来，关注度一直居高不下，现在商淘软件多个电商系统都已接入小程序直播，今天，商家云以多商户系统为例，讲解<span style="color: #e03e2d;"><a style="color: #e03e2d;" href="https://www.kemean.com/">微信小程序直播</a></span>在设计时应该注意到哪些方面呢？</p>
<p>1.&nbsp; 能让人耳目一新的版面设计</p>
<p>在我们所见到的直播系统当中，虽说每个直播间看起来大同小异，但是仔细的观察还是略微不同，所以我们在直播功能设计的时候一定要充分的考虑到人的视觉观感，让人耳目一新。</p>
<p>2.&nbsp; 无缝对接商城会员体系</p>
<p>小程序直播的主播在直播带货的过程中，直播充分讲解产品的卖点，让消费者充分的了解到商城里面的产品，这时观众点击商品跳转到小程序商城购物，中间需要能无缝对接，不要让人有还需要登录之类的操作，以免降低转化。</p>
<p><img src="http://qn.kemean.cn/xinshidai/202005/09/ee1db57c428243d1a3dd5e9243391ce970ca306109754626bb833df482b4c03a.jpg" alt="" width="500" height="300"></p>
<p>3.&nbsp; 要有回放功能</p>
<p>用户有时间观看直播，那他可以准时到直播间进行观看，如果他没时间，需要考虑到回放的功能，这样用户才能有更好的体验。</p>
<p>以上就是商家云在小程序直播功能设计上的一点见解。商淘软件目前已经开发完成，能完美的与商城结合。始终以客户体验为第一需求，以雄厚的技术团队和专业的设计团队帮助企业快速搭建商城系统平台，提供全方位的技术指导和售后服务。</p>
<p>&nbsp;</p>`
		};
	},
	//方法
	methods: {
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		onJumpWebview(url) {
			// #ifdef H5
			window.open(url);
			// #endif
			// #ifndef H5
			this.$store.commit('setWebViewUrl', url);
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
.content {
	font-size: 28rpx;
	padding: 30rpx;
	color: #333;
	line-height: 150%;
}
</style>
