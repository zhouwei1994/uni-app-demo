<template>
	<view class="flow-box" :style="'height: ' + loadingTop + 'rpx'" ref="flow_box">
		<view v-for="(item, index) in newList" :key="item.objId" class="item good_item" :class="positionList[item.objId].right ? 'right' : 'left'" v-show="positionList[item.objId].imageLoad" :style="{top: positionList[item.objId].top + 'rpx'}"
		  @click="onPageJump(item)">
			<view class="goods_img">
				<image :data-id="item.objId" @load="onImageLoad" :src="item.img" mode="widthFix"></image>
			</view>
			<view class="title">
				<view v-for="(childItem,childIndex) of positionList[item.objId].titleList" :key="childIndex">{{childItem.content}}</view>
			</view>
			<view class="sell_well">
				<text>热销</text>
			</view>
			<view class="info">
				<text class="money"><text>{{ item.priceDiscount }}</text></text>
				<text class="count">{{ item.numSales || 0 }}人购买</text>
			</view>
		</view>
	</view>
</template>

<script>
	const defaultData = {
		// 起始距离（rpx）
		startTop: 20,
		// 除了图片和标题以外的高度（rpx）
		contentHeight: 40 + 32 + 20 + 30 + 60,
		// 瀑布流容器宽度（rpx）
		viewWidth: 344,
		// 标题可显示宽度（rpx）
		titleWidth: 300,
		// 标题文字大小（rpx）
		titleSize: 28,
		// 容器之间的间隔Y轴（rpx）
		viewSpace: 20,
		// 列表ID参数名称
		idName: "objId",
		// 列表标题参数名称
		titleName: "name",
	};
	
	// 文字换行计算行数
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
		let chineseWidth = defaultData.titleSize + 2;
		// otherFont宽度
		let otherWidth = (defaultData.titleSize + 2) / 2;
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
	let allow = true;
	export default {
		props: {
			// 数据列表
			list: {
				type: Array,
				default () {
					return [];
				}
			}
		},
		data() {
			return {
				newList: [],
				positionList: {},
				loadingTop: 0,
				leftHistoryTop: 0,
				rightHistoryTop: 0
			};
		},
		watch: {
			// 数据
			list: function(newVal, oldVal) {
				this.newList = newVal;
				this.getCalculationPosition();
			}
		},
		methods: {
			onPageJump(item) {
				uni.navigateTo({
					url: "/pages/home/shop/goodsDetail?objId=" + item.objId
				})
			},
			refreshData() {},
			// 节流
			throttle(callback,time = 400){
			    if(!allow) return false;
			    allow = false;
			    setTimeout(function(){
			        allow = true;
			        callback();
			    },time);
			},
			// 获取数据位置信息 top,right
			getCalculationPosition(){
				let leftHistoryTop = defaultData.startTop;
				let rightHistoryTop = defaultData.startTop;
				let positionList = this.positionList;
				this.newList.forEach((item,index) => {
					let currentHeight =  defaultData.contentHeight;
					let positionItem  = {};
					// 查看是否有位置数据
					if(positionList[item[defaultData.idName]]){
						positionItem = positionList[item[defaultData.idName]];
					}else {
						positionList[item[defaultData.idName]] = {};
					}
					// 查看是否有图片高度数据，没有默认等宽
					if(positionItem.imageHeight){
						currentHeight += positionItem.imageHeight;
						positionList[item[defaultData.idName]].imageLoad = true;
					}else{
						currentHeight += defaultData.viewWidth;
					}
					// 查看是否有标题高度数据，没有获取高度
					if(positionItem.titleHeight){
						currentHeight += positionItem.titleHeight;
					}else{
						let titleList = drawtext(item[defaultData.titleName], defaultData.titleWidth);
						let titleListLen = titleList.length;
						positionList[item[defaultData.idName]].titleList = titleList;
						positionList[item[defaultData.idName]].titleHeight = titleListLen * (defaultData.titleSize + 6);
						currentHeight += titleListLen * (defaultData.titleSize + 6);
					}
					if(leftHistoryTop > rightHistoryTop){
						positionList[item[defaultData.idName]].top = rightHistoryTop;
						positionList[item[defaultData.idName]].right = true;
						positionList[item[defaultData.idName]].height = currentHeight;
						rightHistoryTop += currentHeight + defaultData.viewSpace;
					}else{
						positionList[item[defaultData.idName]].top = leftHistoryTop;
						positionList[item[defaultData.idName]].right = false;
						positionList[item[defaultData.idName]].height = currentHeight;
						leftHistoryTop += currentHeight + defaultData.viewSpace;
					}
				});
				if(leftHistoryTop > rightHistoryTop){
					this.loadingTop = leftHistoryTop;
				}else{
					this.loadingTop = rightHistoryTop;
				}
				this.positionList = positionList;
				this.$forceUpdate();
			},
			// 图片加载完成
			onImageLoad(e){
				let id = e.currentTarget.dataset.id;
				let scale = defaultData.viewWidth / e.detail.width;
				let height = scale * e.detail.height;
				if(this.positionList[id]){
					this.positionList[id].imageHeight = height;
				}else{
					this.positionList[id] = {
						imageHeight: height
					}
				}
				// 图片加载完刷新位置节流一下，提升性能
				this.throttle(() => {
					this.getCalculationPosition();
				}, 100);
			}
		}
	};
</script>

<style scoped lang="scss">
	@import '@/style/mixin.scss';

	.flow-box {
		position: relative;
		color: #1a1a1a;
		padding: 0 20rpx 0rpx 20rpx;
		box-sizing: content-box;
	}

	.flow-box .left {
		left: 20rpx;
	}

	.flow-box .right {
		right: 20rpx;
	}

	.flow-box .good_item {
		position: absolute;
		width: 345rpx;
		border: 2rpx solid #f9f9f9;
		background: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		margin-bottom: 20rpx;

		&.noMargin {
			margin-right: 0;
		}

		.goods_img {
			image {
				width: 100%;
			}
		}

		.title {
			margin: 20rpx 20rpx;
			color: #333333;
			font-size: 28rpx;
		}

		.sell_well {
			display: flex;
			padding: 0rpx 20rpx 20rpx 20rpx;

			text {
				height: 32rpx;
				border-radius: 4rpx;
				border: solid 2rpx $themeColor;
				line-height: 28rpx;
				padding: 0 15rpx;
				font-size: 24rpx;
				color: $themeColor;
			}
		}

		.info {
			width: 100%;
			padding: 0rpx 20rpx 30rpx 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.money {
				font-size: 26rpx;
				color: #ff3d3d;
				display: flex;
				align-items: center;

				text {
					font-size: 36rpx;
				}
			}

			.count {
				font-size: 24rpx;
				color: #999;
			}
		}
	}
</style>
