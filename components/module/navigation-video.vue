<template>
	<view class="footer_box" :class="{'footer_bg': bg}" :style="{paddingBottom: bottomBlackLineHeight + 'rpx'}">
		<view class="footer_item" v-for="(item, index) of navigationList" :key="index" @click="onPageJump(item)">
			<text class="footer_item_text" :class="[item.pagePath == path ? 'footer_item_text_active' : '']">{{ item.text }}</text>
		</view>
	</view>
</template>
<script>
	import $http from '@/config/requestConfig';
	import {
		judgeLogin
	} from '@/config/login.js';
export default {
	props: {
		bg: {
			type: Boolean,
			default: true
		},
		bottomBlackLineHeight: {
			type: Number,
			default: function(){
				return 0
			}
		}
	},
	data() {
		return {
			path: '',
			navigationList: [
				{
					text: '新增功能',
					pagePath: 'pages/template/addTemplate',
					tab: true
				},
				{
					text: '组件示例',
					pagePath: 'pages/demo/common',
					tab: true
				},
				{
					text: 'SDK示例',
					pagePath: 'pages/sdkDemo/common',
					tab: true
				},
				{
					text: '模板页面',
					pagePath: 'pages/template/common',
					tab: true
				}
			]
		};
	},
	//第一次加载
	created() {
		//获取所有页面
		let currentPages = getCurrentPages();
		let page = currentPages[currentPages.length - 1];
		this.path = page.route;
	},
	//方法
	methods: {
		onPageJump(item) {
			if(item.tab){
				uni.switchTab({
					url: "/" + item.pagePath
				});
			} else {
				uni.reLaunch({
					url: "/" + item.pagePath
				});
			}
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
.footer_station {
	height: 100rpx;
}
.footer_box {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 750rpx;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	z-index: 10;
}
.footer_bg {
	// background-color: rgba(0,0,0,0.4);
}
.footer_item {
	flex: 1;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 98rpx;
}
.footer_item:active {
	background-color: rgba($color: #fff, $alpha: 0.1);
}
.footer_item_text {
	font-size: 28rpx;
	color: #ffffff;
	margin-top: 6rpx;
}
.footer_item_text_active {
	color: #ffffff;
}
</style>
