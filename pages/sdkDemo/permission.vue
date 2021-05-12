<template>
	<view>
		<z-nav-bar title="APP权限判断和跳转到系统设置"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
		<view class="table_box">
			<view class="table_title">SDK说明</view>
			<view class="table_content"><text @click="onJumpWebview('https://ext.dcloud.net.cn/plugin?id=594')">根据官方SDK修改：https://ext.dcloud.net.cn/plugin?id=594</text></view>
			<view class="table_head">
				<text>permissionID</text>
				<text>说明</text>
			</view>
			<view class="table_content">
				<text>location</text>
				<text>位置权限</text>
			</view>
			<view class="table_content">
				<text>camera</text>
				<text>摄像头权限</text>
			</view>
			<view class="table_content">
				<text>photoLibrary</text>
				<text>相册权限</text>
			</view>
			<view class="table_content">
				<text>record</text>
				<text>麦克风权限</text>
			</view>
			<view class="table_content">
				<text>push</text>
				<text>推送权限</text>
			</view>
			<view class="table_content">
				<text>contact</text>
				<text>通讯录</text>
			</view>
			<view class="table_content">
				<text>calendar</text>
				<text>日历</text>
			</view>
			<view class="table_content">
				<text>memo</text>
				<text>备忘录</text>
			</view>
			<view class="table_content">
				<text>call_phone</text>
				<text>拨打电话</text>
			</view>
		</view>	
		<view class="input_form_box">
			<view class="input_box btm_line">
				<view class="name">获取位置权限</view>
				<view class="select_info" @click="getDevicePermission('location')">
					<view class="select">点击获取</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">获取摄像头权限</view>
				<view class="select_info" @click="getDevicePermission('camera')">
					<view class="select">点击获取</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">获取相册权限</view>
				<view class="select_info" @click="getDevicePermission('photoLibrary')">
					<view class="select">点击获取</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">获取麦克风权限</view>
				<view class="select_info" @click="getDevicePermission('record')">
					<view class="select">点击获取</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">获取推送权限</view>
				<view class="select_info" @click="getDevicePermission('push')">
					<view class="select">点击获取</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">获取通讯录权限</view>
				<view class="select_info" @click="getDevicePermission('contact')">
					<view class="select">点击获取</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">获取日历权限</view>
				<view class="select_info" @click="getDevicePermission('calendar')">
					<view class="select">点击获取</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">获取备忘录权限</view>
				<view class="select_info" @click="getDevicePermission('memo')">
					<view class="select">点击获取</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">获取拨打电话权限</view>
				<view class="select_info" @click="getDevicePermission('call_phone')">
					<view class="select">点击获取</view>
				</view>
			</view>
		</view>
		<view class="input_form_box">
			<view class="input_box btm_line">
				<view class="name">跳转到手机应用设置页面</view>
				<view class="select_info" @click="onJumpSystemSettings">
					<view class="select">点击跳转</view>
				</view>
			</view>
			<view class="input_box btm_line">
				<view class="name">检查系统的设备服务是否开启</view>
				<view class="select_info" @click="onExamination">
					<view class="select">点击获取</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef APP-PLUS
import { judgePermission, gotoAppPermissionSetting, checkSystemEnableLocation } from '@/plugins/permission';
// #endif
export default {
	data() {
		return {
			
		};
	},
	//方法
	methods: {
		// 获取权限
		getDevicePermission(permissionID){
			/* 
			*permissionID:
			* location => 位置
			* camera => 摄像头
			* photoLibrary => 相册
			* record => 麦克风
			* push => 推送
			* contact => 通讯录
			* calendar => 日历
			* memo => 备忘录
			* call_phone => 拨打电话
			*/
			// #ifdef APP-PLUS
			judgePermission(permissionID, function(res){
				console.log(res);
				if (res === 1) {
					uni.showToast({
						title:"已获取到权限",
						icon:"none"
					});
				}else if(res === 0){
					uni.showToast({
						title:"正在获取权限，会弹窗提示",
						icon:"none"
					});
				}else if(res === -1){
					uni.showToast({
						title:"用户已拒绝权限，会弹窗提示用户到【系统设置】里面开启权限",
						icon:"none"
					});
				}
			});
			// #endif
			// #ifndef APP-PLUS
			uni.showToast({
				title:"请在APP环境使用",
				icon:"none"
			});
			// #endif
		},
		// 跳转到应用设置
		onJumpSystemSettings(){
			// #ifdef APP-PLUS
			gotoAppPermissionSetting();
			// #endif
			// #ifndef APP-PLUS
			uni.showToast({
				title:"请在APP环境使用",
				icon:"none"
			});
			// #endif
		},
		// 检查系统的设备服务是否开启
		onExamination(){
			// #ifdef APP-PLUS
			if(checkSystemEnableLocation()){
				uni.showToast({
					title:"已开启设备服务权限",
					icon:"none"
				});
			}else{
				uni.showToast({
					title:"未开启设备服务权限",
					icon:"none"
				});
			}
			// #endif
			// #ifndef APP-PLUS
			uni.showToast({
				title:"请在APP环境使用",
				icon:"none"
			});
			// #endif
		},
		onJumpWebview(url){
			// #ifdef H5
			window.open(url);
			// #endif
			// #ifndef H5
			this.$store.commit("setWebViewUrl", url);
			uni.navigateTo({
				url: '/pages/template/webView'
			});
			// #endif
		}
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
.input_form_box {
	margin-bottom: 20rpx;
}
</style>
