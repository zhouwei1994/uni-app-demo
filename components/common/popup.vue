<template>
	<view @touchmove="onTouchMove">
		<!-- 遮罩层动画 -->
		<view class="mask" @click="hideOnBlur && (currentValue = false)" :style="{top:maskTop, bottom:maskBottom, zIndex: zIndex}" v-if="currentValue"></view>
		<!-- 显示信息层 -->
		<view class="popup_box" :class="{'bottom': type == 'bottom' ,'center':type == 'center', top: type == 'top'}" :style="{opacity:opacity,transform:transform,top:popupTop, bottom:popupBottom,zIndex: zIndex + 1}">
			<slot></slot>
		</view>
	</view>
</template>

<script>
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
			 console.log(this.systemInfo);
			if (typeof this.value !== "undefined") {
				this.currentValue = this.value;
				this.setAnimation(this.value);
			}
		},
		watch: {
			value(val) {
				this.currentValue = val;
				this.setAnimation(val);
			},
			currentValue(val) {
				this.$emit("change", val);
				this.$emit("input", val);
			}
		},
		data() {
			return {
				// 传进来的值
				currentValue: false,
				opacity: 0,
				popupTop: "inherit",
				popupBottom: "inherit",
				maskTop: "0rpx",
				maskBottom: "0rpx",
				transform: "",
				systemInfo: {},
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
			setAnimation(val) {
				if (this.type == "bottom") {
					if (val) {
						this.transform = "translateY(0%)";
						this.opacity = 1;
						this.popupTop = "inherit";
						if(this.offset > 0){
							this.popupBottom = this.offset + "rpx";
							this.maskBottom = this.offset + "rpx";
						} else {
							this.popupBottom = this.getPxRpx(this.systemInfo.windowBottom) + "rpx";
							this.maskBottom = "0rpx";
						}
					} else {
						this.opacity = 0;
						this.transform = "translateY(100%)";
						setTimeout(() => {
							this.popupTop = "inherit";
							this.popupBottom = "inherit";
							this.maskTop = "0rpx";
							this.maskBottom = "0rpx";
						},400);
					}
				} else if (this.type == "center") {
					if (val) {
						this.opacity = 1;
						this.transform = "translateX(-50%) translateY(-50%) scale(1)";
						this.popupTop = "50%";
					} else {
						this.opacity = 0;
						this.popupTop = "50%";
						this.transform = "translateX(-50%) translateY(-50%) scale(0)";
					}
				} else if (this.type == "top") {
					if (val) {
						this.transform = "translateY(0%)";
						this.opacity = 1;
						this.popupBottom = "inherit";
						if(this.offset > 0){
							this.popupTop = (this.offset + this.getPxRpx(this.systemInfo.statusBarHeight)) +  "rpx";
							this.maskTop = this.popupTop;
						} else {
							this.popupTop = "0rpx";
							this.maskTop = "0rpx";
						}
					} else {
						this.opacity = 0;
						this.transform = "translateY(-100%)";
						setTimeout(() => {
							this.popupTop = "inherit";
							this.popupBottom = "inherit";
							this.maskTop = "0rpx";
							this.maskBottom = "0rpx";
						},400);
					}
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	/*遮罩层*/
	.mask {
		position: fixed;
		z-index: 500;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		transition: all 0.4s;
	}

	.popup_box {
		position: fixed;
		max-width: 100%;
		max-height: 100%;
		min-height: 50upx;
		z-index: 501;
		opacity: 0;
		font-size: 28upx;
		transition: all 0.4s;

		&.bottom {
			left: 0upx;
			/* #ifdef H5 */
			bottom: var(--window-bottom);
			/* #endif */
			/* #ifndef H5 */
			bottom: 0;
			/* #endif */
			min-width: 100%;
			transform: translateY(100%);
		}

		&.center {
			left: 50%;
			top: 50%;
			transform: translateX(-50%) translateY(-50%);
		}
		&.top {
			left: 0upx;
			top: 0rpx;
			right: 0rpx;
			min-width: 100%;
			transform: translateY(100%);
		}
	}
</style>
