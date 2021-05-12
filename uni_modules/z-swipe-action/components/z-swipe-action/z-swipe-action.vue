<template>
	<view class="swipe_action_box" @touchstart="onTouchstart" @touchmove="onTouchmove" @touchcancel="onTouchcancel" @touchend="onTouchend">
		<view class="swipe_action_item" :style="{ width: (screenWidth + maxWidth) + 'px', transform: 'translateX(' + translateX + 'px)', transition: 'transform ' + animationTime + 'ms cubic-bezier(.165, .84, .44, 1)'  }">
			<view class="swipe_action_content"><slot></slot></view>
			<view class="swipe_action_btn_box" ref="swipeActionBtnBox">
				<view v-for="(item,index) of optionsList" :key="index" class="swipe_action_btn" :style="{
				  backgroundColor: item.style && item.style.backgroundColor ? item.style.backgroundColor : '#C7C6CD'
				}" @click.stop="onBtn(index,item)">
				<text :style="{
				  fontSize: item.style && item.style.fontSize ? item.style.fontSize : '14px',
				  color: item.style && item.style.color ? item.style.color : '#FFFFFF'
				}">{{ item.text }}</text>
			</view>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef APP-NVUE
const dom = weex.requireModule('dom');
// #endif
export default {
	props: {
		/**
		 * 按钮内容
		 */
		options: {
			type: Array,
			default () {
				return []
			}
		},
		/**
		 * 禁用
		 */
		disabled: {
			type: Boolean,
			default: false
		},
		/**
		 * 变量控制开关
		 */
		show: {
			type: Boolean,
			default: false
		},
		/**
		 * 是否自动关闭
		 */
		autoClose: {
			type: Boolean,
			default: true
		},
		/**
		 * swipe-action 的索引值
		 */
		index: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			//开始触摸时间
			startTime: 0,
			//开始触摸距离
			touchStartX: 0,
			//最大距离
			maxWidth: 58,
			//滑动距离
			translateX: 0,
			animationTime: 0,
			//上次的位置
			currentX: 0,
			screenWidth: 0,
			optionsList: []
		};
	},
	watch:{
		show(val){
			if(val){
				this.animationTime = 350;
				this.translateX = -this.maxWidth;
			} else {
				this.animationTime = 350;
				this.translateX = 0;
			}
		},
		options(val){
			this.optionsList = val;
		},
	},
	created() {
		let systemInfo = uni.getSystemInfoSync();
		this.screenWidth = systemInfo.screenWidth;
		this.optionsList = this.options;
	},
	mounted() {
		const _this = this;
		setTimeout(() => {
			// #ifdef APP-NVUE
			dom.getComponentRect(this.$refs['swipeActionBtnBox'], (data) => {
				_this.maxWidth = data.size.width;
				if(_this.show){
					_this.animationTime = 350;
					_this.translateX = -data.size.width;
				}
			});
			// #endif
			// #ifndef APP-NVUE
			uni.createSelectorQuery().in(this).selectAll('.swipe_action_btn_box')
				.boundingClientRect(data => {
					_this.maxWidth = data[0].width;
					if(_this.show){
						_this.animationTime = 350;
						_this.translateX = -data[0].width;
					}
				}).exec()
			// #endif
		},500);
	},
	//方法
	methods: {
		onBtn(index, item) {
			this.$emit('button', {
				content: item,
				index: this.index,
				buttonIndex: index
			});
			if(this.autoClose){
				this.animationTime = 350;
				this.translateX = 0;
			}
		},
		// 手指触摸动作开始
		onTouchstart(e) {
			if(this.disabled){
				return;
			}
			//储存手指触摸坐标，当前时间戳，当前坐标
			// #ifdef APP-NVUE
			this.touchStartX = e.changedTouches[0].screenX;
			// #endif
			// #ifndef APP-NVUE
			this.touchStartX = e.changedTouches[0].clientX;
			// #endif
			this.startTime = new Date().getTime();
			this.currentX = this.translateX;
		},
		// 手指触摸后移动
		onTouchmove(e) {
			if(this.disabled){
				return;
			}
			//手指当前坐标
			// #ifdef APP-NVUE
			const clientX = e.changedTouches[0].screenX;
			// #endif
			// #ifndef APP-NVUE
			const clientX = e.changedTouches[0].clientX;
			// #endif
			//计算滑动距离
			const difference = this.touchStartX - clientX;
			//判断左滑还是右滑
			if (difference > 0) {
				//计算当前已滑动距离
				const leftDifference = this.currentX - Math.abs(difference);
				//判断是否大于滑动的最大宽度
				if (this.maxWidth < Math.abs(leftDifference)) {
					this.animationTime = 0;
					this.translateX = -this.maxWidth;
				} else {
					this.animationTime = 0;
					this.translateX = leftDifference;
				}
			} else {
				const rightDifference = this.currentX + Math.abs(difference);
				if (0 < rightDifference) {
					this.animationTime = 0;
					this.translateX = 0;
				} else {
					this.animationTime = 0;
					this.translateX = rightDifference;
				}
			}
		},
		// 手指触摸动作被打断，如来电提醒，弹窗
		onTouchcancel(e) {
			if(this.disabled){
				return;
			}
			// #ifdef APP-NVUE
			this.finallySlide(e.changedTouches[0].screenX);
			// #endif
			// #ifndef APP-NVUE
			this.finallySlide(e.changedTouches[0].clientX);
			// #endif
			
		},
		// 手指触摸动作结束
		onTouchend(e) {
			if(this.disabled){
				return;
			}
			// #ifdef APP-NVUE
			this.finallySlide(e.changedTouches[0].screenX);
			// #endif
			// #ifndef APP-NVUE
			this.finallySlide(e.changedTouches[0].clientX);
			// #endif
		},
		//最终判断滑动
		finallySlide(finallyX) {
			//手指离开的时间
			const endTime = new Date().getTime();
			//手机滑动屏幕的总花费时间
			const timeDifference = endTime - this.startTime;
			//手指触摸总滑动距离
			const distanceDifference = this.touchStartX - finallyX;
			//判断最终滑动方向
			if (distanceDifference > 0) {
				//判断是否滑动到左边  滑动距离超过3分之一 或者 滑动时间在300毫秒并且距离在4分之一
				if (Math.abs(this.translateX) > this.maxWidth / 2 || (timeDifference < 300 && distanceDifference > this.maxWidth / 4)) {
					this.animationTime = 350;
					this.translateX = -this.maxWidth;
				} else {
					this.animationTime = 350;
					this.translateX = 0;
				}
				
			} else if (distanceDifference < 0) {
				//判断是否滑动到右边  滑动距离超过3分之一 或者 滑动时间在300毫秒并且距离在4分之一
				if (Math.abs(this.translateX) < this.maxWidth / 2 || (timeDifference < 300 && Math.abs(distanceDifference) > this.maxWidth / 4)) {
					this.animationTime = 350;
					this.translateX = 0;
				} else {
					this.animationTime = 350;
					this.translateX = -this.maxWidth;
				}
			}
		}
	}
};
</script>
<style scoped>
.swipe_action_box {
	overflow: hidden;
	width: 750rpx;
}
.swipe_action_item {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
}
.swipe_action_content {
	width: 750rpx;
	/* #ifndef APP-NVUE */
	flex-shrink: 0;
	/* #endif */
}
.swipe_action_btn_box {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-shrink: 0;
	/* #endif */
	flex-direction: row;
}
.swipe_action_btn {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding: 0 30rpx;
}
</style>
