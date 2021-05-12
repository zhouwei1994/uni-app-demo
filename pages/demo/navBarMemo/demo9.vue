<template>
	<view class="content">
		<!-- 示例代码 开始-->
		<z-nav-bar home :bgColor="bgColor" :fontColor="fontColor" :title="title"></z-nav-bar>
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
				bgColor:"#FFF",
				fontColor:"#000",
				title:"案例展示9"
			}
		},
		onLoad() {
			this.changeColor(1);
		},
		methods: {
			changeColor(type){
				setTimeout(() => {
					if(type == 1){
						this.bgColor = "#f37402";
						this.fontColor = "#FFF";
						this.title = "案例展示9";
						this.changeColor(2);
					}else{
						this.bgColor = "#FFF";
						this.fontColor = "#000";
						this.title = "案例展示9-9";
						this.changeColor(1);
					}
				},2000);
			}
		}
	}
</script>

<style>
	image {
		width: 750rpx;
		display: block;
	}
</style>
