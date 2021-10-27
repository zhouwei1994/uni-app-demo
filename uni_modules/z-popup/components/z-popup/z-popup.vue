<template>
	<view class="popup_view" :style="{top:popupTop, bottom: popupBottom, zIndex: zIndex}"
		:class="{'popup_view_bottom': type == 'bottom' ,'popup_view_center':type == 'center', 'popup_view_top': type == 'top'}"
	 @touchmove="onTouchMove" v-if="currentValue">
		<!-- 遮罩层动画 -->
		<view class="popup_mask" @click="hideOnBlur && setAnimationHide()"></view>
		<!-- 显示信息层 -->
		<view class="popup_container" ref="popupContainer" :class="{'popup_container_bottom': type == 'bottom' ,'popup_container_center':type == 'center', 'popup_container_top': type == 'top'}" :style="{opacity: opacity, transform: transform}">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const animation = weex.requireModule('animation');
	const dom = weex.requireModule('dom');
	// #endif
	export default {
		props: {
			//是否显示
			value: {
				type: Boolean,
				default: function() {
					return false;
				}
			},
			//点击遮罩层关闭弹窗
			hideOnBlur: {
				type: Boolean,
				default: function() {
					return true;
				}
			},
			//禁止页面滚动（H5生效）
			scroll: {
				type: Boolean,
				default: true
			},
			// 类型
			//  bottom 靠下
			//  center 居中
			//  top 靠上
			type: {
				type: String,
				default: function() {
					return "bottom";
				}
			},
			// 偏移
			offset: {
				type: Number,
				default: function() {
					return 0;
				}
			},
			// index
			zIndex: {
				type: Number,
				default: function() {
					return 500;
				}
			},
		},
		created() {
			this.systemInfo = uni.getSystemInfoSync();
			if (typeof this.value !== "undefined") {
				if(this.value){
					this.setAnimationShow();
				}
			}
		},
		watch: {
			value(val) {
				if(val){
					this.setAnimationShow();
				} else {
					this.setAnimationHide();
				}
			}
		},
		data() {
			return {
				// 传进来的值
				currentValue: false,
				opacity: 0,
				popupTop: "inherit",
				popupBottom: "inherit",
				transform: "",
				systemInfo: {},
				timer: null
			};
		},
		methods: {
			onTouchMove: function(event) {
				!this.scroll && event.preventDefault();
			},
			getPxRpx(px){
				let ratio = 750 / this.systemInfo.screenWidth;
				return ratio * px;
			},
			setAnimationShow() {
				this.currentValue = true;
				this.$nextTick(() => {
						this.timer && clearTimeout(this.timer);
						this.$emit("input", true);
						this.$emit("change", true);
						if (this.type == "bottom") {
							this.popupTop = "0rpx";
							if(this.offset > 0){
								this.popupBottom = this.offset + "rpx";
							} else {
								this.popupBottom = this.getPxRpx(this.systemInfo.windowBottom) + "rpx";
							}
							this.animationParsing({
								translateY: 0,
								defaulTranslateY: 1,
								opacity: 1
							});
						} else if (this.type == "center") {
							this.popupTop = "0rpx";
							this.popupBottom = "0rpx";
							this.animationParsing({
								scale: 1,
								defaulScale: 0,
								opacity: 1
							});
						} else if (this.type == "top") {
							this.popupBottom = "0rpx";
							if(this.offset > 0){
								this.popupTop = (this.offset + this.getPxRpx(this.systemInfo.statusBarHeight)) +  "rpx";
								this.maskTop = this.popupTop;
							} else {
								this.popupTop = "0rpx";
								this.maskTop = "0rpx";
							}
							this.animationParsing({
								defaulTranslateY: -1,
								translateY: 0,
								opacity: 1
							});
						}
					});
				
			},
			setAnimationHide() {
				this.timer && clearTimeout(this.timer);
				if (this.type == "bottom") {
					this.animationParsing({
						defaulTranslateY: 0,
						translateY: 1,
						opacity: 0
					});
					// this.popupTop = "inherit";
					// this.popupBottom = "0rpx";
				} else if (this.type == "center") {
					// this.popupTop = "0rpx";
					// this.popupBottom = "0rpx";
					this.animationParsing({
						scale: 0,
						defaulScale: 1,
						opacity: 0
					});
				} else if (this.type == "top") {
					this.animationParsing({
						defaulTranslateY: 0,
						translateY: -1,
						opacity: 0
					});
					// this.popupTop = "0rpx";
					// this.popupBottom = "inherit";
				}
				this.timer = setTimeout(() => {
					this.currentValue = false;
					this.$emit("input", false);
					this.$emit("change", false);
				}, 300);
			},
			animationParsing(data){
				// #ifndef APP-NVUE
				setTimeout(() => {
					let transform = "";
					if(data.hasOwnProperty("translateX")){
						transform += " translateX("+ (data.translateX * 100) +"%)"
					}
					if(data.hasOwnProperty("translateY")){
						transform += " translateY("+ (data.translateY * 100) +"%)"
					}
					if(data.hasOwnProperty("scale")){
						transform += " scale("+ data.scale +")"
					}
					this.opacity = data.opacity;
					this.transform = transform;
				},10);
				// #endif
				// #ifdef APP-NVUE
				let popupContainer = this.$refs.popupContainer;
				if(popupContainer){
					// if(data.hasOwnProperty("defaulTranslateY") || data.hasOwnProperty("defaulScale")){
					// 	let defaulTransform = "";
					// 	if(data.hasOwnProperty("defaulTranslateY")){
					// 		defaulTransform = "translateY(" + (data.defaulTranslateY * 100) + "%)";
					// 	}
					// 	if(data.hasOwnProperty("defaulScale")){
					// 		defaulTransform = "scale(" + data.defaulScale + ")";
					// 	}
					// 	this.transform = defaulTransform;
					// }
					if(Array.isArray(popupContainer)){
						popupContainer = popupContainer[0];
					}
					let transform = "";
					if(data.hasOwnProperty("translateX") || data.hasOwnProperty("translateY")){
						transform += " translate("+ (data.translateX ? data.translateX * 100 : 0) +"%, " + (data.translateY ? data.translateY * 100 : 0) + "%)";
					}
					if(data.hasOwnProperty("scale")){
						transform += " scale("+ data.scale +")"
					}
					animation.transition(popupContainer, {
					  styles: {  
						transform: transform, 
						transformOrigin: 'center center',
						opacity: data.opacity,
					  },
					  duration: 300, //ms  
					  timingFunction: 'ease',  
					  delay: 0 //ms  
					}, function () { });
				}
				// #endif
			},
		}
	};
</script>

<style lang="scss" scoped>
	.popup_view {
		position: fixed;
		z-index: 500;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}
	.popup_view_bottom {
		align-items: flex-end;
		justify-content: center;
	}
	.popup_view_top {
		align-items: flex-start;
		justify-content: center;
	}
	.popup_view_center {
		align-items: center;
		justify-content: center;
	}
	/*遮罩层*/
	.popup_mask {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
	}
	.popup_container {
		/* #ifndef APP-NVUE */
		max-width: 100vw;
		max-height: 100vh;
		min-height: 50rpx;
		transition: all 0.4s;
		z-index: 2;
		/* #endif */
		z-index: 501;
		opacity: 0;
		font-size: 28rpx;
		position: relative;
	}
	.popup_container_bottom {
		transform: translateY(100%);
		width: 750rpx;
	}
	.popup_container_center {
	}
	.popup_container_top {
		transform: translateY(-100%);
		width: 750rpx;
	}
</style>
