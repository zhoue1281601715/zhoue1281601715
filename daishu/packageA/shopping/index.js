/**
 * 如果位目录层数大于两级需要修改路径
 */
const { $Toast, $Message } = require('../../utils/iview/base/index');
import Tools from '../../utils/modules/Tools';
import Config from '../../config';
import utils from '../../utils/utils';

const app = getApp();

Page({
	data: {
		activeIdx: -1,
		banner:'', // banner图
		categoryList:'', // 
		hotList:'',
		newList:'',
		goodsList:'',
		modal : {
			tips : '提示',
			message : '模态框说明',
			ok : 'modalOk',
			cancel : 'modalCancel',
			ishide : true
		},
	
		// --  分页配置数据  -------- 
		page: {
			url: '/',
			data: {
				page: 1,
			}
		},
		isEnd: false,
		// ------------------------- 
		thisPage: 1,
		lastPage: 1,
		leftHight: 0, // 商品列表左边高度
		rightHight: 0, // 商品列表右边高度
	},

	// 获取商城首页
  getShoppingMallIndex () {
    let that = this
		let token = wx.getStorageSync('token')
		wx.showLoading({
			title: '加载中',
		})
    app.http({
      config: {
        url: 'api/v1/shop_index',
        data: {
					token,
					page: that.data.thisPage
				},
        method: 'POST'
      },
      isAuth: false
    }).then(res => {
			console.log(res, 'shoppingMallIndexRes')
			const resData = res.data.data
			const categoryList = resData.categoryList
			const banner = resData.banner
			const goodsList = that.data.goodsList.length > 0 ? that.data.goodsList.concat(resData.goodsList.data) : resData.goodsList.data
			const hotList = resData.hotList
			const newList = resData.newList
			const lastPage = resData.goodsList.last_page
			that.setData({
				categoryList,
				banner,
				goodsList,
				lastPage,
				hotList,
				newList,
			}, function () {
				wx.hideLoading()
			})
			console.log('categoryList', categoryList)
			console.log('banner', banner)
			console.log('goodsList', goodsList)
			console.log('hotList', hotList)
			console.log('newList', newList)
    }).catch(err => {
			console.log(err, 'shoppingMallIndexErr')
			if (err.data.code == 401) {
				wx.navigateTo({
					url: '/packageC/login/index',
				})
			}
    })
	},
	
	/**
	 * 搜索商品
	 * @param {商品名称} e 
	 */
	handleSearchGoods (e) {
		let that = this
		let token = wx.getStorageSync('token')
		let keyword = e.detail.value
		console.log('keyword', keyword)
		that.setData({
			thisPage: 1,
			lastPage: 1,
			goodsList: []
		}, () => {
			wx.showLoading({
				title: '搜索中',
			})
			app.http({
				config: {
					url: 'api/v1/search_goods',
					data: {
						token,
						keyword,
						page: that.data.thisPage
					},
					method: 'POST'
				},
				isAuth: false
			}).then(res => {
				console.log(res, 'searchGoodsListRes')
				const goodsList = that.data.goodsList.length > 0 ? that.data.goodsList.concat(res.data.data.data) : res.data.data.data
				const lastPage = res.data.data.last_page
				that.setData({
					goodsList,
					lastPage
				}, function () {
					wx.hideLoading()
				})
			}).catch(err => {
				console.log(err, 'searchGoodsListErr')
			})
		})
	},

	onLoad (query){
		let that = this
		app.setTitle('填个标题吧')
		that.getShoppingMallIndex()
	},

	onShow (){
		
	},
	


	/*============================================
	 			     以下是基本操作 				
	==============================================*/ 

	...utils,  // mixin方法

	trigger (e){
		app.trigger(e, this);
	},

	modalCancel (){
		this.setData({
			'modal.ishide' : true
		})
	},

	modalOk (){
		this.setData({
			'modal.ishide' : true
		})
	},

	/**
	 * 触底分页 (需要分页的请反我牌)
	 */
	onReachBottom() {
		const that = this
		let { thisPage, lastPage, keyword } = that.data
		if (keyword) {
			if (thisPage < lastPage) {
				thisPage += 1
				that.setData({
					thisPage
				}, () => {
					that.handleSearchGoods()
				})
			}
		} else {
			if (thisPage < lastPage) {
				thisPage += 1
				that.setData({
					thisPage
				}, () => {
					that.getShoppingMallIndex()
				})
			}
		}
	},

	/**
	 * 分页返回数据 (需要分页的请反我牌)
	 */
	pageSuccess(e) {
		this.setData({
		  list: e.detail.list,
		  isEnd: e.detail.isEnd
		})
	},
	
	pageFail(e) {
		
	},

	pageStart(e) {
		
	},

	/**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
