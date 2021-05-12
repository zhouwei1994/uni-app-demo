<template>
	<view class="protocol_page">
		<z-nav-bar title="协议"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="title">{{title}}</view>
		<jyf-parser ref="article"></jyf-parser>
	</view>
</template>

<script>
export default {
	data() {
		return {
			type:1000,
			title:"用户协议"
		};
	},
	//第一次加载
	onLoad(e) {
		if(e.type){
			this.type = parseInt(e.type);
			let title;
			switch (this.type) {
				case 1000:
					title = "登录注册用户协议";
					break;
			}
			this.title = title;
		}
		this.pageData();
	},
	//页面显示
	onShow() {},
	//方法
	methods: {
		pageData() {
			this.$http
				.get('api/common/v1/protocol', {
					type: this.type
				})
				.then(res => {
					this.$refs.article.setContent(res);
				});
		}
	},
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
.protocol_page {
	background-color: #fff;
	padding: 30upx;
	font-size: 30upx;
	line-height: 180%;
	.title {
		font-size: 50upx;
		padding-bottom: 30upx;
	}
}
</style>
