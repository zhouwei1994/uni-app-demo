<template>
    <view>
        <view class="popupClick" @click="onPopupShow()"><slot></slot></view>
        <z-popup v-model="currentValue">
        	<view class="multiple_choice_title">
        		<text @click="currentValue = false">取消</text>
        		<view>{{title}}</view>
        		<text @click="onConfirm">确定</text>
        	</view>
            <scroll-view scroll-y="true" class="multiple_choice_scroll">
                <view class="multiple_choice_box">
                    <view class="multiple_choice_content">
                        <view class="multiple_choice_item" v-for="(item,index) of rangeList" :key="index" @click="onSelect(index)">
                            <view class="select" :class="{active: item.select }"></view>
                            <view class="value">{{item[rangeKey]}}</view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </z-popup>
    </view>
</template>

<script>
export default {
	props: {
		value: {
			type: Boolean,
			default: false
		},
        title: {
            type: String,
            default: ""
        },
        range: {
            type: Array,
            default: function(){
                return []
            }
        },
        rangeKey: {
            type: String,
            default: "name"
        },
	},
	created() {
		if (typeof this.value !== 'undefined') {
			this.currentValue = this.value;
		}
        this.rangeList = this.range.map(item => {
            item.select = false;
            return item;
        });
        
	},
	watch: {
		value(val) {
			this.currentValue = val;
		},
		currentValue(val) {
			this.$emit(val ? 'on-show' : 'on-hide');
			this.$emit('input', val);
		},
        range(val){
            this.rangeList = val.map(item => {
                item.select = false;
                return item;
            });
        }
	},
	data() {
		return {
			currentValue: false,
            rangeList: []
		};
	},
	methods: {
		onPopupShow(){
            this.currentValue = true;
        },
        onSelect(index){
            let item = this.rangeList[index];
            item.select = !item.select;
            this.$set(this.rangeList, index, item);
        },
        onConfirm(){
            let resultList = this.rangeList.filter(item => {
                if(item.select){
                    return true;
                } else {
                    return false;
                }
            });
            if(resultList.length > 0){
                this.currentValue = false;
                this.$emit("change", resultList);
            } else {
                uni.showToast({
                    title: "请选择",
                    icon: "none"
                });
            }
        }
	},
	mounted() {}
};
</script>

<style lang="scss" scoped>
@import '@/style/mixin.scss';
.multiple_choice_title {
	display: flex;
	justify-content: space-between;
	height: 88upx;
	line-height: 88upx;
	border-bottom: 2upx solid #ebebeb;
	padding: 0 20upx;
	background-color: #FFF;
}
.multiple_choice_title view {
	font-size: 32upx;
}
.multiple_choice_title text {
	width: 80upx;
	flex-shrink: 0;
	text-align: center;
}
.multiple_choice_title text {
	font-size: 28upx;
	color: #999;
}
.multiple_choice_title text:last-child {
	color: $themeColor;
}
.multiple_choice_scroll {
    background-color: #FFF;
    max-height: 60vh;
    min-height: 30vh;
}
.multiple_choice_box {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 30vh;
}
.multiple_choice_content {
    .multiple_choice_item {
        height: 100rpx;
        padding: 0 30rpx;
        font-size: 30rpx;
        display: flex;
        align-items: center;
        // &:nth-child(2n) {
        //     background-color: #f7f7f7;
        // }
        .select {
            width: 40rpx;
            height: 40rpx;
            margin-right: 15rpx;
            // background-image: url(../../static/icon/ic_notselected.png);
            // background-size: 100% 100%;
            flex-shrink: 0;
            border-radius: 50%;
            border: 2rpx solid #ccc;
            &.active {
                border: 2rpx solid $themeColor;
                background-color: $themeColor;
                text-align: center;
                line-height: 38rpx;
                transform:rotate(15deg);
            }
            &.active::before {
                content: "√";
                color: #FFF;
            }
        }
        .value {
            width: calc(100% - 55rpx);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap
        }
    }
}
</style>
