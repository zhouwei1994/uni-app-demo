<template>
	<view>
		<z-nav-bar title="分享（APP、微信小程序、微信公众号）"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_content">
				<text>（APP、微信小程序、微信公众号）分享的默认参数在config/baseUrl.js  share里面设置</text>
			</view>
			<view class="table_title">APP分享使用文档</view>
			<view class="table_content">
				<text @click="onJumpWebview('https://ext.dcloud.net.cn/plugin?id=1645')">文档地址：https://ext.dcloud.net.cn/plugin?id=1645</text>
			</view>
			<view class="table_title">公众号分享使用说明</view>
			<view class="table_content">
				<text>公众号分享设置需要先获取公众号SDK权限，<text class="btn" @click="onPageJump('/pages/sdkDemo/publicSdk')">详情点击这里</text></text>
			</view>
			<view class="table_title">微信小程序分享使用说明</view>
			<view class="table_content">
				<text>wxShare方法已挂载全局</text>
			</view>
		</view>	
		<view class="input_form_box">
			<view class="input_box btm_line">
				<view class="name">APP分享</view>
				<view class="select_info" @click="onAppShare">
					<view class="select">点击分享</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">公众号分享数据设置</view>
				<view class="select_info" @click="onPublicShare">
					<view class="select">点击设置</view>
				</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="input_box btm_line">
				<view class="name">微信小程序分享</view>
				<button class="select_info" open-type="share">
					<view class="select">点击分享</view>
				</button>
			</view>
			<!-- #endif -->
			<view class="input_box btm_line">
				<view class="name">微信小程序环境查看小程序分享</view>
				<button class="select_info">
					<view class="select">点击分享</view>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef H5
import { getBrowser } from '@/config/html5Utils.js';
// #endif
import { appShare, publicShare, wxShare, closeAppShare } from '@/config/utils';
export default {
	data() {
		return {
			
		};
	},
	//方法
	methods: {
		// APP分享
		onAppShare() {
			// #ifdef APP-PLUS
			let shareObj = appShare({
				shareUrl:"https://kemean.com/",
				shareTitle:"分享的标题",
				shareContent:"分享的描述",
				shareImg:"http://qn.kemean.cn//upload/202004/18/1587189024467w6xj18b1.jpg",
				appId : "wxd0e0881530ee4444", // 默认不传type的时候，必须传appId和appPath才会显示小程序图标
				appPath : "pages/home/home",
				appWebUrl : "https://kemean.com/",
			},res => {
				console.log("分享成功回调",res);
				// 分享成功后关闭弹窗
				// 第一种关闭弹窗的方式
				closeAppShare();
			});
			setTimeout(() => {
				// 第二种关闭弹窗的方式
				shareObj.close();
			},5000); 
			// #endif
			// #ifndef APP-PLUS
			uni.showToast({
				title:"请在APP环境使用",
				icon:"none"
			});
			// #endif
		},
		onPublicShare(){
			// #ifdef H5
			 if (getBrowser() == '微信') {
			 	publicShare({
			 		shareUrl:"https://kemean.com/",
			 		shareTitle:"分享的标题",
			 		shareContent:"分享的描述",
			 		shareImg:"http://qn.kemean.cn//upload/202004/18/1587189024467w6xj18b1.jpg",
			 	},function(){
			 		uni.showToast({
			 			title: '分享设置成功！',
			 			icon: 'none'
			 		});
			 	});
			 } else {
			 	uni.showToast({
			 		title: '请在微信浏览器使用',
			 		icon: 'none'
			 	});
			 }
			// #endif
			// #ifndef H5
			uni.showToast({
				title: '请在微信浏览器使用',
				icon: 'none'
			});
			// #endif
		},
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		}
	},
	//用户点击分享
	onShareAppMessage(e) {
		// wxShare方法已挂载全局
		return this.wxShare();
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
.table_box .table_content .btn {
	color: #007AFF;
}
</style>
