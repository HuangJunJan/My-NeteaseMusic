<template>
	<view>
		<!-- 背景 -->
		<view class="fixbg" :style="{'background-image': 'url(' + songs.al.picUrl + ')'}"></view>
		<!-- 遮罩 -->
		<view class="shade"></view>
		<!-- 头部 -->
		<music-head :title="songs.name" :isShowIcon="true" textColor="white"></music-head>
		<view class="container" v-if="!isLoading">
			<scroll-view scroll-y="true">
				<!-- 播放器模块 -->
				<view class="detail-play">
					<image :class="{'detail-play-run' : isPlayRotate}" :src="songs.al.picUrl">
					</image>
					<u-icon class="u-icon" :name="isPlay ? 'pause-circle':'play-circle'" @click="switchPlay"></u-icon>
					<view class="bg-gun"></view>
				</view>
				<!-- 歌词模块 -->
				<view class="detail-lyric">
					<!-- 让歌词滚动 transform动画函数 translateY y轴滚动 滚动位置是当前歌曲的索引-1 然后*行高 -->
					<view class="detail-lyric-wrap" :style="{transform:'translateY('+ -(lyricIndex - 1) * 82 +'rpx)'}">
						<!-- 是H5平台 -->
						<!-- #ifdef H5 -->
						<scroolText class="detail-lyric-item" :class="{active:lyricIndex == index}"
							v-for="(item,index) in lyric" :key="index">
							{{item.lyric}}
						</scroolText>
						<!-- #endif -->
						
						<!-- #ifndef H5 -->
						<view class="detail-lyric-item" :class="{active:lyricIndex == index}"
							v-for="(item,index) in lyric" :key="index">
							{{item.lyric}}
						</view>
						<!-- #endif -->
						
					</view>
				</view>
				<!-- 相似歌曲模块 -->
				<view class="detail-simi">
					<view class="detail-simi-head">
						<text>喜欢这首歌的人也听</text>
						<view class="simi-head-icon" @click="listenSimi()">
							<u-icon name="play-circle"></u-icon>
							一键收听
						</view>
					</view>
					<view class="detail-simi-song">
						<!-- <view class="simi-item">
							<view>
								<image src="../../static/logo.png" mode=""></image>
							</view>
							<view class="simi-item-text">
								<view>岁月神偷岁月神偷岁月神偷岁月神偷岁月神偷岁月神偷岁月神偷</view>
								<view>
									<image
									v-if="privileges[index].flag > 60 && privileges[index].flag < 70"
									src="~@/static/dujia.png"></image>
									<image 
									v-if="privileges[index].maxbr == 999000"
									src="~@/static/sq.png"></image>
									完美世界完美世界完美世界完美世界完美世界完美世界
								</view>

							</view>
							<u-icon class="simi-item-icon" name="play-circle"></u-icon>
						</view> -->
						<view class="simi-item" v-for="(item,index) in simiSong" :key="item.id"
							@click="toPlay(item.id)">
							<view>
								<image :src="item.album.picUrl" mode=""></image>
							</view>
							<view class="simi-item-text">
								<view>{{item.name}}</view>
								<view>
									<image v-if="item.privilege.flag > 60 && item.privilege.flag < 70"
										src="~@/static/dujia.png"></image>
									<image v-if="item.privilege.maxbr == 999000" src="~@/static/sq.png"></image>
									{{item.zuozhe}}-{{item.album.artists[0].name}}
								</view>

							</view>
							<u-icon class="simi-item-icon" name="play-circle"></u-icon>
						</view>
					</view>
				</view>
				<!-- 歌曲评论模块 -->
				<view class="detail-comment">
					<view class="detail-comment-head">
						精彩评论
					</view>
					<view class="detail-comment-item" v-for="item in comment" :key="item.commentId">
						<!-- 用户头像 -->
						<view>
							<image :src="item.user.avatarUrl" mode=""></image>
						</view>
						<!-- 文本内容 -->
						<view class="detail-comment-content">
							<view class="detail-comment-title">
								<view class="detail-comment-name">
									<view>{{item.user.nickname}}</view>
									<!-- 使用全局过滤器 formatime-->
									<view>{{item.time | formatime}}</view>
								</view>
								<!-- 点赞模块 -->
								<view class="detail-comment-link">
									<!-- 使用全局过滤器 formatCount-->
									{{item.likedCount}}
									<u-icon class="icon" name="thumb-up"></u-icon>
								</view>
							</view>
							<view v-if="item.beReplied.length ==0" class="detail-comment-text">
								{{item.content}}
							</view>
							<view v-else class="detail-comment-text">
								回复@{{item.beReplied[0].user.nickname}}: {{item.content}}
								<view class="comment-reply">
									@{{item.beReplied[0].user.nickname}}: {{item.beReplied[0].content}}
								</view>
							</view>
						</view>
					</view>
					<u-loadmore color="#bfbfc1" :status="status" :loadText="loadText" @loadmore="getMoreList(songId)"/>
				</view>
			</scroll-view>
		</view>
		
		<!-- 控制模块 -->
		<view class="control">
			<view class="control-left" @click="setVolume()">
				<image src="../../static/音量.png" mode=""></image>
			</view>
			<view class="control-center">
				<view class="center-shang" @click="shangSong()">
					<image src="../../static/shangsong.png" mode=""></image>
				</view>
				<view class="center-play" @click="playSong()">
					<image v-if="!isPlay" src="../../static/play.png" mode=""></image>
					<image v-if="isPlay" src="../../static/zanting.png" mode=""></image>
				</view>
				<view class="center-xia" @click="xiaSong()">
					<image src="../../static/xiasong.png" mode=""></image>
				</view>
			</view>
			<view @click="songList()" class="control-right">
				<image src="../../static/songlist.png" mode=""></image>
			</view>
		</view>
		<!-- 弹出层歌曲列表 -->
		<view>
			<u-popup v-model="show" mode="bottom" :custom-style="popupStyle">
				<view class="popup-content">
					<scroll-view scroll-y="true" style="height: 450rpx;">
						<view class="popup-item" v-for="(item,index) in storeSongList" :key="item.id">
							
							<view class="popup-song-name" @click="toPlay(item.id)" :class="[item.id==songId?'popup-item-active':'']">
								<image v-if="item.id == songId" style="width: 36rpx;height: 36rpx;" src="../../static/dance.gif" mode=""></image>
								{{item.name}}
								<view class="popup-song-singer">
									- {{item.singer}}
								</view>
							</view>
							
							<view class="popup-song-close" @click="deleteSong(index)">
								<image style="width: 36rpx;height: 36rpx;opacity: 0.3;" src="../../static/close.png" mode=""></image>
							</view>
						</view>
					</scroll-view>
				</view>
			</u-popup>
		</view>
		
	</view>
</template>

<script>
	import {
		getSongById,
		getSongUrl,
		getLyricById,
		getSimiSong,
		getCommentById
	} from "../../common/api.js"
	import scroolText from "../../components/scroll-text/scroll-text.vue"
	export default {
		components:{ scroolText },
		data() {
			return {
				songs: { // 歌曲信息 有些值要写出来，防止页面刷新，报未定义
					al: {
						picUrl: ''
					},
					songUrl: ''
				},
				songId: '', //当前播放歌曲id
				simiSong: [], // 猜你喜欢歌曲
				comment: [], // 歌曲评论信息
				lyric: [], // 歌词
				lyricIndex: 0, // 歌词状态,
				isPlay: true,
				isPlayRotate: true,
				status: 'loadmore', //加载更多状态
				loadText: {
					loadmore: '点击加载更多',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				// 模拟评论加载更多，默认没有加载完
				isLoaded: false,
				isLoading: true,
				show: false,// 控制歌曲列表弹出层
				popupStyle:{
					marginBottom: '46px',
					textAlign:'center'
					// color: 'white'
				},
				storeSongList:[] //全局播放列表
			}
		},
		onLoad(option) {
			// console.log("playPageSongId",option.id)
			this.songId = option.id
			this.getSongDeail(option.id)
			
		},
		onHide() {
			this.clearLyricIndex() // 移除定时器
			// #ifdef H5
			this.bgAudioManager.destroy(); // 销毁当前实例
			// #endif

		},
		onUnload() {
			this.clearLyricIndex() // 移除定时器
			// #ifdef H5
			this.bgAudioManager.destroy(); // 销毁当前实例
			// #endif
		},
		methods: {
			// 获取歌曲当前页所有详情数据
			async getSongDeail(songId) {
				uni.showLoading({
					title: "加载中..."
				})
				// 获取歌曲详情
				await getSongById(songId).then((res) => {
					this.songs = res.data.songs[0]
					// console.log(this.songs)
					this.loadUnshiftSong()
				});
				this.getStoreSongList()//取仓库里面的全局播放列表
				// 歌曲播放地址
				await getSongUrl(songId).then((res) => {
					this.songs.songUrl = res.data.data[0].url
				});
				// 获取歌词
				await getLyricById(songId).then(res => {
					// console.log("getLyricById",res.data)
					this.lyric = res.data.lrc.lyric
				})
				this.isLoading = false
				uni.hideLoading();
				// 处理歌词
				this.handleLyric(this.lyric)
				// console.log(this.songs)
				// 调用播放音乐方法
				this.playMusic(this.songs)
				// 相似歌曲、猜你喜欢
				await getSimiSong(songId).then(res => {
					this.simiSong = res.data.songs
					if (this.simiSong) {
						for (let i = 0; i < this.simiSong.length; i++) {
							let zuozhe = ''
							for (let j = 0; j < this.simiSong[i].artists.length; j++) {
								zuozhe += this.simiSong[i].artists[j].name
								if (j != this.simiSong[i].artists.length - 1) {
									zuozhe += '/'
								}
							}
							this.simiSong[i].zuozhe = zuozhe
						}
					}
					// console.log(this.simiSong)
				})
				// 获取热门评论
				await getCommentById(songId).then(res => {
					// console.log(res.data)
					this.comment = res.data.hotComments
					// handleReplyComment()
				})
				
			},
			// 播放开关
			switchPlay() {
				if (this.bgAudioManager.paused) {
					this.isPlay = true
					this.isPlayRotate = true
					this.bgAudioManager.play(); // 调用播放事件
					console.log("触发播放")
				} else {
					this.isPlay = false
					this.isPlayRotate = false
					this.clearLyricIndex()
					this.bgAudioManager.pause(); // 调用暂停事件
					console.log("触发暂停")
				}
			},
			// 播放音乐
			playMusic(data) {
				// console.log("playMusic")
				// 非h5平台
				// #ifndef H5
				this.bgAudioManager = uni.getBackgroundAudioManager();
				this.bgAudioManager.title = data.name;
				this.bgAudioManager.singer = data.ar.name;
				this.bgAudioManager.coverImgUrl = data.al.picUrl;
				// #endif

				// 只当是h5平台
				// #ifdef H5
				if (!this.bgAudioManager) {
					this.bgAudioManager = uni.createInnerAudioContext();
				}
				this.bgAudioManager.autoplay = true;
				// #endif
				this.bgAudioManager.src = data.songUrl || '';
				this.handleLyricIndex(this.lyricIndex)
				// 播放事件
				this.bgAudioManager.onPlay(() => {
					this.handleLyricIndex(this.lyricIndex)
					console.log('播放回调');
				});
				// 播放暂停
				this.bgAudioManager.onPause(() => {
					console.log("暂停回调");
				});
				// 播放完
				this.bgAudioManager.onEnded(() => {
					// onEnded 播放事件结束
					this.isPlay = false
					this.isPlayRotate = false
					this.clearLyricIndex()
					this.xiaSong()
					console.log("结束回调")
					// this.getData(this.vuex_nextId)
				})
			},
			// 处理歌词
			handleLyric(lyric) {
				// 利用正则筛选
				let re = /\[([^\]]+)\]([^\[]+)/g;
				var result = [];
				// console.log(lyric)
				// $1 第一个正则的匹配结果 
				// $2 第一个正则的匹配结果 
				lyric.replace(re, ($0, $1, $2) => {
					if(!($2 == 'undefined' || !$2 || !/[^\s]/.test($2))){
						result.push({
							"time": this.formatTimeToSec($1),
							"lyric": $2
						})
					}
				})
				this.lyric = result
				// console.log(this.lyric)
			},
			// 格式化歌词时间
			formatTimeToSec(value) {
				// 对我们的歌词时间进行切割
				let arr = value.split(':');
				// 分钟*60 =秒 + 秒
				return (parseFloat(arr[0] * 60) + parseFloat(arr[1])).toFixed(1);
			},
			// 当前高亮歌词的下标
			handleLyricIndex(lyricIndex) {
				clearInterval(this.timer); // 移除定时器
				this.timer = setInterval(() => {
					// 循环遍历我们的歌词和歌词时间轴
					for (var i = this.lyricIndex; i < this.lyric.length; i++) {
						// 判断播放时间事件的时间超出我们的歌曲时间
						if (this.bgAudioManager.currentTime > this.lyric[this.lyric.length - 1].time) {
							this.lyricIndex = this.lyric.length - 1
							break;
						}
						// 对我们的歌词进行判断，如果当前时间轴大于当前歌词时间轴和小于下一个歌词时间轴
						if (this.bgAudioManager.currentTime > this.lyric[i].time && this.bgAudioManager
							.currentTime < this.lyric[i + 1].time) {
							// 当前时间轴歌词高亮状态
							this.lyricIndex = i;
						}
					}
					// console.log(this.lyric[this.lyricIndex].lyric);
				}, 500)
			},
			// 清除定时器
			clearLyricIndex() {
				clearInterval(this.timer); // 移除定时器
			},
			toPlay(id) {
				// id：歌曲id
				// console.log(id)
				uni.redirectTo({
					url: '../playPage/playPage?id=' + id
				})
			},
			
			// 模拟分页加载更多
			async getMoreList(songId){
				// console.log("getMoreList")
				if(this.isLoaded){
					this.status = 'nomore';
					return;
				}
				this.status = 'loading';
				// 获取热门评论
				await getCommentById(songId).then(res => {
					// console.log(res.data)
					this.comment.push(...res.data.comments)
					// handleReplyComment()
				})
				// console.log(this.comment);
				this.isLoaded = true;
				this.status = 'nomore';
			},
			
			// 一键收听
			listenSimi(){
				// console.log(this.simiSong)
				let simiArr = []
				for (var i = 0; i < this.simiSong.length; i++) {
					let obj = {}
					obj.id = this.simiSong[i].id
					obj.name = this.simiSong[i].name
					obj.singer = this.simiSong[i].zuozhe
					simiArr.push(obj)
				}
				this.$store.commit('unshiftSong',simiArr)
				this.getStoreSongList()
				this.toPlay(simiArr[0].id)
			},
			
			// 获得vuex中songList的值
			getStoreSongList(){
				this.storeSongList  = this.$store.state.songList
			},
			// 页面加载时头部插入当前点击歌曲
			loadUnshiftSong(){
				let obj = [{id:this.songs.id,
					name:this.songs.name,
					singer:this.songs.ar[0].name,
				}]
				this.$store.commit('unshiftSong',obj)
			},
			// 
			deleteSong(index){
				this.$store.commit('deleteSong',index)
			},
			// 控制器事件
			setVolume(){// 设置音量
				console.log("setVolume")
			},
			playSong(){// 播放/暂停
				// console.log("playSong")
				this.switchPlay()
			},
			
			shangSong(){// 上一首
				let InnerAudioContext = wx.createInnerAudioContext
				console.log(this.bgAudioManager.volume,InnerAudioContext.volume)
				let index = 0
				for (let i = 0; i < this.storeSongList.length; i++) {
					if(this.storeSongList[i].id == this.songId){
						index = i
						break
					}
				}
				
				if(index<=0){
					uni.showToast({
						title: '当前歌曲已是第一首',
						icon: 'none',
						mask: true,
						position: 'center'
					})
				}else{
					this.toPlay(this.storeSongList[index-1].id)
				}
				// console.log(index,this.songId,this.storeSongList)
			},
			
			xiaSong(){// 下一首
				let index = 0
				for (let i = 0; i < this.storeSongList.length; i++) {
					if(this.storeSongList[i].id == this.songId){
						index = i
						break
					}
				}
				
				if(index>=this.storeSongList.length-1){
					uni.showToast({
						title: '当前歌曲已是最后一首',
						icon: 'none',
						mask: true,
						position: 'center'
					})
				}else{
					this.toPlay(this.storeSongList[index+1].id)
				}
			},
			
			songList(){// 播放列表
				this.getStoreSongList()
				this.show = true
			}
		},
		computed:{
			
		}
	}
</script>

<style scoped lang="scss">
	.fixbg {
		width: 100%;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		background-size: cover;
		background-position: center 0;
		filter: blur(20px); // 模糊度
		transform: scale(1.2); // 放大
	}

	.container {
		width: 100%;
		height: calc(100vh - 120px);//120-75=45
		overflow: hidden;

		scroll-view {
			height: 100%;
		}
	}

	// 遮罩层
	.shade {
		width: 100%;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		background-color: black;
		-moz-opacity: 0.3;
		opacity: .3;
		filter: alpha(opacity=10);
	}

	.detail-play {
		width: 580rpx;
		height: 580rpx;
		background: url(~@/static/images/disc.png);
		background-size: cover;
		margin: 214rpx auto 0 auto;
		position: relative;

		image {
			width: 370rpx;
			height: 370rpx;
			border-radius: 50%;
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			right: 0;
			margin: auto;
			// 图片旋转
			animation: 10s linear move infinite; // 10秒 匀速 无限循环
			animation-play-state: paused; // 停止旋转
		}

		.detail-play-run {
			animation-play-state: running; // 开始旋转
		}

		// 自定义动画函数
		@keyframes move {
			from {
				transform: rotate(0deg);
			}

			to {
				transform: rotate(360deg);
			}
		}

		.u-icon {
			width: 100rpx;
			height: 100rpx;
			font-size: 100rpx;
			color: white;
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			right: 0;
			margin: auto;
		}

		.bg-gun {
			width: 230rpx;
			height: 360rpx;
			background: url(~@/static/images/needle.png);
			background-size: cover;
			position: absolute;
			left: 130rpx;
			top: -580rpx;
			bottom: 0;
			right: 0;
			margin: auto;
		}
	}

	.detail-lyric {
		font-size: 32rpx;
		line-height: 82rpx;
		height: 246rpx;
		text-align: center;
		overflow: hidden;
		color: rgba(255, 255, 255, .6);

		.detail-lyric-wrap {

			.detail-lyric-item {
				height: 82rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			.active {
				color: white;
			}
		}
	}

	.detail-simi {
		width: 680rpx;
		margin: 0 auto;
		margin-top: 60rpx;

		.detail-simi-head {
			height: 60rpx;
			line-height: 60rpx;
			display: flex;
			justify-content: space-between;
			font-size: 36rpx;
			color: white;
			margin-bottom: 36rpx;

			.simi-head-icon {
				width: 180rpx;
				border-radius: 30rpx;
				border: 1px solid #c0c0c052;
				font-size: 28rpx;
				text-align: center;
			}
		}

		.detail-simi-song {
			font-size: 36rpx;
			color: white;

			.simi-item {
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;

				image {
					width: 100rpx;
					height: 100rpx;
					margin-right: 24rpx;
				}

				.simi-item-text {
					flex: 1;

					view:nth-child(1) {
						font-size: 34rpx;
						width: 65vw;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					view:nth-child(2) {
						font-size: 20rpx;
						color: #C0C4CC;
						align-items: center;
						width: 65vw;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;

						image {
							width: 32rpx;
							height: 20rpx;
							margin-right: 10rpx;
						}
					}
				}

				.simi-item-icon {
					width: 50rpx;
					height: 50rpx;
					font-size: 56rpx;
					opacity: 0.5;
					color: white;
				}
			}
		}
	}


	.detail-comment {
		width: 680rpx;
		margin: 0 auto;

		.detail-comment-head {
			font-size: 36rpx;
			margin-bottom: 40rpx;
			color: white;
		}

		.detail-comment-item {
			display: flex;
			width: 100%;
			margin-bottom: 30rpx;

			image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 16rpx;
			}

			.detail-comment-content {
				flex: 1;

				.detail-comment-title {
					opacity: 0.8;
					display: flex;
					justify-content: space-between; // 左右两端对齐

					.detail-comment-name {
						view:nth-child(1) {
							font-size: 26rpx;
							color: white;
						}

						view:nth-child(2) {
							color: #cbcacf;
							font-size: 20rpx;
						}
					}

					.detail-comment-link {
						font-size: 28rpx;
						color: #cbcacf;
						opacity: 0.7;

						.icon {
							margin-left: 8rpx;
							font-size: 36rpx;
						}
					}
				}

				.detail-comment-text {
					font-size: 28rpx;
					line-height: 48rpx;
					color: white;
					opacity: 0.8;
					margin-top: 20rpx;
					border-bottom: 1px #e0e0e0 solid;
					padding-bottom: 40rpx;

					.comment-reply {
						margin-top: 10rpx;
						color: white;
						border-radius: 3px;
						border: 1px solid rgba($color: #F4F4F4, $alpha: 0.5);
						background-color: rgba($color: #C0C0C0, $alpha: 0.2);
						filter: alpha(opacity=10);
						padding: 10rpx;
					}
				}
			}
		}
	}
	
	.control{
		position: fixed;
		bottom: 0;
		z-index: 999;
		height: 45px;//120-75=45
		width: 100%;
		display: flex;
		// border-top: 1px solid #c8c7cc;
		image{
			width: 60rpx;
			height: 60rpx;
		}
		.control-left{
			border-top: 1px solid #c8c7cc38;
			width: 150rpx;
			padding-top: 15rpx;
			text-align: center;
		}
		.control-center{
			display: flex;
			flex: 1;
			align-items: center;
			justify-content: space-around;
			padding: 0 36rpx;
			border-top: 1px solid #c8c7cc38;
			border-right: 1px solid #c8c7cc38;
			border-left: 1px solid #c8c7cc38;
			.center-shang{}
			.center-play{
				
			}
			.center-xia{}
		}
		.control-right{
			border-top: 1px solid #c8c7cc38;
			width: 150rpx;
			padding-top: 15rpx;
			text-align: center;
		}
	}
	
	.popup-content{
		.popup-item{
			display: flex;
			align-items: flex-end;
			justify-content: space-around;
			height: 60rpx;
			margin-bottom: 3rpx;
			.popup-song-name{
				width: 500rpx;
				text-align: left;
				font-size: 32rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				color: rgba($color: #959595, $alpha: 1.0);
				.popup-song-singer{
					display: inline;
					font-size: 25rpx;
					color: rgba($color: #d0d0d0, $alpha: 0.8);
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
			.popup-item-active{
				color: rgba($color: #ff3957, $alpha: 1.0);
			}
			
			.popup-song-close{
				width: 100rpx;
			}
		}
		
	}
</style>
