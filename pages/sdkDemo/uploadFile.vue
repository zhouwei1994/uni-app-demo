<template>
	<view>
		<z-nav-bar title="服务器图片上传/文件上传"></z-nav-bar>
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
						<image :src="item.url" mode="aspectFill"></image>
						<text class="delete" @click="onDeleteImg(index)"></text>
					</view>
					<view class="upload_img upload" @click="onImgsUpload" v-if="imgs.length < 9"></view>
				</view>
			</view>
			<view class="input_form_box">
				<view class="input_box">
					<view class="name">上传视频</view>
					<view class="upload_info">
						<view class="upload_img" v-for="(item, index) of videos" :key="index">
							<video :src="item.url" controls></video>
							<text class="delete" @click="onDeleteVideo(index)"></text>
						</view>
						<view class="upload_img upload" @click="onVideosUpload" v-if="videos.length < 9"></view>
					</view>
				</view>
			</view>
			<view class="input_box">
				<view class="name">上传文件</view>
				<view class="upload_file_info">
					<view class="upload_file" v-for="(item, index) of files" :key="index">
						<view class="upload_url">{{item.url}}</view>
						<text class="delete" @click="onDeleteFiles(index)">删除</text>
					</view>
					<button type="default" class="upload_file_btn" @click="onFilesUpload" v-if="files.length < 9">上传文件</button>
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
			files: [],
			videos: []
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
			this.$http.urlImgUpload({
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
		//删除图片
		onDeleteImg(index) {
			this.imgs.splice(index, 1);
		},
		// 视频
		onVideosUpload(){
			this.$http.urlVideoUpload("api/common/v1/upload_file", {
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
		//删除视频
		onDeleteVideo(index) {
			this.videos.splice(index, 1);
		},
		//上传文件
		onFilesUpload() {
			let count = 9 - this.files.length;
			uni.chooseImage({
				count: count, //默认9
				sizeType:  ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], //从相册选择
				success: (res) => {
					this.$http.urlFileUpload("api/common/v1/upload_file", {
						files: res.tempFiles
					},{
						onEachUpdate: res => {
							console.log("单张上传成功返回：",res);
						},
						onProgressUpdate: res => {
							console.log("上传进度返回：",res);
						}
					}).then(res => {
						this.files = this.files.concat(res);
					});
				}
			});
		},
		//删除文件
		onDeleteFiles(index) {
			this.files.splice(index, 1);
		},
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
.upload_file_info {
	width: 100%;
	.upload_file {
		border:2rpx dashed #ccc;
		padding: 30rpx;
		width: 100%;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		margin-bottom: 20rpx;
		.upload_url {
			font-size: 28rpx;
		}
		.delete {
			font-size: 26rpx;
			color: #FFF;
			background-color: #F00;
			height: 30rpx;
			line-height: 30rpx;
			padding: 0 15rpx;
			border-radius: 10rpx;
			flex-shrink: 0;
		}
	}
}
.upload_file_btn {
	height: 88rpx;
	background-color: $themeColor;
	color: #FFF;
	margin-bottom: 40rpx;
}
</style>
