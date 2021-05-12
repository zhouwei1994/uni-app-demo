<template>
	<view v-if="show">
		<swiper class="guide_pages_swiper">
			<swiper-item>
				<view class="guide_pages_bg1">第一屏</view>
			</swiper-item>
			<swiper-item>
				<view class="guide_pages_bg2">第二屏</view>
			</swiper-item>
			<swiper-item>
				<view class="guide_pages_bg3">第三屏</view>
				<button v-if="screenHeight > 667" class="guide_pages_close close_1624" @click="onClose">关闭</button>
				<button v-else class="guide_pages_close close_1334" @click="onClose">关闭</button>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
    import {
    	mapState,
    	mapMutations
    } from 'vuex';
	export default {
		data() {
			return {
				screenHeight: 667,
				show: false
			};
		},
		created() {
			if(uni.getStorageSync('guidePages') != 2){
				let systemInfo = uni.getSystemInfoSync();
				this.screenHeight = systemInfo.screenHeight;
				this.show = true;
			}
		},
		methods:{
			onClose(){
				uni.setStorageSync('guidePages', 2);
				this.show = false;
			}
		}
	}
</script>

<style lang="scss">
.guide_pages_swiper {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color:#000;
    z-index: 10000;
	image {
		width: 100vw;
		height: 100vh;
	}
    .guide_pages_bg1 {
        width: 100vw;
        height: 100vh;
        background-color: #4CD964;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFF;
        font-size: 60rpx;
        font-weight: bold;
    }
    .guide_pages_bg2 {
        width: 100vw;
        height: 100vh;
        background-color: #007AFF;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFF;
        font-size: 60rpx;
        font-weight: bold;
    }
    .guide_pages_bg3 {
        width: 100vw;
        height: 100vh;
        background-color: #EA552D;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFF;
        font-size: 60rpx;
        font-weight: bold;
    }
    .guide_pages_close {
        border:2rpx solid #FFF;
        color: #FFF;
        line-height: 68rpx;
        height: 68rpx;
    }
	.close_1334 {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 290rpx;
		height: 68rpx;
		transform: translateX(-50%) translateY(438rpx);
		background-color: transparent;
	}
	.close_1624 {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 290rpx;
		height: 68rpx;
		background-color: transparent;
		transform: translateX(-50%) translateY(412rpx);
	}
}
</style>
