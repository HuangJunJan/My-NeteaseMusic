<template>
	<view>
		<music-head title="Hay-J云音乐" :isShowIcon="false" :isIconBlack="true"></music-head>
		<!-- 搜索框，不可编辑 -->
		<view class="u-m-30" @click="toSearchPage()">
			<u-search placeholder="输入歌曲名/歌手搜索" :disabled="true" animation :show-action="false" height="70"></u-search>
		</view>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="top-list u-skeleton">
					<view class="top-item" v-for="(item,index) in topList" :key="index" @click="toDetailList(item.id)">
						<view class="top-item-img u-skeleton-fillet">
							<image :src="item.coverImgUrl" mode=""></image>
							<text>{{item.updateFrequency}}</text>
						</view>
						<view class="top-item-text">
							<view class="u-skeleton-rect" v-for="(item,index) in item.tracks" :key="index">{{index+1}}.{{item.second}}-{{item.first}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!--引用骨架屏组件-->
		<u-skeleton :loading="loading" border-radius=30 :animation="true" el-color="#ddd" bg-color="#fff"></u-skeleton>
	</view>
	
</template>

<script>
	import {getTopList} from '../../common/api.js'
	export default {
		data() {
			return {
				topList:[
					{id:'',coverImgUrl:'',updateFrequency:'',tracks:[{first:'',second:''},{first:'',second:''},{first:'',second:''}]},
					{id:'',coverImgUrl:'',updateFrequency:'',tracks:[{first:'',second:''},{first:'',second:''},{first:'',second:''}]},
					{id:'',coverImgUrl:'',updateFrequency:'',tracks:[{first:'',second:''},{first:'',second:''},{first:'',second:''}]},
				],//榜单数据
				// 控制骨架屏
				loading: true
			}
		},
		onLoad() {
			setTimeout(()=>{
				getTopList().then(res=>{
					if(res){
						let list = res.data.list
						list.length = 4
						this.topList = list
						this.loading = false
					}
					// console.log(this.topList)
				})
			},500)
		},
		methods: {
			// 跳转搜索页
			toSearchPage(){
				uni.navigateTo({
					url:'/pages/search/search'
				})
			},
			// 跳转榜单详情
			toDetailList(id){
				// console.log(id)
				uni.navigateTo({
					url:'/pages/listDetail/listDetail?id='+id
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		height: calc(100vh - 150px);
		overflow: hidden;
		scroll-view{
			height: 100%;
			.top-list{
				margin: 0 30rpx;
				.top-item{
					display: flex;
					margin-bottom: 34rpx;
					.top-item-img{
						width: 212rpx;
						height: 212rpx;
						position: relative;
						border-radius: 30rpx;
						overflow: hidden;
						image{
							width: 100%;
							height: 100%;
						}
						text{
							position: absolute;
							bottom: 16rpx;
							left: 12rpx;
							color: white;
							font-size: 24rpx;
						}
					}
					.top-item-text{
						margin-left: 22rpx;
						view{
							height: 64rpx;
							line-height: 64rpx;
							margin-top: 6rpx;
							width: 400rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}
				}
			}
		}
	}
</style>
