<template>
	<view class="we_chat_pay">
		<z-nav-bar title="支付"></z-nav-bar>
		<!-- 支付订单信息 -->
		<view class="pay_info_box">
			<view class="title">订单编号：{{ orderNo }}</view>
			<view class="price_box">
				<view class="price">
					￥
					<text>{{ price }}</text>
				</view>
				<view class="name">{{ title }}</view>
			</view>
		</view>
		<!-- 支付方式 -->
		<view class="pay_pattern">
			<text class="tip">请选择支付方式</text>
			<view class="pay_box" @click="payType = 'wxpay'">
				<view class="icon">
					<image src="../../static/icon/wechat.png" mode="aspectFit"></image>
					<view>微信</view>
				</view>
				<view class="btn">
					<image v-if="payType == 'wxpay'" src="../../static/icon/ic_agreed.png" mode="aspectFit"></image>
					<image v-else src="../../static/icon/icon_weixuanzhong.png" mode="aspectFit"></image>
				</view>
			</view>
			<!-- #ifndef H5 -->
			<view class="pay_box" @click="payType = 'alipay'">
				<view class="icon">
					<image src="../../static/demo/zhifubao.png" mode="aspectFit"></image>
					<view>支付宝</view>
				</view>
				<view class="btn">
					<image  v-if="payType == 'alipay'" src="../../static/icon/ic_agreed.png" mode="aspectFit"></image>
					<image v-else src="../../static/icon/icon_weixuanzhong.png" mode="aspectFit"></image>
				</view>
			</view>
			<!-- #endif -->
			<view class="pay_box" @click="onBalanceSelect">
				<view class="icon">
					<image src="../../static/demo/icon_yue.png" mode="aspectFit"></image>
					<view>余额支付（可用余额：{{ balanceInfo.freeMoney }}）</view>
				</view>
				<view class="btn">
					<image  v-if="payType == 'balance'" src="../../static/icon/ic_agreed.png" mode="aspectFit"></image>
					<image v-else src="../../static/icon/icon_weixuanzhong.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>
		<!-- 支付按钮 -->
		<view class="pay_btn" @click="onPay">
			<button>确定支付￥{{ price }}</button>
		</view>
	</view>
</template>

<script>
// #ifdef H5
import { weiXinPay } from '@/config/html5Utils';
// #endif
import { setPay } from '@/config/utils';
export default {
	data() {
		return {
			// 选择微信支付
			payType: "wxpay",
			// 订单号
			orderNo: '',
			// 商店名称
			title: '',
			// 订单总价
			price: '',
			balanceInfo:{
				freeMoney:0
			}
		};
	},
	onLoad(e) {
		this.orderNo = e.orderNo;
		this.title = e.title;
		this.price = e.price;
		this.pageData();
	},
	methods: {
		onBalanceSelect(){
			if(this.price <= this.balanceInfo.freeMoney){
				this.payType = 'balance';
			}else{
				uni.showToast({
					title: '余额不足支付该订单',
					icon: 'none'
				});
			}
		},
		pageData(){
			this.$http
				.get('api/mime/wallet/v1/info')
				.then(res => {
					this.balanceInfo = res;
				});
		},
		// 支付
		onPay() {
			if(this.payType == "balance"){
				this.$http
					.get('api/pay/v1/balance_pay',{ orderNo: this.orderNo})
					.then(res => {
						uni.showModal({
							title: '提示',
							content: '支付成功',
							showCancel:false,
							success: (res) => {
								if (res.confirm) {
									uni.redirectTo({
										url: "/pages/shopCar/paySuccess?orderNo="+this.orderNo
									});
								}
							}
						});
					});
			}else{
				// #ifdef H5
				if(this.payType == "wxpay"){
					this.$http.get('api/pay/v1/public_pay_sign_wx', { orderNo: this.orderNo }).then(res => {
						weiXinPay(res,() => {
							uni.showModal({
								title: '提示',
								content: '支付成功',
								showCancel:false,
								success: (res) => {
									if (res.confirm) {
										uni.redirectTo({
											url: "/pages/shopCar/paySuccess?orderNo="+this.orderNo
										});
									}
								}
							});
						});
					});
				}
				// #endif
				// #ifdef APP-PLUS
				setPay({
					orderNo: this.orderNo,
					type: this.payType 
				},res => {
					if(res.success){
						uni.showModal({
							title: '提示',
							content: '支付成功',
							showCancel:false,
							success: (res) => {
								if (res.confirm) {
									uni.redirectTo({
										url: "/pages/shopCar/paySuccess?orderNo="+this.orderNo
									});
								}
							}
						});
					}else{
						uni.showToast({
							title:'支付失败',
							icon:"none"
						});
					}
				});
				// #endif
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
.we_chat_pay {
	padding: 20rpx 30rpx;
	.pay_info_box {
		background-image: url('../../static/demo/card_bg.png');
		background-position: center bottom;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		// border-radius: 40rpx;
		background-color: rgba(0, 0, 0, 0.06);
		box-shadow: 0rpx 20rpx 30rpx 0rpx rgba(0, 0, 0, 0.06);
		padding: 0 30rpx;
		.title {
			padding: 25rpx 0;
			border-bottom: 1rpx dashed #cccccc;
			font-size: 26rpx;
			color: #999999;
		}
		.price_box {
			height: 240rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			.price {
				font-size: 36rpx;
				color: #ff5d32;
				> text {
					font-size: 72rpx;
					color: #ff5d32;
				}
			}
			.name {
				font-size: 24rpx;
				color: #999999;
			}
		}
	}

	.pay_pattern {
		margin-top: 50rpx;
		.tip {
			font-size: 28rpx;
			color: #333333;
		}
		.pay_box {
			width: 100%;
			height: 88rpx;
			background-color: #ffffff;
			border-radius: 6rpx;
			margin-top: 30rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 30rpx;
			.icon {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				> image {
					width: 50rpx;
					height: 41rpx;
				}
				> view {
					margin-left: 30rpx;
					font-size: 28rpx;
					color: #333333;
				}
			}
			.btn {
				width: 30rpx;
				height: 30rpx;
				image {
					width: 30rpx;
					height: 30rpx;
				}
			}
		}
	}
	.pay_btn {
		width: 100%;
		> button {
			position: fixed;
			left: 30rpx;
			right: 30rpx;
			bottom: 30rpx;
			height: 88rpx;
			background-color: $themeColor;
			background-blend-mode: normal, normal;
			border-radius: 6rpx;
			color: #ffffff;
			font-size: 32rpx;
			line-height: 88rpx;
			text-align: center;
		}
	}
}
</style>
