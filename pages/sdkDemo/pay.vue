<template>
	<view>
		<z-nav-bar title="支付（公众号、APP、微信小程序）"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_title">目前即实现前端的功能，接口方面需要自己去填写</view>
			<view class="table_title">使用文档</view>
			<view class="table_head">
				<text>环境</text>
				<text>说明</text>
			</view>
			<view class="table_content">
				<text>APP微信支付</text>
				<text>在config/utils.js  => setPay()方法修改对应的支付接口</text>
			</view>
			<view class="table_content">
				<text>APP支付宝支付</text>
				<text>在config/utils.js  => setPay()方法修改对应的支付接口</text>
			</view>
			<view class="table_content">
				<text>微信小程序支付</text>
				<text>在config/utils.js  => setPay()方法修改对应的支付接口</text>
			</view>
			<view class="table_content">
				<text>微信公众号支付</text>
				<text>在config/html5Utils.js  => wxPublicPay()方法修改支付接口</text>
			</view>
		</view>	
		<view class="input_form_box">
			<view class="input_box btm_line">
				<view class="name">支付（统一分配方法）</view>
				<view class="select_info" @click="onPay">
					<view class="select">点击支付</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">APP微信支付</view>
				<view class="select_info" @click="onAppWxPay('wxpay')">
					<view class="select">点击支付</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">APP支付宝支付</view>
				<view class="select_info" @click="onAppWxPay('alipay')">
					<view class="select">点击支付</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">微信小程序支付</view>
				<view class="select_info" @click="onAppWxPay('smallPay')">
					<view class="select">点击支付</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">微信公众号支付</view>
				<view class="select_info" @click="onWxPublicPay">
					<view class="select">点击支付</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import { setPay, setPayAssign } from '@/config/utils';
// #ifdef H5
import { wxPublicPay } from '@/config/html5Utils';
// #endif
export default {
	data() {
		return {
			
		};
	},
	//方法
	methods: {
		onPay() {
			setPayAssign({
				price: 8 ,// 价格，
				title: "商品订单", // 标题
				orderNo: "6546541654122315" // 订单编号
			},res => {
				// 小程序支付的回调
				if(res.success){
					uni.showToast({
						title:"支付成功",
						icon:"none"
					});
				}else{
					uni.showToast({
						title:"支付失败，" + res.data,
						icon:"none"
					});
				}
			});
		},
		onAppWxPay(type){
			setPay({
				type: type,  // APP微信支付=wxpay，APP支付宝支付=alipay，微信小程序支付=smallPay
				price: 8 ,// 价格，
				title: "商品订单", // 标题
				orderNo: "6546541654122315" // 订单编号
			},res => {
				// 小程序支付的回调
				if(res.success){
					uni.showToast({
						title:"支付成功",
						icon:"none"
					});
				}else{
					uni.showToast({
						title:"支付失败，" + res.data,
						icon:"none"
					});
				}
			})
		},
		// 公众号支付
		onWxPublicPay(){
			// #ifdef APP-PLUS
			wxPublicPay({
				orderNo: "6546541654122315" // 订单编号
			});
			// #endif
			// #ifndef APP-PLUS
			uni.showToast({
				title:"请在微信公众号环境使用",
				icon:"none"
			});
			// #endif
			
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
