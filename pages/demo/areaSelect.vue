<template>
	<view>
		<z-nav-bar title="地区选择"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<!-- <view class="table_title">组件说明</view> -->
			<view class="table_head">
				<text>组件参数</text>
				<text>类型</text>
				<text>描述</text>
			</view>
			<view class="table_content">
				<text>dataList</text>
				<text>Array</text>
				<text>默认值</text>
			</view>
			<view class="table_content">
				<text>length</text>
				<text>int</text>
				<text>地区选择长度（1-3）</text>
			</view>
			<view class="table_content">
				<text>force</text>
				<text>Boolean</text>
				<text>强制选择，选择长度必须达到指定长度</text>
			</view>
			<view class="table_content">
				<text>@change</text>
				<text>function</text>
				<text>选择时数据返回</text>
			</view>
		</view>
		<view class="input_form_box">
			<view class="input_title">
				弹窗使用
			</view>
			<view class="input_box">
				<view class="name required">默认地区选择</view>
				<view class="select_info" @click="popupShow = true">
					<text class="value" v-if="addressList2.length >= 3">{{ addressList2[0].name }}{{ addressList2[1].name }}{{ addressList2[2].name }}</text>
					<text class="select" v-else="">请选择位置</text>
				</view>
			</view>
			<view class="input_box">
				<view class="name required">只能选到市级</view>
				<view class="select_info" @click="popupShow3 = true">
					<text class="value" v-if="addressList3.length >= 2">{{ addressList3[0].name }}{{ addressList3[1].name }}</text>
					<text class="select" v-else="">请选择位置</text>
				</view>
			</view>
			<view class="input_box">
				<view class="name required">可以选择任意级别</view>
				<view class="select_info" @click="popupShow4 = true">
					<text class="value" v-if="addressList4.length == 3">{{ addressList4[0].name }}{{ addressList4[1].name }}{{ addressList4[2].name }}</text>
					<text class="value" v-else-if="addressList4.length == 2">{{ addressList4[0].name }}{{ addressList4[1].name }}</text>
					<text class="value" v-else-if="addressList4.length == 1">{{ addressList4[0].name }}</text>
					<text class="select" v-else="">请选择位置</text>
				</view>
			</view>
		</view>
		<view class="title">直接使用</view>
		<z-address @change="addressChange1" :length="3" :force="true"></z-address>
		<z-address-popup v-model="popupShow" @change="addressChange2"></z-address-popup>
		<z-address-popup v-model="popupShow3" :length="2" @change="addressChange3"></z-address-popup>
		<z-address-popup v-model="popupShow4" :length="3" :force="false"  @change="addressChange4"></z-address-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			popupShow: false,
			popupShow3: false,
			popupShow4: false,
			addressList1:[],
			addressList2:[],
			addressList3:[],
			addressList4:[]
		};
	},
	//第一次加载
	onLoad(e) {},
	//页面显示
	onShow() {},
	//方法
	methods: {
		onPageJump(url) {
			uni.navigateTo({
				url: url
			});
		},
		//位置选择
		addressChange1(e) {
			this.addressList1 = e;
		},
		addressChange2(e) {
			this.addressList2 = e;
		},
		addressChange3(e) {
			this.addressList3 = e;
		},
		addressChange4(e) {
			console.log(e);
			this.addressList4 = e;
		},
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
.title {
	padding: 20rpx 30rpx;
	font-size: 30rpx;
}
</style>
