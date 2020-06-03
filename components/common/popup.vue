<template>
	<view @touchmove="onTouchMove">
		<!-- 遮罩层动画 -->
		<view class="mask" @click="hideOnBlur && (currentValue = false)" v-if="currentValue"></view>
		<!-- 显示信息层 -->
		<view class="popup_box" :class="{'bottom': type == 1000 ,'center':type == 2000}" :style="{opacity:opacity,transform:transform}">
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
			//  1000 靠下
			//  2000 居中
			type: {
				type: String,
				default: function() {
					return "1000";
				}
			}
		},
		created() {
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
				transform: ""
			};
		},
		methods: {
			onTouchMove: function(event) {
				!this.scroll && event.preventDefault();
			},
			setAnimation(val) {
				if (this.type == 1000) {
					if (val) {
						this.transform = "translateY(0%)";
						this.opacity = 1;
					} else {
						this.opacity = 0;
						this.transform = "translateY(100%)";
					}
				} else if (this.type == 2000) {
					if (val) {
						this.opacity = 1;
						this.transform = "translateX(-50%) translateY(-50%) scale(1)";
					} else {
						this.opacity = 0;
						this.transform = "translateX(-50%) translateY(-50%) scale(0)";
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
	}
</style>
