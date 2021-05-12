<template>
	<view>
		<z-nav-bar title="公众号SDK"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_title">使用前需要配置的参数</view>
			<view class="table_content"><text>config/baseUrl.js => 对应的环境添加publicAppId参数值（微信公众号APPID）</text></view>
			<view class="table_head">
				<text>文件夹</text>
				<text>描述</text>
			</view>
			<view class="table_content">
				<text>plugins/wxJsSDK.js</text>
				<text>72行 => 配置获取SDK权限签名、随机数、时间戳的接口，修改入参名称</text>
			</view>
			<view class="table_content"><text>目前就使用了定位和分享，需要其他的SDK，自行配置</text></view>
		</view>
		<view class="input_form_box">
			<view class="input_box btm_line">
				<view class="name">公众号获取经纬度</view>
				<view class="select_info" @click="onGetLocation"><view class="select">点击获取</view></view>
			</view>
			<view class="input_box btm_line">
				<view class="name">公众号设置分享信息</view>
				<view class="select_info" @click="onSetShare"><view class="select">点击获取</view></view>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef H5
import { getBrowser } from '@/config/html5Utils.js';
import { getLocation, setShare } from '@/plugins/wxJsSDK';
// #endif
export default {
	data() {
		return {};
	},
	//方法
	methods: {
		onGetLocation() {
			// #ifdef H5
			if (getBrowser() == '微信') {
				getLocation().then(res => {
					console.log(res);
					uni.showToast({
						title: '已获取到经纬度信息',
						icon: 'none'
					});
				});
			} else {
				uni.showToast({
					title: '请在微信公众号环境使用',
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
		onSetShare() {
			// #ifdef H5
			if (getBrowser() == '微信') {
				setShare({
					title:"分享标题",
					desc:"分享描述",
					link:"http://kemean.com", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: "分享图标"
				},function(){
					uni.showToast({
						title: '分享设置成功！',
						icon: 'none'
					});
				});
			} else {
				uni.showToast({
					title: '请在微信公众号环境使用',
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
			
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
