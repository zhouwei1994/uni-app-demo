<template>
	<view>
		<z-nav-bar title="获取当前经纬度"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_title">使用文档</view>
			<view class="table_content">
				<text>兼容公众号、APP、微信小程序</text>
			</view>
			<view class="table_content">
				<text>公众号环境需要获取公众号SDK权限</text>
			</view>
			<view class="table_content">
				<text>获取成功后，经纬度会自动储存到vuex的config/store.js => currentAddress参数里面</text>
			</view>
		</view>	
		<view class="input_form_box">
			<view class="input_box btm_line">
				<view class="name">获取经纬度</view>
				<view class="select_info" @click="onGetLatLon">
					<view class="value" v-if="currentAddress.latitude">{{currentAddress.latitude}},{{currentAddress.longitude}}</view>
					<view class="select" v-else>请选择</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getLatLon } from '@/config/utils';
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			
		};
	},
	computed: {
		...mapState(['currentAddress'])
	},
	//方法
	methods: {
		async onGetLatLon() {
			// true 有错误提示
			// false 没错误提示
			// 成功后，经纬度会自动储存到vuex的config/store.js => currentAddress参数里面
			const data = await getLatLon(true);
			console.log("经纬度数据",data);
			uni.showModal({
				title:"经纬度",
				content: "latitude="+ data.latitude + ", longitude=" + data.longitude
			});
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
