<template>
	<view>
		<!-- 虚化背景 -->
		<view class="fixbg" :style="{'background-image':'url('+ playList.coverImgUrl + ')'}"></view>
		<music-head title="歌单" :isShowIcon="true" textColor="white"></music-head>
		<view class="container" v-if="!isLoading">
			<scroll-view scroll-y="true" >
				<!-- 歌单简介/列表头部 -->
				<view class="list-head">
					<!-- 左侧 -->
					<view class="list-head-img">
						<image :src="playList.coverImgUrl"></image>
						<view class="list-head-num">
							<u-icon name="play-right"></u-icon>
							<!-- 使用全局过滤器 formatCount-->
							{{playList.playCount | formatCount}}
						</view>
					</view>
					<!-- 右侧 -->
					<view class="list-head-text">
						<view>{{playList.name}}</view>
						<view>
							<image :src="playList.creator.avatarUrl"></image>
							{{playList.creator.nickname}}
						</view>
						<view>
							{{playList.description}}
						</view>
					</view>
				</view>
				
				<!-- #ifdef MP-WEIXIN -->
				<u-button open-type="share" class="list-share" :custom-style="btnStyle" shape="circle">
					<u-icon name="share"></u-icon>
					分享给微信好友
				</u-button>
				<!-- #endif -->
				
				<!-- 歌曲列表 -->
				<view class="music-list">
					<!-- 顶部播放全部模块 -->
					<view class="music-list-head">
						<u-icon name="play-circle" size="48"></u-icon>
						<text>播放全部</text>
						<text>(共{{playList.trackCount}}首)</text>
					</view>
					<!-- 歌曲列表模块 -->
					<view @click="toPlay(item.id)" class="music-list-item" v-for="(item,index) in playList.tracks" :key="item.id">
						<view class="music-list-top">{{index + 1}}</view>
						<view class="music-list-song">
							<view>{{item.name}}</view>
							<view>
								<image 
								v-if="privileges[index].flag > 60 && privileges[index].flag < 70"
								src="~@/static/dujia.png"></image>
								<image 
								v-if="privileges[index].maxbr == 999000"
								src="~@/static/sq.png"></image>
								{{item.ar[0].name}} - {{item.name}}
							</view>
						</view>
						<u-icon name="play-circle"></u-icon>
						<!-- 回顶部 -->
						<u-back-top :scroll-top="scrollTop" top="600">111</u-back-top>
					</view>
					
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {getListById} from "../../common/api.js"
	
	export default{
		data(){
			return{
				playList:{
					coverImgUrl:'',
					creator:{
						avatarUrl:''
					},
					trackCount:'',
					tracks:[]
				},
				privileges:[],
				// 自定义u-button样式
				btnStyle:{
					width:'330rpx',
					height: '74rpx',
					lineHeight: '74rpx',
					margin: '0 auto',
					textAlign: 'center',
					background: 'rgba(0,0,0,.4)',
					color: 'white',
					fontSize: '28rpx'
				},
				isLoading: true,
				scrollTop: 0
			}
		},
		onLoad(option){
			// console.log("listDetail",option)
			this.getData(option.id)
		},
		// 回顶部回调
		onPageScroll(e){
			console.log(e)
			this.scrollTop = e.scrollTop;
		},
		methods:{
			getData(id){
				getListById(id).then((res)=>{
					// console.log(res.data)
					this.playList = res.data.playlist;
					this.privileges = res.data.privileges
					this.isLoading=false
				})
			},
			toPlay(id){
				// id：歌曲id
				// console.log(id)
				uni.navigateTo({
					url:'../playPage/playPage?id='+id
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.fixbg{
		width: 100%;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		background-size: cover;
		background-position: center 0;
		filter: blur(10px); // 模糊度
		// transform: scale(1.2); // 放大,解决边缘过亮
	}
	.container{
		width: 100%;
		height: calc(100vh - 70px);
		overflow: hidden;
		scroll-view{
			height: 100%;
		}
	}
	.list-head{
		display: flex;
		margin: 30rpx;
		.list-head-img{
			width: 264rpx;
			height: 264rpx;
			border-radius: 30rpx;
			overflow: hidden;
			position: relative;
			margin-right: 42rpx;
			image{
				width: 100%;
				height: 100%;
			}
			.list-head-num{
				position: absolute;
				right: 8rpx;
				top: 8rpx;
				color: white;
				font-size: 26rpx;
			}
		}
		.list-head-text{
			flex: 1;
			color: #f0f2f7;
			view:nth-child(1){
				color: white;
				font-size: 34rpx;
			}
			view:nth-child(2){
				display: flex;
				margin: 20rpx 0;
				align-items: center;
				font-size: 24rpx;
				image{
					width: 54rpx;
					height: 54rpx;
					border-radius: 50%;
					margin-right: 14rpx;
				}
			}
			view:nth-child(3){
				line-height: 34rpx;
				font-size: 22rpx;
				
			}
		}
		
	}
	
	.list-share{
		// width: 330rpx;
		// height: 74rpx;
		// line-height: 74rpx;
		// margin:  0 auto;
		// text-align: center;
		// background: rgba(0,0,0,.4);
		// color: white;
		// border-radius: 37rpx;
		// font-size: 28rpx;
		u-icon{
			margin-right: 12rpx;
		}
	}
	
	.music-list{
		background: white;
		border-radius: 50rpx;
		margin-top: 40rpx;
		overflow: hidden;
		.music-list-head{
			display: flex;
			align-items: center;
			height: 50rpx;
			margin: 30rpx 0 70rpx 22rpx;
			text:nth-child(1){
				height: 50rpx;
				font-size: 50rpx;
			}
			text:nth-child(2){
				font-size: 30rpx;
				margin: 0 10rpx 0 26rpx;
			}
			text:nth-child(3){
				font-size: 26rpx;
				color: #b2b2b2;
			}
		}
		.music-list-item{
			display: flex;
			margin: 0 32rpx 66rpx 42rpx;
			align-items: center;
			color: #959595;
			.music-list-top{
				width: 58rpx;
				font-size: 36rpx;
				line-height: 50rpx;
			}
			.music-list-song{
				flex: 1;
				view:nth-child(1){
					font-size: 28rpx;
					color: black;
					width: 70vw;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				view:nth-child(2){
					font-size: 20rpx;
					align-items: center;
					width: 70vw;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					image{
						width: 32rpx;
						height: 20rpx;
						margin-right: 10rpx;
					}
				}
			}
			text{
				font-size: 50rpx;
				color: #c7c7c7;
			}
		}
	}
</style>
