<template>
	<view>
		<z-nav-bar title="保存图片到相册（APP、微信小程序）"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_title">使用注意事项</view>
			<view class="table_content">
				<text>微信小程序请用https开头的图片，否则会报错</text>
			</view>
		</view>	
		<view class="input_form_box">
			<view class="input_box btm_line">
				<view class="name">图片地址</view>
				<view class="input_info">
					<input type="text" v-model="imgUrl" placeholder="微信小程序请用https开头的图片" />
					<button @click="onAdd">添加图片地址</button>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">保存图片到相册</view>
				<view class="select_info" @click="onSaveImg">
					<view class="select">点击保存</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import { saveImg } from '@/plugins/utils.js';
export default {
	data() {
		return {
			imgUrl:""
		};
	},
	//方法
	methods: {
		onAdd(){
			this.imgUrl = "http://8.129.186.35/images/2020-08/1596705646019097ajg.jpg";
		},
		onSaveImg() {
			// #ifdef MP-WEIXIN || APP-PLUS || H5
			if(this.imgUrl == ""){
				uni.showToast({
					title:"请输入要保存的图片地址",
					icon:"none"
				});
				return false;
			}
			saveImg(this.imgUrl, function(){
				console.log("保存成功！");
			});
			// #endif
			// #ifndef MP-WEIXIN || APP-PLUS || H5
			uni.showToast({
				title: '请在H5、APP或微信小程序环境使用',
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
