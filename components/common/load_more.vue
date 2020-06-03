<template>
	<view class="load_more">
		<view v-if="state == 1000" class="pullUp">上拉加载</view>
		<view v-else-if="state == 1100" class="load">加载中</view>
		<view v-else-if="state == 1200" class="text">加载失败</view>
		<view v-else-if="state == 1300" class="text">没有更多数据了</view>
		<view v-else-if="state == 1400">
			<slot>
				<view class="noData" :style="'height:' + height + 'vh'" v-if="type == 1">
					<image src="http://qn.kemean.cn/upload/201907/23/illustration3.png" mode="aspectFit"></image>
					<text>{{ text || '暂无内容喔~' }}</text>
				</view>
				<view class="noData" :style="'height:' + height + 'vh'" v-else-if="type == 2">
					<image src="http://qn.kemean.cn/upload/201907/23/illustration1.png" mode="aspectFit"></image>
					<text>{{ text || '购物车空空如也！' }}</text>
				</view>
				<view class="noData" :style="'height:' + height + 'vh'" v-else-if="type == 3">
					<image src="http://qn.kemean.cn/upload/201907/23/illustration2.png" mode="aspectFit"></image>
					<text>{{ text || '暂无商品喔~' }}</text>
				</view>
			</slot>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	props: {
		type: {
			type: Number,
			default: function() {
				return 1;
			}
		},
		text: {
			type: String,
			default: function() {
				return '';
			}
		},
		height: {
			type: Number,
			default: function() {
				return 60;
			}
		}, 
		loadState: {
			type: Number,
			default: function() {
				return 0;
			}
		}
	},
	data() {
		return {
			state: 1100,
			parentPageRoute: '',
			currentPageRoute: ''
		};
	},
	computed: {
		//默认:1000=上拉加载
		//1100=加载中
		//1200=加载失败
		//1300=没有更多数据了
		//1400=暂未数据
		...mapState(['requestState'])
	},
	watch: {
		requestState(val) {
			// if (val == 1100) {
				const pages = getCurrentPages();
				this.currentPageRoute = pages[pages.length - 1].route;
			// }
			if (this.currentPageRoute == this.parentPageRoute) {
				this.state = val;
				this.$emit('change', val);
			}
		},
		loadState(val) {
			this.state = val;
		}
	},
	//第一次加载
	created() {
		let currentPages = getCurrentPages();
		let page = currentPages[currentPages.length - 1];
		this.parentPageRoute = page.route;
		if (this.loadState) {
			this.state = this.loadState;
		} else if(this.requestState){
			this.state = this.requestState;
		}
	},
	//方法
	methods: {
	}
};
</script>
<style lang="scss" scoped>
@import '@/style/mixin.scss';
.load_more {
	> .text,
	.pullUp,
	.load {
		height: 98upx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28upx;
		color: #333;
	}
	.pullUp {
		&::before {
			content: '';
			width: 30upx;
			height: 30upx;
			background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAgCAYAAACVU7GwAAABWklEQVRYR+3X703DQAwF8JcJ6AgwAYxQNukGeISywdsAugFsABPACIzACMjVBbXX3B+fXT6g3rco0eWns2K/TAhYIvIE4J3kc8B2mLybJNAm7XNP8s27pwuVgdTyDUBhnx7YMCoDvQJYA7iKgA2hMtCO5EZE7gBo6dwwM2oJNJcqCmZC1UCRsG5UDygK1oWygCJgTdQIyAurojwgD6yIigBVYDcktdEurkVUJKgA046vnX8RdoI6B8gKO0KdE2SB/aL+ApTBPtL1SSn3KC9oJE+JiMYdzWG6jmCTiBDAQ7q5H66W2OHJUyWYoubp/uIEDeWpDPZIcjuX75rkl+OEXHkqwdbzoTTHzBL0kqda5ev5SiOCXnf5ekCeIXx4IF0oCygC1kSNgLywS546+P36H3lqlX4qbwGYZ2GtrWTtohj0SslTYVuS0upd1vs9s7b59Vlf2vO8iFRn7Q9hxlUwNBGBWgAAAABJRU5ErkJggg==);
			background-position: center center;
			background-repeat: no-repeat;
			background-size: 100% 100%;
			margin-right: 15upx;
		}
	}
	.load {
		&::before {
			content: '';
			width: 30upx;
			height: 30upx;
			background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC0UlEQVRYR8VXzXXaQBCeAa2uoYPgCmIqwK4gTgWmg8CB3ccJfOJpOQAVJKkguIIkFQRXENIBXJHE5I3ert5a1h/yT/YETzO733zzzewOQsO1XC47YRj+YHchxPVoNNo32QqbOLHPYrG4IqIEACJej8fjn032KgUQBMENIn4HgLWUcugeUAUgCIIZIk6J6JNSalMErhSA1noFAJ/zoiwD4H4jom9KqUEjAPP5vNtut/8Y562Usmc3KgOgtf4NAJdsG8fxxWQy2TUCwE6WSv5NRCOlFLNSqAGtNUf7xdiXRp8wWyUcVvvxeNwh4jsA2AshLljxeQyYymDGOkR08H2/W1UdKQAWHAD0T6fTOkuZG5UVpJseS3MRWzZI9vE87/Z0Oj1YYaYAtNZkDYlo5fv+nYs+CIItIn4AgF9Syiu21VoneZZSbs1/LsU+EfEByTdehsUpIqaVJKVMznYBcKl8dFLCjWUmpVzbTcIwvBFCbIpo5QhbrdYAETcWVBAEt4jIuuk4AabaeKQBU/ds/N4xToVXpRf3u9MpUyYA4C8RDd2+kCtCziUADFl4RHSnlOL/Z61MLzgAAKd1lWWvsAo4giiKLpu2WMPAVyLa+74/LEpbZRmeFXYDYzRIWd3pEkI8VNVv3bNMuaaacvwOLFR026ZbAXEc98paaB0AmVb+xIWIdgyA+3Qewp4tpTqH5dmYPsH3Qu7ibplogBXrWkRRtHtu9HY/0/26eQg8z9v+fxE2pfel/HIZ4NwJIXYvVQllYB8BMN1rCgCsiXspJd+Qr7rc63jp3lZvDsC9jvnOF0LM3jQF5kHCr+DVc+v/nJzVKkNu16/FRiUA55n1ZDY4J9Ii21IAbi/PPrOqDjevo77v+/dl7NUeTPImnOyb0AVlLzn3KZ8HutZoljfd5L2KMwBWRMQzwqDxaFZGc9VsWJUi+71ShEUb2YGFv9cZQIr2+Qe+qsXyTTgbwgAAAABJRU5ErkJggg==);
			background-position: center center;
			background-repeat: no-repeat;
			background-size: 100% 100%;
			margin-right: 15upx;
			animation: loadAnimat 0.6s linear infinite;
		}
	}
	.noData {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		image {
			width: 442upx;
			height: 320upx;
		}
		text {
			font-size: 28upx;
			color: #999;
			margin-top: 30upx;
		}
	}
}
@keyframes loadAnimat {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
