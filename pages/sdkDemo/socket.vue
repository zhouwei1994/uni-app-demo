<template>
	<view>
		<z-nav-bar title="webSocket封装介绍"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_title">使用文档</view>
			<view class="table_content"><text>webSocket 代码文件在config/socket.js，使用前仔细阅读代码</text></view>
			<view class="table_content"><text>在使用前请先在config/baseUrl.js 里面的socketUrl参数配置地址，不配置不会启动webSocket</text></view>
			<view class="table_content"><text>在用户登录后webSocket会启动</text></view>
			<view class="table_content"><text>config/socket.js只是基本封装，根据自己的业务去设置</text></view>
		</view>
		<view class="input_form_box">
			<view class="input_box btm_line">
				<view class="name">启动webSocket</view>
				<view class="select_info" @click="onSocketOpen"><view class="select">点击启动</view></view>
			</view>
			<view class="input_box btm_line">
				<view class="name">发送消息</view>
				<view class="input_info">
					<input type="text" v-model="message" placeholder="发送的内容"/>
					<button @click="onSocketSend">发送</button>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
import socket from '@/config/socket.js';
export default {
	data() {
		return {
			message: ""
		};
	},
	created() {
		socket.acceptMessage = function(res){
			console.log("页面收到的消息", res);
			uni.showToast({
				title:"服务器发送给你的消息：" + res.message,
				icon:"none"
			});
		}
	},
	//方法
	methods: {
		// 启动webSocket
		onSocketOpen() {
			socket.init(function() {
				uni.showToast({
					title: '启动成功！',
					icon: 'none'
				});
			});
		},
		// 发送消息
		onSocketSend(){
			if(this.message == ""){
				uni.showToast({
					title:"请输入要发送的信息",
					icon:"none"
				});
				return false;
			}
			socket.send({
				type: "text",
				message: this.message
			}, () => {
				this.message = "";
				uni.showToast({
					title:"发送成功！",
					icon:"none"
				});
			});
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
</style>
