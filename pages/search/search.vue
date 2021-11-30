<template>
	<view class="search">
		<music-head title="搜索" isShowIcon="true"></music-head>
		<!-- 搜索框，可编辑 -->
		<view class="u-m-30">
			<u-search placeholder="输入歌曲名/歌手搜索" animation clearabled :show-action="false" height="70" v-model="keyWords"
				@search="kwdSearch(keyWords)" @change="kwdChange()" @clear="kwdClear()" @focus="focus()" @blur="blur()">
			</u-search>
		</view>
		<view class="container">
			<!-- 滚动模块 -->
			<scroll-view scroll-y="true">
				<!-- 通过searchType的值来判定显示那个模块 -->
				<!-- 默认显示搜索记录和热门搜索 -->
				<view class="search-index" v-if="searchType==1">
					<!-- 搜索记录模块 -->
					<view class="search-history" v-if="hasStroage">
						<view class="search-history-head">
							<text>历史记录</text>
							<view @click="kwdDelete()">
								<u-icon name="trash-fill"></u-icon>
							</view>
						</view>
						<!-- 搜索记录列表 -->
						<view class="search-history-list">
							<view v-for="(item,index) in storageKeyWords" :key='index' @click="kwdSearch(item)">
								{{item}}
							</view>
						</view>
					</view>
					<view class="search-hot">
						<view class="">
							热搜榜
						</view>
						<view class="search-hot-list">
							<view class="search-hot-item" v-for="(item,index) in hotList" :key="index"
								@click="kwdSearch(item.searchWord)">
								<view class="number">
									{{index+1}}
								</view>
								<view class="miaosu">
									{{item.searchWord}}
									<image v-if="item.iconType==1"
										style="width: 42rpx;height: 30rpx;margin-left: 10rpx;"
										src="../../static/hot.gif" mode=""></image>
									<image v-if="item.iconType==5"
										style="width: 16rpx;height: 24rpx;margin-left: 10rpx;" src="../../static/ss.png"
										mode=""></image>
									<view>
										{{item.content}}
									</view>
								</view>
								<view class="hot-number">
									{{item.score}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 点击搜索按钮时显示搜索结果 -->
				<view class="search-result" v-if="searchType==2">
					<view class="search-result-list" v-for="(item,index) in songs" :key="index"
						@click="toPlayPage(item.id)">
						<!-- 关键词和描述 -->
						<view class="search-result-head">
							{{item.name}}
							<view class="search-result-miaoshu">
								<image style="width: 32rpx;height: 20rpx;margin-right: 10rpx;" src="../../static/sq.png"
									mode=""></image>
								{{item.ar[0].name}}-{{item.al.name}}
							</view>
						</view>
						<!-- 播放图标 -->
						<view class="search-result-icon">
							<u-icon name="play-circle"></u-icon>
						</view>
					</view>
					<!-- 回顶部 -->
					<u-back-top :scroll-top="scrollTop" mode="square" top="1000"></u-back-top>
					<view style="margin-top:15px;opacity:0.5">
						<u-loadmore :status="status" :load-text="loadText" @loadmore="loadMore()" />
					</view>
				</view>
				<!-- 输入关键字但未点击搜索按钮时显示搜索提示 -->
				<view class="search-tips" v-if="searchType==3">
					<view class="search-wd" @click="kwdSearch(keyWords)">
						搜索"{{keyWords}}"
					</view>
					<view class="search-tips-list" v-for="(item,index) in allMatch" :key="index"
						@click="kwdSearch(item.keyword)">
						<view>
							<u-icon name="search"></u-icon>
						</view>
						{{item.keyword}}
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		getHotList,
		searchByKw,
		searchSuggestByKw
	} from "../../common/api.js"
	export default {
		data() {
			return {
				searchType: 1,
				keyWords: '',
				storageKeyWords: [],
				hasStroage: false,
				hotList: [],
				songs: [],
				// 搜索建议
				allMatch: [],
				// 
				isFocus: false,
				// 加载更多
				status: 'loadmore',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				// 搜索偏移量
				offset: 0,
				scrollTop: 0
			}
		},
		onLoad() {
			this.getStorage()
		},
		// 回顶部回调
		onPageScroll(e) {
			if (this.searchType == 2) {
				this.debounce(()=>{
					// console.log(e)
					this.scrollTop = e.scrollTop;
				},1000,false)(e)
			}
		},

		methods: {
			getStorage() {
				// 获取缓存中搜索词
				uni.getStorage({
					key: 'storage_key_words',
					success: res => {
						this.storageKeyWords = JSON.parse(res.data)
						if (this.storageKeyWords.length > 0) {
							this.hasStroage = true
						}
						// console.log(JSON.parse(res.data))
					}
				});
				// console.log(this.storageKeyWords)
				getHotList().then(res => {
					this.hotList = res.data.data
					// console.log(this.hotList)
				})
			},
			// 清除缓存
			kwdDelete() {
				uni.showModal({
					title: '提示',
					content: '确认清除历史记录吗？',
					success: res => {
						if (res.confirm) {
							uni.clearStorage()
							this.storageKeyWords = []
							this.hasStroage = false
							// console.log('用户点击确定');
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			},
			// 清空输入
			kwdClear() {
				this.keyWords = ''
				this.searchType = 1
				this.getStorage()
			},
			kwdChange() {
				// 获得焦点时证明用户要输入
				if (this.isFocus) {
					this.debounce(()=>{
						// 搜索改变时，发送请求，改变searchType值=3
						searchSuggestByKw(this.keyWords).then(res => {
							if (res.data.code == 200) {
								this.allMatch = res.data.result.allMatch
								this.searchType = 3
							} else { //code=400时
								this.searchType = 1
								this.getStorage()
							}
						})
					},500,false)()
				}
			},
			// 搜索框获得焦点回调
			focus() {
				this.isFocus = true
			},
			// 搜索框失去焦点回调
			blur() {
				this.isFocus = false
			},
			kwdSearch(kw) {
				this.keyWords = kw
				// 1.根据搜索词跳转结果页searchType==2
				searchByKw(kw, this.offset).then(res => {
					this.songs = res.data.result.songs
					if (this.songs.length >= res.data.result.songCount) {
						this.status = 'nomore'
					}
				})
				this.searchType = 2
				// 2.点击搜索时，存储搜索词
				this.storageKeyWords.unshift(kw)
				let letters = new Set(this.storageKeyWords)
				letters = Array.from(letters)
				// console.log("letters",letters)
				let jsons = JSON.stringify(letters)
				// console.log(jsons)
				uni.setStorage({
					key: 'storage_key_words',
					data: jsons,
					success: res => {
						// console.log('success');
						this.hasStroage = true
					}
				});
			},
			toPlayPage(id) {
				uni.navigateTo({
					url: '../playPage/playPage?id=' + id
				})
			},
			// 加载更多搜索列表
			loadMore() {
				this.status = 'loading'
				this.offset++
				searchByKw(this.keyWords, this.offset).then(res => {
					this.songs.push(...res.data.result.songs)
					if (this.songs.length >= res.data.result.songCount) {
						this.status = 'nomore'
					} else {
						this.status = "loadmore"
					}
				})
			},
			onReachBottom() {
				if (this.searchType == 2) {
					this.status = 'loading'
					this.offset++
					searchByKw(this.keyWords, this.offset).then(res => {
						this.songs.push(...res.data.result.songs)
						if (this.songs.length >= res.data.result.songCount) {
							this.status = 'nomore'
						} else {
							this.status = "loadmore"
						}
					})
				}
			},
			/**
			 * @desc  函数防抖---“立即执行版本” 和 “非立即执行版本” 的组合版本
			 * @param  func 需要执行的函数
			 * @param  wait 延迟执行时间（毫秒）
			 * @param  immediate---true 表立即执行，false 表非立即执行
			 **/
			debounce(func, wait, immediate) {
				// console.log(func)
				let timer = null;

				return function() {
					let context = this;
					let args = arguments;

					if (timer) clearTimeout(timer);
					if (immediate) {
						var callNow = !timer;
						timer = setTimeout(() => {
							timer = null;
						}, wait)
						if (callNow) func.apply(context, args)
					} else {
						timer = setTimeout(function() {
							func.apply(context, args)
						}, wait);
					}
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		width: 92%;
		margin: 0 auto;
	}

	.search-index {
		.search-history {
			font-size: 32rpx;

			.search-history-head {
				display: flex;
				justify-content: space-between;

				view {
					opacity: 0.8;
				}
			}

			.search-history-list {
				margin-top: 15rpx;
				display: flex;
				flex-wrap: wrap;
				margin-bottom: 36rpx;

				view {
					margin: 10rpx 20rpx 10rpx 0;
					padding: 10rpx 20rpx;
					border-radius: 50rpx;
					background-color: #ebebeb;
					text-align: center;
				}
			}
		}

		.search-hot {
			font-size: 32rpx;

			.search-hot-list {
				margin-top: 12rpx;

				.search-hot-item {
					margin-bottom: 36rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.number {
						width: 75rpx;
					}

					.miaosu {
						flex: 1;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;

						view:last-child {
							margin-top: 8rpx;
							font-size: 24rpx;
							opacity: 0.7;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
						}
					}

					.hot-number {
						font-size: 24rpx;
						opacity: 0.7;
					}
				}
			}
		}
	}

	// searchType=2时
	.search-result {
		font-size: 32rpx;

		// position: relative;
		.search-result-list {
			display: flex;
			border-bottom: 2rpx solid #d6dae3;
			align-items: center;

			.search-result-head {
				margin-top: 30rpx;
				margin-bottom: 10rpx;
				flex: 1;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;

				// 描述
				.search-result-miaoshu {
					color: #999999;
					margin-top: 10rpx;
					font-size: 24rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			// 播放图标
			.search-result-icon {
				font-size: 60rpx;
				opacity: 0.2;
			}
		}

		// .search-result-list::after {
		//   content: "----------";
		//   position: absolute;
		// }
	}

	// searchType=3时
	.search-tips {
		font-size: 30rpx;

		.search-wd {
			color: #2B85E4;
			margin: 10rpx 0;
		}

		.search-tips-list {
			margin-top: 36rpx;
			opacity: 0.6;

			view:first-child {
				width: 50rpx;
				font-size: 35rpx;
			}

			display: flex;
		}
	}
</style>
