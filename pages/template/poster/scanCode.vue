<template>
	<view class="poster_page">
		<z-nav-bar title="海报"></z-nav-bar>
		<canvas canvas-id="poster" class="poster_canvas"></canvas>
		<swiper class="poster_swiper" previous-margin="110rpx" circular :current="swiperIndex" next-margin="110rpx" @change="onSwiperChange">
			<swiper-item v-for="(item, index) of promoteBgImgs" :key="index">
				<view class="poster_image" :class="{ active: swiperIndex == index }">
					<image class="poster_bg_image" :src="item" mode="widthFix"></image>
					<image class="poster_code_image" :src="promoteCodeImg" mode="aspectFit"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="share_save_box">
			<!-- #ifdef MP -->
			<button open-type="share">
				<image src="../../../static/demo/ic_pic.png" mode="aspectFit"></image>
				<text>发给好友</text>
			</button>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<button @click="onAppShare">
				<image src="../../../static/demo/ic_pic.png" mode="aspectFit"></image>
				<text>发给好友</text>
			</button>
			<!-- #endif -->
			<button class="onSave" @click="onSaveImg">
				<image src="../../../static/demo/ic_weixin.png" mode="aspectFit"></image>
				<text>保存图片</text>
			</button>
		</view>
		<!-- #ifdef H5 -->
		<view class="h5_press_save" v-if="h5SaveImg" @click="h5SaveImg = ''">
			<image :src="h5SaveImg" mode="widthFix"></image>
			<button class="download">长按图片保存图片</button>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
let settingWritePhotosAlbum = false;
export default {
	data() {
		return {
			promoteBgImgs: [
				"https://qn.kemean.cn/upload/202006/05/1591346203171zj5m2qkl.png",
				"https://qn.kemean.cn/upload/202006/05/1591346218311qsy0h9h7.png",
				"https://qn.kemean.cn/upload/202006/05/15913462289486a12js7d.png",
			],
			promoteCodeImg: "https://qn.kemean.cn/upload/202007/03/1593744239803mgajzyjk.png",
			swiperIndex: 0,
			posterImgs: [],
			shareInfo: {
				shareContent: "商家云系统,点击了解",
				shareImg: "http://qn.kemean.cn/upload/202004/08/15863540965488mlv1qgj.png",
				shareTitle: "商家云",
				shareUrl: "http://kemean.com/download/3jiayunbz/index.html"
			},
			h5SaveImg: ""
		};
	},
	//第一次加载
	onLoad(e) {
	},
	computed: {
		...mapState(["userInfo"])
	},
	//方法
	methods: {
		// 轮播图变化
		onSwiperChange(e) {
			this.swiperIndex = e.detail.current;
		},
		// 创建海报
		createPoster() {
			return new Promise((resolve, reject) => {
				if (this.posterImgs[this.swiperIndex]) {
					resolve(this.posterImgs[this.swiperIndex]);
				} else {
					uni.showLoading({
						title: '海报生成中'
					});
					const ctx = uni.createCanvasContext('poster');
					ctx.fillRect(0, 0, 375, 667);
					uni.downloadFile({
						url: this.promoteBgImgs[this.swiperIndex],
						success: res => {
							if (res.statusCode === 200) {
								ctx.drawImage(res.tempFilePath, 0, 0, 375, 667);
								uni.downloadFile({
									url: this.promoteCodeImg,
									success: res => {
										if (res.statusCode === 200) {
											ctx.drawImage(res.tempFilePath, 137.45, 504, 100.1, 100.1);
											ctx.draw(true, () => {
												// canvas画布转成图片并返回图片地址
												uni.canvasToTempFilePath({
													canvasId: 'poster',
													width: 375,
													height: 667,
													success: res => {
														if(this.posterImgs[this.swiperIndex]){
															this.posterImgs[this.swiperIndex].temporary = res.tempFilePath;
														}else{
															this.posterImgs[this.swiperIndex] = {};
															this.posterImgs[this.swiperIndex].temporary = res.tempFilePath;
														}
														resolve(res.tempFilePath);
														console.log(res.tempFilePath);
													},
													fail: () => {
														uni.hideLoading();
														reject();
													}
												});
											});
										} else {
											uni.hideLoading();
											uni.showToast({
												title: '海报制作失败，图片下载失败',
												icon: 'none'
											});
										}
									},
									fail: err => {
										uni.hideLoading();
										uni.showToast({
											title: '海报制作失败，图片下载失败',
											icon: 'none'
										});
									}
								});
							} else {
								uni.hideLoading();
								uni.showToast({
									title: '海报制作失败，图片下载失败',
									icon: 'none'
								});
							}
						},
						fail: err => {
							uni.hideLoading();
							uni.showToast({
								title: '海报制作失败，图片下载失败',
								icon: 'none'
							});
						}
					});
				}
			});
		},
		// 保存图片
		async onSaveImg() {
			let imgUrl = "";
			if(this.posterImgs[this.swiperIndex] && this.posterImgs[this.swiperIndex].temporary){
				imgUrl = await this.posterImgs[this.swiperIndex].temporary;
			}else{
				imgUrl = await this.createPoster();
			}
			// #ifdef H5
			this.h5SaveImg = imgUrl;
			uni.hideLoading();
			// #endif
			// #ifdef MP-WEIXIN
			uni.showLoading({
				title: '海报下载中'
			});
			if (settingWritePhotosAlbum) {
				uni.getSetting({
					success: res => {
						if (res.authSetting['scope.writePhotosAlbum']) {
							uni.saveImageToPhotosAlbum({
								filePath: imgUrl,
								success: () => {
									uni.hideLoading();
									uni.showToast({
										title: '保存成功'
									});
								}
							});
						} else {
							uni.showModal({
								title: '提示',
								content: '请先在设置页面打开“保存相册”使用权限',
								confirmText: '去设置',
								cancelText: '算了',
								success: data => {
									if (data.confirm) {
										uni.hideLoading();
										uni.openSetting();
									}
								}
							});
						}
					}
				});
			} else {
				settingWritePhotosAlbum = true;
				uni.authorize({
					scope: 'scope.writePhotosAlbum',
					success: () => {
						uni.saveImageToPhotosAlbum({
							filePath: imgUrl,
							success: () => {
								uni.hideLoading();
								uni.showToast({
									title: '保存成功'
								});
							}
						});
					}
				});
			}
			// #endif
			// #ifdef APP-PLUS
			uni.showLoading({
				title: '海报下载中'
			});
			uni.saveImageToPhotosAlbum({
				filePath: imgUrl,
				success: () => {
					uni.hideLoading();
					uni.showToast({
						title: '保存成功'
					});
				}
			});
			// #endif
		},
		async onAppShare() {
			// let imgUrl = "";
			// if(this.posterImgs[this.swiperIndex] && this.posterImgs[this.swiperIndex].url){
			// 	imgUrl = this.posterImgs[this.swiperIndex].url;
			// } else if(this.posterImgs[this.swiperIndex] && this.posterImgs[this.swiperIndex].temporary){
			// 	let imgData = await this.$http.qnFileUpload([this.posterImgs[this.swiperIndex].temporary]);
			// 	imgUrl = imgData[0];
			// }else{
			// 	let data = await this.createPoster();
			// 	let imgData = await this.$http.qnFileUpload([data]);
			// 	imgUrl = imgData[0];
			// }
			// uni.hideLoading();
			uni.share({
				provider: 'weixin',
				scene: 'WXSceneSession',
				type: 0,
				title: this.shareInfo.shareTitle,
				href: this.shareInfo.shareUrl,
				summary: this.shareInfo.shareContent,
				imageUrl: this.shareInfo.shareImg,
				success: function(res) {
					console.log('success:' + JSON.stringify(res));
				},
				fail: function(err) {
					console.log('fail:' + JSON.stringify(err));
				}
			});
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
		let shareInfo = {
			path: this.$base.share.path,
			title: this.shareInfo.shareTitle,
			imageUrl: this.shareInfo.shareImg
		};
		if(this.userInfo.token){
			if (shareInfo.path.indexOf("?") >= 0) {
				shareInfo.path += "&recommendCode=" + this.userInfo.uid;
			} else {
				shareInfo.path += "?recommendCode=" + this.userInfo.uid;
			}
		}
		return shareInfo;
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
.poster_page {
	min-height: 100vh;
	background-color: #fff;
	display: flex;
	align-items: center;
}
.poster_canvas {
	width: 750rpx;
	height: 1334rpx;
	position: fixed;
	top: -10000rpx;
	left: 0rpx;
}
.poster_swiper {
	height: 934rpx;
	width: 100%;
	swiper-item {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		.poster_image {
			width: 100%;
			height: 100%;
			transform: scale(0.88);
			transition: all 0.4s;
			position: relative;
			display: flex;
			align-items: flex-end;
			overflow: hidden;
			&.active {
				transform: scale(1);
			}
			.poster_bg_image {
				width: 100%;
				height: 100%;
			}
			.poster_code_image {
				position: absolute;
				bottom: 100rpx;
				width: 140rpx;
				height: 140rpx;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}
}
.share_save_box {
	position: fixed;
	bottom: calc((100vh - 934rpx - 240rpx) / 4);
	left: 0;
	z-index: 6;
	width: 100%;
	display: flex;
	justify-content: space-around;
	button {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: transparent;
		image {
			width: 60rpx;
			height: 60rpx;
		}
		text {
			font-size: 24rpx;
			color: #333333;
		}
	}
}
.h5_press_save {
	background-color: #000;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	z-index: 100;
	image {
		width: 100%;
	}
	.download {
		font-size: 24rpx;
		color: #ffffff;
		background-color: rgba(0,0,0,0.5);
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
		position: absolute;
		padding: 5rpx 30rpx;
		border-radius: 40rpx;
		bottom: 30rpx;
		left: 50%;
		transform: translateX(-50%);
		&:before {
			content: '';
			@include bis('../../../static/demo/icon_download.png');
			width: 24rpx;
			height: 24rpx;
			margin-right: 15rpx;
		}
	}
}
</style>
