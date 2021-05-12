<template>
	<z-popup v-model="currentValue">
		<view class="addresTitle">
			<text @click="currentValue = false">取消</text>
			<view>所在地区</view>
			<text @click="onConfirm">确定</text>
		</view>
		<z-address :dataList="addressVal" @change="addressChange" :length="length" :force="force"></z-address>
	</z-popup>
</template>

<script>
export default {
	props: {
		dataList: {
			type: Array,
			default() {
				return [];
			}
		},
		value: {
			type: Boolean,
			default: false
		},
		length: {
			type: Number,
			default: 3
		},
		force:{
			type: Boolean,
			default: true
		}
	},
	created() {
		if (typeof this.value !== 'undefined') {
			this.currentValue = this.value;
		}
		if (this.dataList instanceof Array) {
			this.addressVal = this.dataList;
		}
	},
	watch: {
		value(val) {
			this.currentValue = val;
		},
		currentValue(val) {
			this.$emit(val ? 'on-show' : 'on-hide');
			this.$emit('input', val);
		},
		dataList(val) {
			this.addressVal = val;
		}
	},
	data() {
		return {
			currentValue: false,
			//选出的值
			addressVal: []
		};
	},
	methods: {
		addressChange(val) {
			console.log(val);
			this.addressVal = val;
		},
		onConfirm() {
			if (parseInt(this.length) <= this.addressVal.length || !this.force && this.addressVal.length > 0) {
				this.currentValue = false;
				this.$emit('change', this.addressVal);
			} else {
				uni.showToast({
					title: '请选择',
					icon: 'none'
				});
			}
		}
	},
	mounted() {}
};
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
.addresTitle {
	display: flex;
	justify-content: space-between;
	height: 88upx;
	line-height: 88upx;
	border-bottom: 2upx solid #ebebeb;
	padding: 0 20upx;
	background-color: #FFF;
}
.addresTitle view {
	font-size: 32upx;
}
.addresTitle text {
	width: 80upx;
	flex-shrink: 0;
	text-align: center;
}
.addresTitle text {
	font-size: 28upx;
	color: #999;
}
.addresTitle text:last-child {
	color: $themeColor;
}
</style>
