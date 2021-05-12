<template>
	<view class="content">
		<!-- 示例代码 开始-->
		<z-nav-bar  title="左插槽-地址选择">
			<view slot="left" class="address_select">深圳市</view>
		</z-nav-bar>
		<!---示例代码 结束---->
		<image src="../../../static/demo/1.jpg" mode="widthFix"></image>
		<image src="../../../static/demo/2.jpg" mode="widthFix"></image>
		<image src="../../../static/demo/3.jpg" mode="widthFix"></image>
		<image src="../../../static/demo/4.jpg" mode="widthFix"></image>
		<image src="../../../static/demo/5.jpg" mode="widthFix"></image>
		<image src="../../../static/demo/6.jpg" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	image {
		width: 750rpx;
		display: block;
	}
	.address_select {
		padding-left: 76upx;
		font-size: 32upx;
		display: flex;
		align-items: center;
		color: #333333;
		background-image: url('../../../static/demo/icon_location.png');
		background-position: 30upx center;
		background-repeat: no-repeat;
		background-size: auto 90%;
	}
</style>
