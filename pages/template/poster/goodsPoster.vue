<template>
	<view class="poster_page">
		<z-nav-bar title="海报"></z-nav-bar>
		<canvas canvas-id="poster" class="poster_canvas"></canvas>
		<swiper class="poster_swiper" previous-margin="110rpx" circular :current="swiperIndex" next-margin="110rpx" @change="onSwiperChange">
			<swiper-item v-for="(item, index) of dataInfo.headImgs" :key="index">
				<view class="goods_info_box" :class="{ active: swiperIndex == index }">
					<image class="goods_image" :src="item" mode="aspectFit"></image>
					<view class="goods_info">
						<view class="goods_name">{{dataInfo.goodsName}}</view>
						<view class="price_box">
							<view class="price">{{dataInfo.goodsPrice}}</view>
							<view class="store_price">{{dataInfo.priceShop}}</view>
						</view>
						<view class="poster_info">
							<view class="info">
								<view>长按识别二维码访问</view>
								<text>{{platformName}}</text>
							</view>
							<image class="poster_code_image" :src="dataInfo.recommendCodeGoods" mode="aspectFit"></image>
						</view>
					</view>
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
// 文字换行
function drawtext(text, maxWidth) {
	let textArr = text.split("");
	let len = textArr.length;
	// 上个节点
	let previousNode = 0;
	// 记录节点宽度
	let nodeWidth = 0;
	// 文本换行数组
	let rowText = [];
	// 如果是字母，侧保存长度
	let letterWidth = 0;
	// 汉字宽度
	let chineseWidth = 21;
	// otherFont宽度
	let otherWidth = 10.5;
	for (let i = 0; i < len; i++) {
		if (/[\u4e00-\u9fa5]|[\uFE30-\uFFA0]/g.test(textArr[i])) {
			if(letterWidth > 0){
				if(nodeWidth + chineseWidth + letterWidth * otherWidth > maxWidth){
					rowText.push({
						type: "text",
						content: text.substring(previousNode, i)
					});
					previousNode = i;
					nodeWidth = chineseWidth;
					letterWidth = 0;
				} else {
					nodeWidth += chineseWidth + letterWidth * otherWidth;
					letterWidth = 0;
				}
			} else {
				if(nodeWidth + chineseWidth > maxWidth){
					rowText.push({
						type: "text",
						content: text.substring(previousNode, i)
					});
					previousNode = i;
					nodeWidth = chineseWidth;
				}else{
					nodeWidth += chineseWidth;
				}
			}
		} else {
			if(/\n/g.test(textArr[i])){
				rowText.push({
					type: "break",
					content: text.substring(previousNode, i)
				});
				previousNode = i + 1;
				nodeWidth = 0;
				letterWidth = 0;
			}else if(textArr[i] == "\\" && textArr[i + 1] == "n"){
				rowText.push({
					type: "break",
					content: text.substring(previousNode, i)
				});
				previousNode = i + 2;
				nodeWidth = 0;
				letterWidth = 0;
			}else if(/[a-zA-Z0-9]/g.test(textArr[i])){
				letterWidth += 1;
				if(nodeWidth + letterWidth * otherWidth > maxWidth){
					rowText.push({
						type: "text",
						content: text.substring(previousNode, i + 1 - letterWidth)
					});
					previousNode = i + 1 - letterWidth;
					nodeWidth = letterWidth * otherWidth;
					letterWidth = 0;
				}
			} else{
				if(nodeWidth + otherWidth > maxWidth){
					rowText.push({
						type: "text",
						content: text.substring(previousNode, i)
					});
					previousNode = i;
					nodeWidth = otherWidth;
				}else{
					nodeWidth += otherWidth;
				}
			}
		}
	}
	if (previousNode < len) {
		rowText.push({
			type: "text",
			content: text.substring(previousNode, len)
		});
	}
	return rowText;
}
let settingWritePhotosAlbum = false;
export default {
	data() {
		return {
			swiperIndex: 0,
			posterImgs: [],
			dataInfo: {
				priceShop: "¥699.0",
				headImgs: [
					"http://qn.kemean.cn/file/upload/202005/21/1590043402088i2jxb79n.jpg?imageView2/0/w/800",
					"http://qn.kemean.cn/file/upload/202005/21/1590043404759qml3zmlm.jpg?imageView2/0/w/800",
					"http://qn.kemean.cn/file/upload/202005/21/1590043407501c6o63bmi.jpg?imageView2/0/w/800",
					"http://qn.kemean.cn/file/upload/202005/21/1590043410966jwbtkyw1.jpg?imageView2/0/w/800",
					"http://qn.kemean.cn/file/upload/202005/21/1590043413622bnysmgy9.jpg?imageView2/0/w/800"
				],
                goodsImg: "https://qn.kemean.cn/file/upload/202005/21/1590043402088i2jxb79n.jpg?imageView2/0/w/800",
                goodsName: "冰希黎巴黎红精粹沙龙香水50ml",
                goodsPrice: "¥699.0",
                mainLogo: "https://qn.kemean.cn//file/upload/202005/22/1590138818080cmvg4qnl.png",
                recommendCodeGoods: "https://qn.kemean.cn/upload/202007/03/9c6a38df800e46bbba6aede3d84c3427",
				share: {
					shareContent: "商家云系统,点击了解",
					shareImg: "http://qn.kemean.cn/file/upload/202005/21/1590043402088i2jxb79n.jpg?imageView2/0/w/800",
					shareTitle: "冰希黎巴黎红精粹沙龙香水50ml",
					shareUrl: "http://kemean.com/download/3jiayunbz/index.htmlpages/mall/shopPage/goodsDetail?objId=18111505&recommendCode=32029043"
				}
			},
			platformName: "",
			h5SaveImg: ""
		};
	},
	//第一次加载
	onLoad(e) {
		this.platformName = this.$base.platformName;
		if (e.objId) {
			this.objId = e.objId;
		}
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
				uni.showLoading({
					title: '海报生成中'
				});
				const ctx = uni.createCanvasContext('poster');
				ctx.fillRect(0, 0, 375, 673);
				ctx.setFillStyle("#FFF");
				ctx.fillRect(0, 0, 375, 673);
				uni.downloadFile({
					url: this.dataInfo.headImgs[this.swiperIndex],
					success: (res) => {
						if (res.statusCode === 200) {
							ctx.drawImage(res.tempFilePath, 0, 0, 375, 375);
							uni.downloadFile({
								url: this.dataInfo.recommendCodeGoods,
								success: (res2) => {
									if (res.statusCode === 200) {
										// 商品标题
										ctx.setFontSize(21);
										ctx.setFillStyle('#333');
										let drawtextList = drawtext(this.dataInfo.goodsName, 341);
										let textTop = 0;
										drawtextList.forEach((item,index) => {
											if(index < 2){
												textTop = 380 + (index + 1) * 28;
												ctx.fillText(item.content, 17, textTop);
											}
										});
										// 商品价格
										ctx.setFontSize(26);
										ctx.setFillStyle('#f00');
										ctx.fillText(this.dataInfo.goodsPrice, 17, textTop + 47);
										// 商品门市价
										ctx.setFontSize(18);
										ctx.setFillStyle('#999');
										let textLeft = 38 + (this.dataInfo.goodsPrice.length * 13)
										ctx.fillText(this.dataInfo.priceShop, textLeft, textTop + 45);
										// 商品门市价横线
										ctx.beginPath();
										ctx.setLineWidth(1);
										ctx.moveTo(textLeft - 1, textTop + 38);
										ctx.lineTo((textLeft + 5 + this.dataInfo.priceShop.length * 9), textTop + 38);
										ctx.setStrokeStyle('#999');
										ctx.stroke();
										// 商品分割线
										ctx.beginPath();
										ctx.setLineWidth(1);
										ctx.moveTo(17, textTop + 70);
										ctx.lineTo(358, textTop + 70);
										ctx.setStrokeStyle('#eee');
										ctx.stroke();
										// 长按识别二维码访问
										ctx.setFontSize(19);
										ctx.setFillStyle('#333');
										ctx.fillText("长按识别二维码访问", 17, textTop + 136);
										// 平台名称
										ctx.setFontSize(16);
										ctx.setFillStyle('#999');
										ctx.fillText(this.platformName, 17, textTop + 170);
										// 二维码
										ctx.drawImage(res2.tempFilePath, 238, textTop + 88, 120, 120);
										ctx.draw(true, () => {
											// canvas画布转成图片并返回图片地址
											uni.canvasToTempFilePath({
												canvasId: 'poster',
												width: 375,
												height: 673,
												success: (res) => {
													if(this.posterImgs[this.swiperIndex]){
														this.posterImgs[this.swiperIndex].temporary = res.tempFilePath;
													}else{
														this.posterImgs[this.swiperIndex] = {
															temporary: res.tempFilePath
														};
													}
													console.log("海报制作成功！");
													resolve(res.tempFilePath);
												},
												fail: () => {
													uni.hideLoading();
													reject();
												}
											})
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
				title: this.dataInfo.share.shareTitle,
				href: this.dataInfo.share.shareUrl,
				summary: this.dataInfo.share.shareContent,
				imageUrl: this.dataInfo.share.shareImg,
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
		let dataInfo = this.dataInfo;
		let shareInfo = {
			path: "/pages/home/shop/goodsDetail?objId="+dataInfo.objId,
			title: dataInfo.share.shareTitle,
			imageUrl: dataInfo.share.shareImg
		};
		if(this.userInfo.token){
			shareInfo.path += "&recommendCode=" + this.userInfo.uid;
		}
		return shareInfo;
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
.poster_page {
	min-height: 100vh;
	background-color: #f5f5f5;
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
	height: 950rpx;
	width: 100%;
	swiper-item {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		.goods_info_box {
			width: 100%;
			height: 100%;
			transform: scale(0.88);
			transition: all 0.4s;
			position: relative;
			overflow: hidden;
			background-color: #FFFFFF;
			&.active {
				transform: scale(1);
			}
			.goods_image {
				width: 100%;
				height: calc(100vw - 220rpx);
			}
			.goods_info {
				padding: 24rpx;
				.goods_name {
					color: #333;
					font-size: 30rpx;
					@include bov(2);
				}
				.price_box {
					margin-top: 24rpx;
					display: flex;
					align-items: center;
					.price {
						font-size: 38rpx;
						color: red;
					}
					.store_price {
						margin-left: 30rpx;
						font-size: 26rpx;
						color: #999;
						text-decoration: line-through;
					}
				}
				.poster_info {
					border-top: 2rpx solid #f1f1f1;
					padding-top: 24rpx;
					margin-top: 24rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.info {
						display: flex;
						flex-direction: column;
						view {
							color: #333;
							font-size: 28rpx;
						}
						text {
							color: #999;
							font-size: 24rpx;
							margin-top: 20rpx;
						}
					}
					.poster_code_image {
						width: 170rpx;
						height: 170rpx;
						flex-shrink: 0;
					}
				}
			}
		}
	}
}
.share_save_box {
	position: fixed;
	bottom: calc((100vh - 950rpx - 240rpx) / 4);
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
