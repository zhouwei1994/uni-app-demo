<template>
	<view>
		<z-nav-bar title="七牛云图片上传"></z-nav-bar>
		<!-- 公共组件-每个页面必须引入 -->
		<public-module></public-module>
        <view class="table_box">
        	<view class="table_title">提醒：不要上传自己隐私照片，例如：身份证照片等</view>
        	<view class="table_title">此图片可在后台管理（群公告有地址）预览</view>
        	<view class="table_title">被拿人滥用本作者概不负责</view>
        </view>
		<view class="input_form_box">
			<view class="input_box">
				<view class="name">上传图片</view>
				<view class="upload_info">
					<view class="upload_img" v-for="(item, index) of imgs" :key="index">
						<image :src="item" mode="aspectFill"></image>
						<text class="delete" @click="onDeleteImg(index)"></text>
					</view>
					<view class="upload_img upload" @click="onImgsUpload" v-if="imgs.length < 9"></view>
				</view>
			</view>
		</view>
		<view class="input_form_box">
			<view class="input_box">
				<view class="name">上传视频</view>
				<view class="upload_info">
					<view class="upload_img" v-for="(item, index) of videos" :key="index">
						<video :src="item" controls></video>
						<text class="delete" @click="onDeleteVideo(index)"></text>
					</view>
					<view class="upload_img upload" @click="onVideosUpload" v-if="videos.length < 9"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imgs: [],
			videos: [],
			files: []
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
		//上传图片
		onImgsUpload() {
			let count = 9 - this.imgs.length;
			this.$http.qnImgUpload({ 
				count: count,
				onEachUpdate: res => {
					console.log("单张上传成功返回：",res);
				},
				onProgressUpdate: res => {
					console.log("上传进度返回：",res);
				}
			}).then(res => {
				this.imgs = this.imgs.concat(res);
			});
		},
		onVideosUpload(){
			this.$http.qnVideoUpload({
				onEachUpdate: res => {
					console.log("单张上传成功返回：",res);
				},
				onProgressUpdate: res => {
					console.log("上传进度返回：",res);
				}
			}).then(res => {
				this.videos = this.videos.concat(res);
			});
		},
		//删除图片
		onDeleteImg(index) {
			this.imgs.splice(index, 1);
		},
		//删除视频
		onDeleteVideo(index) {
			this.videos.splice(index, 1);
		}
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
.upload_file_btn {
	height: 88rpx;
	background-color: $themeColor;
	color: #FFF;
	margin-bottom: 40rpx;
}
</style>
