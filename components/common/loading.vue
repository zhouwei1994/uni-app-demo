<template>
	<view class="mask mask-show" v-if="loadingShow" @touchmove.stop.prevent="preventTouchMove">
		<!-- 加载动画开始 -->
		<view class="preloader">
		  <view class="loader"></view>
		</view>
		<!-- 加载动画结束 -->
		<view class="title">加载中...</view>
	</view>
</template>

<script scoped="true">
import { mapState, mapMutations } from 'vuex';
export default {
	computed: {
		...mapState(['loadingShow'])
	},
	methods:{
		preventTouchMove(){
			console.log('stop user scroll it!');
			return;
		}
	}
};
</script>

<style>
.mask {
	/* pointer-events: none; */
	position: fixed;
	z-index: 99999;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
}
.mask.mask-show {
	background: rgba(255,255,255, 0.3);
}
.title {
	color: #333;
	font-size: 28rpx;
	margin-top: 20rpx;
}

.loader {
  display: block;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 3rpx solid transparent;
  border-top-color: #9370db;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}
.loader::before {
  content: "";
  position: absolute;
  top: 5rpx;
  left: 5rpx;
  right: 5rpx;
  bottom: 5rpx;
  border-radius: 50%;
  border: 3rpx solid transparent;
  border-top-color: #ba55d3;
  -webkit-animation: spin 3s linear infinite;
  animation: spin 3s linear infinite;
}
.loader::after {
  content: "";
  position: absolute;
  top: 15rpx;
  left: 15rpx;
  right: 15rpx;
  bottom: 15rpx;
  border-radius: 50%;
  border: 3rpx solid transparent;
  border-top-color: #ff00ff;
  -webkit-animation: spin 1.5s linear infinite;
  animation: spin 1.5s linear infinite;
}
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
