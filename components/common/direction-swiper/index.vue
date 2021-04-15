<template>
	<view class="direction_swiper" ref="directionSwiper" @touchstart="onSwiperTouchstart" @touchmove="onSwiperTouchmove" @touchcancel="onSwiperTouchcancel" @touchend="onSwiperTouchend">
		<view class="swiper_content_box" ref="swiperContent" :style="{width: (screenWidth * tabData.length) + 'px',  height: screenHeight + 'px' ,transform: 'translateX(' + translateX + 'px)', transition: 'transform ' + animationTime + 'ms ease'}">
			<view class="swiper_container" v-for="(item,index) of tabData" :key="index" :ref="'swiperContainer' + item.key" :style="{ width:  screenWidth + 'px', height: (screenHeight * (item.list.length || 1)) + 'px', transform: 'translateY(' + swiperData[index].translateY + 'px)', transition: 'transform ' + animationTime + 'ms ease'}">
				<view v-if="item.list && item.list.length > 0" :style="{ width:  screenWidth + 'px', height: (screenHeight * (item.list.length || 1)) + 'px'}">
					<view v-for="(childItem,childIndex) of item.list" :key="childIndex" class="swiper_item " v-if="Math.abs(swiperData[swiperIndex].swiperItemIndex - childIndex) < 3" :style="{ top: (childIndex * screenHeight) + 'px', width:  screenWidth + 'px', height: screenHeight + 'px' }">
						<slot :item="item" :childItem="childItem" :index="index" :childIndex="childIndex"></slot>
					</view>
				</view>
				<view class="swiper_empty" v-else :style="{ width:  screenWidth + 'px', height: screenHeight + 'px' }">
					<image class="swiper_empty_image" src="http://qn.kemean.cn/upload/202104/12/1618198729835lgteuvym.png" mode="aspectFit"></image>
					<text class="swiper_empty_text">{{ item.emptyText || '暂无数据' }}</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
    let clearTime = null;
    let lastTime = 0;
	// #ifdef APP-NVUE
	const animation = weex.requireModule('animation');
	const dom = weex.requireModule('dom');
	// #endif
    export default {
		props: {
			list: {
				type: Array,
				default () {
					return []
				}
			},
			current: {
				type: Number,
				default () {
					return 0
				}
			},
		},
        data() {
            return {
                //开始触摸时间
                startTime: 0,
                //开始触摸距离
                touchStartY: 0,
                touchStartX: 0,
				//上次的位置
				currentY: 0,
				currentX: 0,
				contentTranslateX: 0,
				tabData: [],
				swiperData: [],
				animationTime: 0,
				animationDirection: "Y",
				screenHeight: 0,
				screenWidth: 0,
				// 是否允许滑动
				canSlide: true,
				// 手指数量
				fingersNumber: 0,
				swiperIndex: 0,
				translateX: 0,
            };
        },
        //第一次加载
		created() {
			let systemInfo = uni.getSystemInfoSync();
			this.screenWidth = systemInfo.screenWidth;
			this.screenHeight = systemInfo.screenHeight;
			this.$nextTick(() => {
				this.getContainerWidthHeight();
			});
			let swiperData = [];
			if(this.list && this.list.length > 0){
				this.list.forEach(item => {
					if(item.key && item.list){
						let objectData = Object.assign({
							list: [],
						}, item);
						this.tabData.push(objectData);
						swiperData.push({
							//滑动距离
							translateY: 0,
							swiperItemIndex: 0,
							length: item.list.length || 0,
							key: item.key
						});
					} else {
						uni.showToast({
							title: "参数没有key或list",
							icon: "none"
						});
					}
				});
			}
			this.swiperData = swiperData;
		},
		watch: {
			list(val){
				let tabData = [];
				if(val && val.length > 0){
					val.forEach((item,index) => {
						if(item.key){
							tabData.push(item);
							this.swiperData[index].length = item.list.length || 0;
						} else {
							uni.showToast({
								title: "【list】参数没有key",
								icon: "none"
							});
						}
					});
				}
				this.tabData = tabData;
				this.$forceUpdate();
			},
			current(val){
				this.onType(val);
			}
		},
        //方法
        methods: {
			// 获取内容的高度
			getContainerWidthHeight(){
				// #ifdef APP-NVUE
				dom.getComponentRect(this.$refs['directionSwiper'], (data) => {
					this.screenWidth = data.size.width;
					this.screenHeight = data.size.height;
				});
				// #endif
				// #ifndef APP-NVUE
				uni.createSelectorQuery().in(this).selectAll('.direction_swiper')
					.boundingClientRect(data => {
						this.screenWidth = data[0].width;
						this.screenHeight = data[0].height;
					}).exec()
				// #endif
			},
			onType(index){
				this.swiperIndex = index;
				this.onChangeY();
				this.contentTranslateX = -(index * this.screenWidth);
				// #ifdef APP-NVUE
				let swiperContent = this.$refs.swiperContent;
				if(swiperContent){
					if(Array.isArray(swiperContent)){
						swiperContent = swiperContent[0];
					}
					animation.transition(this.$refs.swiperContent, {
					  styles: {  
						transform: 'translate('+ this.contentTranslateX +'px, 0px)',  
						transformOrigin: 'center center'  
					  },  
					  duration: 360, //ms  
					  timingFunction: 'ease',  
					  delay: 0 //ms  
					}, function () {
					});
				}
				// #endif
				// #ifndef APP-NVUE
				this.translateX = this.contentTranslateX;
				this.animationTime = 360;
				// #endif
			},
            onChangeY() {
				this.$emit("changeY", {
					...this.tabData[this.swiperIndex],
					...this.swiperData[this.swiperIndex],
				});
            },
			setAnimationY(translateY, animationTime, indexChange){
				this.animationTime = animationTime;
				let swiperItem = this.swiperData[this.swiperIndex];
				swiperItem.translateY = translateY;
				if(indexChange){
					if(indexChange == "less" && swiperItem.swiperItemIndex > 0){
						swiperItem.swiperItemIndex -= 1;
					} else if(indexChange == "plus" && swiperItem.swiperItemIndex < swiperItem.length - 1){
						swiperItem.swiperItemIndex += 1;
					}
				}
				this.$set(this.swiperData, this.swiperIndex, swiperItem);
				// #ifdef APP-NVUE
				let swiperContainer = this.$refs['swiperContainer' + swiperItem.key];
				if(swiperContainer){
					if(Array.isArray(swiperContainer)){
						swiperContainer = swiperContainer[0];
					}
					animation.transition(swiperContainer, {
					  styles: {  
						transform: 'translate(0px, ' + translateY + 'px)', 
						transformOrigin: 'center center'
					  },
					  duration: animationTime, //ms  
					  timingFunction: 'ease',  
					  delay: 0 //ms  
					}, function () { });
				}
				// #endif
				setTimeout(() => {
				    this.canSlide = true;
				}, animationTime);
			},
			setAnimationX(translateX, animationTime, indexChange){
				if(indexChange){
					if(indexChange == "less" && this.swiperIndex > 0){
						this.swiperIndex -= 1;
						this.contentTranslateX = translateX;
						this.$emit("changeX", {
							swiperIndex: this.swiperIndex,
							...this.swiperData[this.swiperIndex]
						});
						this.onChangeY();
					} else if(indexChange == "plus" && this.swiperIndex < this.swiperData.length - 1){
						this.swiperIndex += 1;
						this.contentTranslateX = translateX;
						this.$emit("changeX", {
							swiperIndex: this.swiperIndex,
							...this.swiperData[this.swiperIndex]
						});
						this.onChangeY();
					}
				}
				// #ifdef APP-NVUE
				let swiperContent = this.$refs.swiperContent;
				if(swiperContent){
					if(Array.isArray(swiperContent)){
						swiperContent = swiperContent[0];
					}
					animation.transition(swiperContent, {
					  styles: {  
						transform: 'translate('+ translateX +'px, 0px)',  
						transformOrigin: 'center center'  
					  },  
					  duration: animationTime, //ms  
					  timingFunction: 'ease',  
					  delay: 0 //ms  
					}, function () {
					});
				}
				// #endif
				// #ifndef APP-NVUE
				this.translateX = translateX;
				this.animationTime = animationTime;
				// #endif
				setTimeout(() => {
				    this.canSlide = true;
				},animationTime);
			},
            // 手指触摸动作开始
            onSwiperTouchstart(e) {
				this.fingersNumber += 1;
                if(this.canSlide && this.fingersNumber == 1){
                    //储存手指触摸坐标，当前时间戳，当前坐标
                    // #ifdef APP-NVUE
                    this.touchStartY = e.changedTouches[0].screenY;
					this.touchStartX = e.changedTouches[0].screenX;
                    // #endif
                    // #ifndef APP-NVUE
                    this.touchStartY = e.changedTouches[0].clientY;
					this.touchStartX = e.changedTouches[0].clientX;
                    // #endif
                    let startTime = new Date().getTime();
                    this.startTime = startTime;
                    lastTime = startTime;
					if(this.swiperData[this.swiperIndex]){
						this.currentY = this.swiperData[this.swiperIndex].translateY;
					} else {
						this.currentY = 0;
					}
					this.currentX = this.contentTranslateX;
					this.animationDirection = "";
                }
            },
            // 手指触摸后移动
            onSwiperTouchmove(e) {
                if(this.canSlide && this.fingersNumber == 1){
                    //手指当前坐标
                    // #ifdef APP-NVUE
                    const clientY = e.changedTouches[0].screenY;
					const clientX = e.changedTouches[0].screenX;
                    // #endif
                    // #ifndef APP-NVUE
                    const clientY = e.changedTouches[0].clientY;
					const clientX = e.changedTouches[0].clientX;
                    // #endif
                    //计算滑动距离
                    const differenceY = this.touchStartY - clientY;
                    const differenceX = this.touchStartX - clientX;
                    let currentTime = new Date().getTime();
                    if(Math.abs(differenceY) > Math.abs(differenceX)){
						let item = this.swiperData[this.swiperIndex];
						//判断最终滑动方向Y轴
						if (differenceY < 0) {
							if(item.swiperItemIndex > 0){
								this.animationDirection = "Y";
								this.setAnimationY(this.currentY + Math.abs(differenceY), 0);
							}
						} else {
							if(item.swiperItemIndex < (item.length - 1)){
								this.animationDirection = "Y";
								this.setAnimationY(this.currentY - differenceY, 0);
							}
						}
					} else {
						//判断最终滑动方向X轴
						if (differenceX < 0) {
							if(this.swiperIndex > 0){ 
								this.animationDirection = "X";
								this.setAnimationX(this.currentX + Math.abs(differenceX), 0);
							}
						} else {
							if(this.swiperIndex < this.swiperData.length - 1){ 
								this.animationDirection = "X";
								this.setAnimationX(this.currentX - Math.abs(differenceX), 0);
							}
						}
					}
                    lastTime = currentTime;
                }
            },
            // 手指触摸动作被打断，如来电提醒，弹窗
            onSwiperTouchcancel(e) {
                // #ifdef APP-NVUE
                this.finallySlide(e.changedTouches[0].screenX, e.changedTouches[0].screenY);
                // #endif
                // #ifndef APP-NVUE
                this.finallySlide(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                // #endif
				this.fingersNumber = 0;
            },
            // 手指触摸动作结束
            onSwiperTouchend(e) {
                // #ifdef APP-NVUE
                this.finallySlide(e.changedTouches[0].screenX, e.changedTouches[0].screenY);
                // #endif
                // #ifndef APP-NVUE
                this.finallySlide(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                // #endif
				this.fingersNumber -= 1;
            },
            //最终判断滑动
            finallySlide(finallyX, finallyY) {
                if(this.canSlide && this.fingersNumber == 1){
                    //手指离开的时间
                    const endTime = new Date().getTime();
                    //手机滑动屏幕的总花费时间
                    const timeDifference = endTime - this.startTime;
					this.canSlide = false;
					//手指触摸总滑动距离
					const distanceDifferenceY = this.touchStartY - finallyY;
					if(this.animationDirection == "X"){
						const distanceDifferenceX = this.touchStartX - finallyX;
						//判断是否滑动到左边  滑动距离超过3分之一 或者 滑动时间在300毫秒并且距离在4分之一
						if (Math.abs(distanceDifferenceX) > this.screenWidth / 3 || timeDifference < 500 && Math.abs(distanceDifferenceX) > (this.screenWidth / 5)) {
							//判断最终滑动方向
						    let animationTime = 360;
							if(timeDifference > 400 && timeDifference > 200){
								animationTime = timeDifference;
							}
						    if (distanceDifferenceX < 0) {
								this.setAnimationX(0, animationTime, "less");
						    } else {
								this.setAnimationX(-this.screenWidth, animationTime, "plus");
						    }
						} else {
							this.setAnimationX(this.currentX, 360);
						}
					} else if(this.animationDirection == "Y"){
						//判断是否滑动到左边  滑动距离超过3分之一 或者 滑动时间在300毫秒并且距离在4分之一
						if (Math.abs(distanceDifferenceY) > this.screenHeight / 5 || timeDifference < 500 && Math.abs(distanceDifferenceY) > (this.screenHeight / 10)) {
							//判断最终滑动方向
							let animationTime = 360;
							if(timeDifference < 500 && timeDifference > 200){
								animationTime = timeDifference;
							}
							if(Math.abs(distanceDifferenceY) < this.screenHeight){
								let remainingRatio = (this.screenHeight - Math.abs(distanceDifferenceY)) / this.screenHeight;
								animationTime = animationTime * remainingRatio;
								if(animationTime < 150){
									animationTime = 150;
								}
							}
							if (distanceDifferenceY < 0) {
								this.setAnimationY(this.currentY + this.screenHeight, animationTime, "less");
							} else {
								this.setAnimationY(this.currentY - this.screenHeight, animationTime, "plus");
							}
							this.onChangeY();
						} else {
							let animationTime = 360;
							let remainingRatio = Math.abs(distanceDifferenceY) / this.screenHeight;
							animationTime = animationTime * remainingRatio;
							if(animationTime < 150){
								animationTime = 150;
							}
							this.setAnimationY(this.currentY, animationTime);
						}
					} else {
						this.canSlide = true;
					}
                }
            },
        }
    };
</script>
<style lang="scss" scoped>
    @import '@/style/mixin.scss';
    .direction_swiper {
        width: 750rpx;
		overflow: hidden;
    }
	.swiper_content_box {
		flex-direction: row;
	}
	.swiper_container {
		position: relative;
	}
    .swiper_item {
		width: 750rpx;
        position: absolute;
        top: 1504rpx;
        left: 0rpx;
    }
	.swiper_empty {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 750rpx;
		position: absolute;
		top: 0rpx;
		left: 0rpx;
	}
	.swiper_empty_image {
		width: 360rpx;
		height: 360rpx;
	}
	.swiper_empty_text {
		font-size: 28rpx;
		color: #FFF;
	}
</style>
