<template>
	<view>
		<z-nav-bar title="常用工具"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="input_form_box">
			<view class="input_box btm_line">
				<view class="name">获取某个时间距离相当多久</view>
				<view class="select_info" @click="onClickDateDiff">
					<view class="select" v-if="distanceTime">{{distanceTime}}</view>
					<view class="select" v-else>点击尝试</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">时间戳转时间字符串</view>
				<view class="select_info" @click="onFormat">
					<view class="select" v-if="timeStr">{{timeStr}}</view>
					<view class="select" v-else>点击尝试</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">MD5加密</view>
				<view class="input_info">
					<input type="text" v-model="encryption" placeholder="请输入"/>
					<button @click="onMd5">加密</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { clickDateDiff } from '@/plugins/utils.js';
import md5 from '@/plugins/md5.js';
export default {
	data() {
		return {
			distanceTime:"",
			timeStr: "",
			encryption:""
		};
	},
	//方法
	methods: {
		onClickDateDiff() {
			let aimsTime = "2020/5/21 16:13:00";
			this.distanceTime = clickDateDiff(new Date(aimsTime).getTime());
		},
		onFormat(){
			// 当前时间的时间戳
			let timeInt =  new Date().getTime();
			// 转换为yyyy-MM-dd hh:mm:ss格式
			this.timeStr = new Date(timeInt).format("yyyy-MM-dd hh:mm:ss");
		},
		onMd5(){
			if(this.encryption == ""){
				uni.showToast({
					title:"请输入加密数据",
					icon:"none"
				});
				return false;
			}
			this.encryption = md5(this.encryption);
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
