<template>
	<view class="content">
		<!-- 示例代码 开始-->
		<z-nav-bar :bgColor="bgColorList" bgColorAngle="45" fontColor="#FFF" title="颜色渐变导航"></z-nav-bar>
		<!---示例代码 结束---->
		<image src="../../../static/demo/2.jpg" mode="widthFix"></image>
		<image src="../../../static/demo/1.jpg" mode="widthFix"></image>
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
				bgColorList:[
					{
						color:"#f37402",
						scale:"0%"
					},
					{
						color:"#0f0",
						scale:"20%"
					},
					{
						color:"#f00",
						scale:"80%"
					},
					{
						color:"#00f",
						scale:"100%"
					}
				]
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
</style>
