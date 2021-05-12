<template>
	<view>
		<view class="addres_select_val">
			<view>
				<view v-for="(item, index) of addressVal" :key="index" :class="{ select: addressIndex == index }" @click="selectType(index)" k>{{ item.name }}</view>
				<view
					:class="{ select: selectState == addressIndex }"
					v-show="selectState < length || (selectState >= length && selectState < 3 && !force)"
					@click="selectType(selectState)"
				>
					请选择
				</view>
			</view>
		</view>
		<scroll-view class="addres_box" scroll-y :scroll-top="scrollTop">
			<view>
				<view
					v-for="(item, index) of addressList"
					:key="index"
					:class="{ select: addressVal.length > addressIndex && item.objId == addressVal[addressIndex].objId }"
					@click="selectClick(item)"
				>
					{{ item.name }}
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	props: {
		//选中数据
		dataList: {
			type: Array,
			default() {
				return [];
			}
		},
		//联动长度[省，市，区]
		length: {
			type: Number,
			default() {
				return 3;
			}
		},
		//是否强制选择,如果length=2,force = false 选择到市的时候就可以确定了，但是还可以选择到区
		force: {
			type: Boolean,
			default() {
				return true;
			}
		}
	},
	created() {
		if (this.dataList instanceof Array) {
			this.addressVal = this.dataList;
			this.selectState = this.dataList.length;
		}
	},
	watch: {
		dataList(val) {
			this.addressVal = val;
			this.selectState = val.length;
		}
	},
	data() {
		return {
			//选出的值
			addressVal: [],
			//当前选择
			addressIndex: 0,
			//选择的值
			addressList: [],
			//请选择的显示
			selectState: 0,
			scrollTop:0
		};
	},
	methods: {
		getRegion(pid) {
			//请求数据
			this.$http.get('api/common/v1/region', { pid: pid }, { load: false }).then(data => {
				if (data.length > 0) {
					this.addressList = data;
					this.scrollTop = 0;
				} else {
					this.$emit('change', this.addressVal);
				}
			});
		},
		//切换对应的类型
		selectType(index) {
			this.addressIndex = index;
			var len = this.addressVal.length;
			if (index == 0) {
				this.getRegion(0);
			} else {
				this.getRegion(this.addressVal[index - 1].objId);
			}
			if (len == this.length) {
				this.selectState = this.length;
			} else if (len == this.length && index == this.length && this.force) {
				this.selectState = index;
			} else {
				this.selectState = index + 1;
			}
		},
		//选择
		selectClick(item) {
			if (this.addressIndex == 0) {
				this.addressVal = [];
			} else {
				this.addressVal.splice(this.addressIndex, this.addressVal.length - 1);
			}
			this.addressVal.push(item);
			if (this.addressVal.length < this.length || (this.addressVal.length < 3 && !this.force)) {
				this.getRegion(item.objId);
				this.addressIndex++;
			}
			if (this.addressVal.length >= this.length || !this.force) {
				this.$emit('change', this.addressVal);
			}
			this.selectState = this.addressVal.length;
		}
	},
	mounted() {
		this.getRegion(0);
	}
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.addres_select_val {
	padding: 0upx 10upx;
	border-bottom: 1upx solid #ebebeb;
	box-sizing: border-box;
	background-color: #fff;
}
.addres_select_val > view {
	display: flex;
	flex-wrap: wrap;
}
.addres_select_val > view > view {
	margin-left: 20upx;
	padding: 0upx 10upx;
	height: 72upx;
	line-height: 72upx;
	border-bottom: 2upx solid #fff;
	box-sizing: border-box;
	font-size: 28upx;
}
.addres_select_val > view > view:first-child {
	margin-left: 0upx;
}
.addres_select_val > view > view.select {
	border-bottom: 2upx solid $themeColor;
	color: $themeColor;
}
.addres_box {
	padding: 0upx 20upx;
	height: 420upx;
	overflow-y: auto;
	background-color: #fff;
}
.addres_box view > view {
	height: 72upx;
	line-height: 72upx;
	font-size: 28upx;
}
.addres_box view > view.select {
	color: $themeColor;
}
</style>
