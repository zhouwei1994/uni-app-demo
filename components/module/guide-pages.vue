<template>
	<view v-if="show">
		<swiper class="guide_pages_swiper">
			<swiper-item>
				<image v-if="screenHeight > 667" src="../static/img/guide_750_1624_1.png" mode="aspectFill"></image>
				<image v-else src="../static/img/guide_750_1334_1.png" mode="aspectFill"></image>
			</swiper-item>
			<swiper-item>
				<image v-if="screenHeight > 667" src="../static/img/guide_750_1624_2.png" mode="aspectFill"></image>
				<image v-else src="../static/img/guide_750_1334_2.png" mode="aspectFill"></image>
			</swiper-item>
			<swiper-item>
				<image v-if="screenHeight > 667" src="../static/img/guide_750_1624_3.png" mode="aspectFill"></image>
				<image v-else src="../static/img/guide_750_1334_3.png" mode="aspectFill"></image>
				<button v-if="screenHeight > 667" class="close_1624" @click="onClose"></button>
				<button v-else class="close_1334" @click="onClose"></button>
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
				this.show = true;
			}
            let systemInfo = uni.getSystemInfoSync();
            this.screenHeight = systemInfo.screenHeight;
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
	image {
		width: 100vw;
		height: 100vh;
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
