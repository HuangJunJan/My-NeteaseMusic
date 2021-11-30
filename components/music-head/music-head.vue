<template>
	<view class="music-head" :style="{color:textColor}">
		<view class="music-head-icon" v-if="isShowIcon" :class="{'icon-black':isIconBlack}">
			<u-icon name="arrow-left" @click="toBack"></u-icon>|
			<u-icon name="home" @click="toHome"></u-icon>
		</view>
		{{title}}
	</view>
</template>

<script>
	export default {
		name:"music-head",
		data() {
			return {
				
			};
		},
		props:["title","isShowIcon","isIconBlack","textColor"],
		methods:{
			toBack(){
				uni.navigateBack()
			},
			toHome(){
				uni.navigateTo({
					url:'../../pages/index/index'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.music-head{
		width: 100%;
		height: 75px;
		font-size: 16px;
		text-align: center;
		line-height: 75px;
		color: black;
		position: relative;
		.music-head-icon{
			position: absolute;
			left: 8px;
			top: 26px;
			width: 90px;
			height: 30px;
			background: rgba(0,0,0,.4);
			color: white;
			line-height: 30px;
			border-radius: 15px;
			display: flex;
			justify-content: space-evenly; // 平均分配
		}
		.icon-black{
			color: black;
			border: 1px #eaeaea solid;
			background: white;
		}
	}

</style>
