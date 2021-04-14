<template>
	<view class="video_box" :style="{ height: screenHeight + 'px'}">
		<video
			class="video_file"
			:id="`video_${objId}`"
			:ref="`video_${objId}`"
			:src="src"
			:poster="poster"
			loop
			object-fit="contain"
			:show-play-btn="false"
			:show-center-play-btn="false"
			:controls="false"
			:enable-progress-gesture="false"
			:autoplay="videoPlayId == objId"
			:style="'height: '+screenHeight + 'px'"
			@timeupdate="onScheduleChange"
			@waiting="onWaiting"
			@error="onError"
		></video>
		<!-- <view class="bottom_mask"></view> -->
		<!-- 播放按钮 -->
		<view class="play_btn" @click="onPlay">
			<image class="icon_play" v-if="playState == 1000" src="http://qn.kemean.cn/upload/202103/08/1615183536616rn7yfe5g.png" mode="aspectFit"></image>
		</view>
		<view class="play_schedule" :style="{bottom: progressBottom + 'rpx'}">
			<view class="schedule_bg"></view>
			<view class="schedule" :style="{ width: schedule + 'rpx' }"></view>
			<view class="progress_drag_dot" v-if="progressDrag"></view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
export default {
	props: {
		src: {
			type: String,
			default: ''
		},
		objId: {
			default: ""
		},
		poster: {
			//视频封面的图片
			type: String,
			default: ''
		},
		screenHeight: {
			type: Number,
			default: function(){
				return 1334
			}
		},
		progressBottom: {
			type: Number,
			default: function(){
				return 88
			}
		},
	},
	data() {
		return {
			schedule: 0,
			// 1000 待播放
			// 2000 播放中
			// 3000 播放缓冲中
			playState: 1000,
			// 是否拖动进度
			progressDrag: false,
			// 视频总长度
			duration: 0,
			videoCtx: null
		};
	},
	computed: {
		...mapState(['videoPlayId'])
	},
	watch: {
		videoPlayId(val) {
			if (val == this.objId) {
				setTimeout(() => {
					this.videoCtx.play();
					this.playState = 2000;
				}, 200);
			} else {
				setTimeout(() => {
					this.videoCtx.pause();
					this.videoCtx.seek(0);
					this.playState = 1000;
					this.schedule = 0;
				},100);
			}
		}
	},
	mounted() {
		this.videoCtx = uni.createVideoContext(`video_${this.objId}`, this);
		if(this.videoPlayId == this.objId){
			setTimeout(() => {
				this.videoCtx.play();
				this.playState = 2000;
			}, 200);
		}
		let throttling = true;
		uni.$on("videoProgress", res => {
			if(throttling){
				throttling = false;
				setTimeout(() => {
					throttling = true;
					if (res.progress == 1) {
						this.progressDrag = true;
					} else {
						this.progressDrag = false;
					}
					if (this.videoPlayId == this.objId && res.progressValue) {
						this.schedule = res.progressValue * 750;
						this.videoCtx.seek(this.duration * res.progressValue);
					}
				}, 100);
			}
		});
	},
	methods: {
		onScheduleChange(e) {
			this.duration = e.detail.duration;
			if (!this.progressDrag) {
				this.schedule = (parseFloat(e.detail.currentTime) / e.detail.duration) * 750;
			}
		},
		onPlay() {
			if (this.playState == 2000) {
				this.videoCtx.pause();
				this.playState = 1000;
			} else if (this.playState == 1000) {
				this.videoCtx.play();
				this.playState = 2000;
			} else if (this.playState == 3000) {
				this.videoCtx.play();
				this.playState = 2000;
			}
		},
		// 视频进入缓冲中
		onWaiting() {
			this.playState = 3000;
		},
		onError(e){
			console.log("视频播放出错", e);
		}
	}
};
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
.video_box {
	position: relative;
	width: 750rpx;
}
.bottom_mask {
	position: absolute;
	left: 0rpx;
	bottom: 0rpx;
	right: 0rpx;
	height: 300rpx;
	width: 750rpx;
	background-image: linear-gradient(to bottom, rgba(0,0,0,0) , rgba(0,0,0,0.7)); 
}
.video_file {
	width: 750rpx;
}
.play_schedule {
	position: absolute;
	bottom: 6rpx;
	left: 0;
	height: 16rpx;
	width: 750rpx;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
}
.schedule_bg {
	position: absolute;
	top: 7rpx;
	left: 0;
	right: 0;
	height: 2rpx;
	background-color: rgba(255, 255, 255, 0.3);
}
.schedule {
	background-color: #fff;
	height: 2rpx;
	position: relative;
}
.progress_drag_dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	background-color: #fff;
}
.play_btn {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	justify-content: center;
	align-items: center;
}
.icon_play {
	width: 90rpx;
	height: 90rpx;
}
</style>
