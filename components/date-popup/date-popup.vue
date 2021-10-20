<template>
	<picker mode="multiSelector" @change="dateChange" @columnchange="dateColumnChange" :value="dateIndex" :range="dateList" range-key="name"><slot></slot></picker>
</template>
<script>
let dateColumn = 0;
let hoursColumn = 0;
export default {
    props: {
        //可选天数(不能超过50天)
        optionalDate:{
            type: Number,
            default() {
            	return 2;
            }
        },
        // 最快多少分钟后
        bufferMinutes: {
            type: Number,
            default() {
            	return 5;
            }
        },
        // 每天开始时间
        dayStartTime:{
            type: String,
            default() {
            	return '00:00';
            }
        },
        // 每天结束时间
        dayEndTime:{
            type: String,
            default() {
            	return '24:00';
            }
        },
        // 是否显示立即配送
        shipNow:{
            type: Boolean,
            default() {
            	return false;
            }
        },
        // 开始时间
        startTime:{
            type: String,
            default() {
            	return "";
            }
        }
    },
	data() {
		return {
			dateList: [[], [], []],
			dateIndex: [0, 0, 0],
            // 是否当天
            isThatDay: true
		};
	},
	created() {
		this.initDate();
	},
    watch: {
        startTime(val){
            this.initDate();
        }
    },
	//方法
	methods: {
		//配送时间
		dateChange(e) {
			let value = e.detail.value;
			this.dateIndex = value;
			let hours = this.dateList[1][value[1]];
			let minutes = this.dateList[2][value[2]];
			let timeName = '';
			if (value[0] > 0) {
				timeName = hours.name + minutes.name;
			}
			this.$emit('change', {
				dateName: this.dateList[0][value[0]].name,
				dateValue: this.dateList[0][value[0]].value,
				timeName: timeName,
				timeValue: (hours.value < 10 ? '0' + hours.value : hours.value) + ':' + (minutes.value < 10 ? '0' + minutes.value : minutes.value)
			});
		},
		//配送时间选择时
		dateColumnChange(e) {
            let today = 0;
            if(this.shipNow){
                today = 1;
            }
			let date = void 0;
            if(this.startTime){
                let startTimeStr = this.startTime.replace(/-/g,"/");
                if(!/\s/g.test(startTimeStr)){
                    startTimeStr += " 00:00:00"
                }
                date = new Date(startTimeStr);
            } else {
                date = new Date();
            }
			//当前时间
			let startTimeObj = {
				year: date.getFullYear(),
				month: date.getMonth() + 1,
				date: date.getDate(),
				hours: date.getHours(),
				minutes: date.getMinutes()
			};
			//当前时间**分钟后的日期
			let currentStartTime = this.getRecentTime(startTimeObj, {
				type: 'minutes',
				num: this.bufferMinutes
			});
			//判断用户滑动的第一例 日期
			if (e.detail.column == 0) {
				//每次滑动第一列将储存index
				dateColumn = e.detail.value;
				//滑动到第一列第一个还原数据
				if (e.detail.value == 0 && this.shipNow) {
					this.dateList[1] = [
						{
							name: '-',
							value: currentStartTime.hours
						}
					];
					this.dateList[2] = [
						{
							name: '-',
							value: currentStartTime.minutes
						}
					];
				} else {
					if (e.detail.value == today && this.isThatDay) {
						this.dateList[1] = this.getHoursList(currentStartTime.hours);
						this.dateList[2] = this.getMinutesList(currentStartTime.hours, currentStartTime.minutes);
					} else {
						this.dateList[1] = this.getHoursList();
						this.dateList[2] = this.getMinutesList(this.dateList[1][hoursColumn].value);
					}
				}
			} else if (e.detail.column == 1) { //判断用户滑动的第二例 小时
				hoursColumn = e.detail.value;
				if (dateColumn == today && e.detail.value == 0 && this.isThatDay) {
					if(this.dateList[1][0].value < currentStartTime.hours){
						this.dateList[1].splice(0,1);
					}
					this.dateList[2] = this.getMinutesList(currentStartTime.hours, currentStartTime.minutes);
				}else{
					this.dateList[2] = this.getMinutesList(this.dateList[1][e.detail.value].value);
				}
			}
			this.$forceUpdate();
		},
		//获取月份对应的天数
		getDateMax(year, month) {
			if (month == 2) {
				return year % 4 == 0 ? 29 : 28;
			} else if ([1,3,5,7,8,10,12].includes(month)) {
				return 31;
			} else {
				return 30;
			}
		},
		//获取日期相加后的结果
		dateVal(dateInfo, addMonth = 0) {
			dateInfo.month = dateInfo.month;
			if (dateInfo.month > 12) {
				dateInfo.month = 1;
				dateInfo.year += 1;
			}
			let dateMax = this.getDateMax(dateInfo.year, dateInfo.month);
			if (dateInfo.date > dateMax) {
				dateInfo.date = dateInfo.date - dateMax;
				dateInfo.month += 1;
				addMonth += 1;
				return this.dateVal(dateInfo, addMonth);
			} else {
				return {
					...dateInfo,
					addMonth: addMonth
				};
			}
		},
		//获取年月日时分相加后的日期
		getRecentTime(data, add) {
			const _this = this;
			//时间相加
			function dateCalculation(res) {
				if (res.type == 'minutes') {
					if (data.minutes + res.num >= 55) {
						if(data.minutes + res.num <= 60){
							dateCalculation({
								type: 'hours',
								num: 1
							});
							data.minutes = 0;
						} else {
							dateCalculation({
								type: 'hours',
								num: parseInt((data.minutes + res.num) / 60)
							});
							data.minutes = (data.minutes + res.num) % 60;
						}
						
					} else {
						data.minutes = data.minutes + res.num;
					}
				} else if (res.type == 'hours') {
					if (data.hours + res.num >= 24) {
						dateCalculation({
							type: 'date',
							num: parseInt((data.hours + res.num) / 24)
						});
						data.hours = (data.hours + res.num) % 24;
					} else {
						data.hours = data.hours + res.num;
					}
				} else if (res.type == 'date') {
					let value = _this.dateVal({
						date: data.date + res.num,
						month: data.month,
						year: data.year
					});
					if (value.addMonth > 0) {
						dateCalculation({
							type: 'month',
							num: value.addMonth
						});
					}
					data.date = value.date;
				} else if (res.type == 'month') {
					if (data.month + res.num > 12) {
						dateCalculation({
							type: 'year',
							num: parseInt((data.month + res.num) / 24)
						});
						data.month = (data.month + res.num) % 12;
					} else {
						data.hours = data.hours + res.num;
					}
				} else if (res.type == 'year') {
					data.year += res.num;
				}
			}
			dateCalculation(add);
			return data;
		},
		//初始化时间
		initDate() {
			let date = new Date();
			//当前时间
			let currentTime = {
				year: date.getFullYear(),
				month: date.getMonth() + 1,
				date: date.getDate(),
				hours: date.getHours(),
				minutes: date.getMinutes()
			};
            let selectTime = void 0;
			if(this.startTime){
                let startDateStr = this.startTime.replace(/-/g,"/");
                if(!/\s/g.test(startDateStr)){
                    startDateStr += " 00:00:00";
                }
                let startDate = new Date(startDateStr);
                selectTime = {
                	year: startDate.getFullYear(),
                	month: startDate.getMonth() + 1,
                	date: startDate.getDate(),
                	hours: startDate.getHours(),
                	minutes: startDate.getMinutes()
                };
                if(currentTime.year == selectTime.year && currentTime.month == selectTime.month && currentTime.date == selectTime.date){
                   this.isThatDay = true; 
                } else {
                    this.isThatDay = false; 
                }
            } else {
                selectTime = currentTime;
            }
			//当前时间**分钟后的日期
			let startTimeObj = this.getRecentTime(selectTime, {
				type: 'minutes',
				num: this.bufferMinutes
			});
			//设置日期选择器默认数据
			this.getDefaultList(startTimeObj, currentTime);
			let changeData = {};
			if(this.dateList.length >= 3){
				if(this.dateList[0].length > 0){
					let dateData = this.dateList[0][0];
					changeData.dateName = dateData.name;
					changeData.dateValue = dateData.value;
				}
				if(this.dateList[1].length > 0){
					let timeData = this.dateList[1][0];
					changeData.timeName = timeData.name;
					changeData.timeValue = timeData.value < 10 ? '0' + timeData.value : timeData.value;
				}
				if(this.dateList[2].length > 0){
					let timeData = this.dateList[2][0];
					changeData.timeName += timeData.name;
					changeData.timeValue += ":" + (timeData.value < 10 ? '0' + timeData.value : timeData.value);
				}
			}
			this.$emit('change', changeData);
		},
		//获取默认数据
		getDefaultList(date, currentDate) {
			let dateList = [];
            if(this.shipNow && !this.startTime){
                const firstName = '立即配送';
                const firstValue = date.year + '-' + (date.month < 10 ? '0' + date.month : date.month) + '-' + (date.date < 10 ? '0' + date.date : date.date);
                dateList.push({
                	name: firstName,
                	value: firstValue,
                	type: "now"
                });
                this.dateList[1].push({
                	name: '-',
                	value: date.date,
                });
                this.dateList[2].push({
                	name: '-',
                	value: date.minutes,
                });
                //组件返回初始值
                this.$emit('change', {
                	dateName: firstName,
                	dateValue: firstValue,
                	timeName: '',
                	timeValue: (date.hours < 10 ? '0' + date.hours : date.hours) + ':' + (date.minutes < 10 ? '0' + date.minutes : date.minutes)
                });
            }
			//获取日期数据表并和立即维修合并
			this.dateList[0] = dateList.concat(this.getDateList(date, currentDate));
            if(!this.shipNow){
                if(this.isThatDay){
                    this.dateList[1] = this.getHoursList(date.hours);
                    this.dateList[2] = this.getMinutesList(date.hours, date.minutes);
                } else {
                    this.dateList[1] = this.getHoursList();
                    this.dateList[2] = this.getMinutesList(this.dateList[1][0].value);
                }
            }
		},
		//获取日期排序
		getDateList(date, currentDate) {
			let dateList = [];
			let monthMax = date.date + this.optionalDate;
			let currentMonthMax = this.getDateMax(date.year, date.month);
            let tomorrowDateValue = this.dateVal({
            	year: currentDate.year,
            	month: currentDate.month,
            	date: currentDate.date + 1
            });
			//遍历日期选择
			for (let i = date.date; i < monthMax; i++) {
				let dateStr, name;
				if (i <= currentMonthMax && this.isThatDay) {
					dateStr = date.year + '-' + (date.month < 10 ? '0' + date.month : date.month) + '-' + (i < 10 ? '0' + i : i);
					if (currentDate.date == i) {
						name = '今天';
					} else if (currentDate.date + 1 == i) {
						name = '明天';
					} else {
						name = currentDate.month + '月' + i + '日';
					}
				} else {
                    let dateValue = this.dateVal({
                    	year: date.year,
                    	month: date.month,
                    	date: i
                    });
                    
                    dateStr =
                    	dateValue.year +
                    	'-' +
                    	(dateValue.month < 10 ? '0' + dateValue.month : dateValue.month) +
                    	'-' +
                    	(dateValue.date < 10 ? '0' + dateValue.date : dateValue.date);
                    if (currentDate.month == dateValue.month && currentDate.date == dateValue.date) {
                    	name = '今天';
                    } else if (tomorrowDateValue.month == dateValue.month && tomorrowDateValue.date == dateValue.date) {
                    	name = '明天';
                    } else {
                    	name = dateValue.month + '月' + dateValue.date + '日';
                    }
				}
				dateList.push({
					name: name,
					value: dateStr
				});
			}
			return dateList;
		},
		//获取小时排序
		getHoursList(minHours) {
			let hoursList = [];
			let startHours = 0;
			let endHours = 24;
			try {
				if (this.dayStartTime) {
					let arr = this.dayStartTime.split(':');
					startHours = parseInt(arr[0]);
				}
			} catch (e) {
				console.error('开始时间转换失败，参数值：' + this.dayStartTime);
			}
			try {
				if (this.dayEndTime) {
					let arr = this.dayEndTime.split(':');
					if(parseInt(arr[1]) > 0){
						endHours = parseInt(arr[0]) + 1;
					}else{
						endHours = parseInt(arr[0]);
					}
				}
			} catch (e) {
				console.error('结束时间转换失败，参数值：' + this.dayEndTime);
			}
			if (minHours && minHours > startHours) {
				startHours = parseInt(minHours);
			}
			//遍历出小时选择值
			for (var h = startHours; h < endHours; h++) {
				if (h < 10) {
					hoursList.push({
						name: '0' + h + '时',
						value: h
					});
				} else {
					hoursList.push({
						name: h + '时',
						value: h
					});
				}
			}
			return hoursList;
		},
		//获取分钟排序
		getMinutesList(hours, minMinutes) {
			let minutesList = [];
			let startMinutes = 0;
			let endMinutes = 60;
			try {
				if (this.dayStartTime) {
					let arr = this.dayStartTime.split(':');
					if (parseInt(arr[0]) == hours) {
						startMinutes = parseInt(arr[1]);
					}
				}
			} catch (e) {
				console.error('开始时间转换失败，参数值：' + this.dayStartTime);
			}
			try {
				if (this.dayEndTime) {
					let arr = this.dayEndTime.split(':');
					if (parseInt(arr[0]) == hours) {
						endMinutes = parseInt(arr[1]);
					}
				}
			} catch (e) {
				console.error('结束时间转换失败，参数值：' + this.dayEndTime);
			}
			if (minMinutes && minMinutes > startMinutes) {
				startMinutes = parseInt(minMinutes);
			}
			if(startMinutes !== 0){
				let startBit;
				var minutesString = startMinutes.toString();
				//获取当前分钟第一位字符
				if (startMinutes < 10) {
					startBit = 0;
				} else {
					startBit = minutesString.charAt(0);
				}
				//获取当前分钟最后一位字符
				var lastBit = minutesString.charAt(minutesString.length - 1);
				if (lastBit > 5) {
					startMinutes = parseInt(parseInt(startBit) + 1 + '0');
				} else {
					startMinutes = parseInt(startBit + '5');
				}
			}
			//遍历出分钟选择值
			for (var m = startMinutes; m < endMinutes; m = m + 5) {
				if (m < 10) {
					minutesList.push({
						name: '0' + m + '分',
						value: m
					});
				} else {
					minutesList.push({
						name: m + '分',
						value: m
					});
				}
			}
			return minutesList;
		}
	}
};
</script>
