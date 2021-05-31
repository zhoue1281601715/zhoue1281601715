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
		CustomBar: 0, // 自定义导航栏高度
		activeIdx: -1,
		navActivityIndex: 0,
		navList: [{id: 0, title: '我的仓票'}, {id: 1, title: '已用仓票'}, {id: 2, title: '过期仓票'}],
		myThisPage: 1, // 我的仓票当前页
		myLastPage: 1, // 我的仓票最后一页
		usedThisPage: 1, // 已用仓票当前页
		usedLastPage: 1, // 已用仓票最后一页
		expiredThisPage: 1, // 过期仓票当前页
		expiredLastPage: 1, // 过期仓票最后一页
		myStockList: [], // 我的仓票
		usedStockList: [], // 已用仓票
		expiredStockList: [], // 过期仓票
		toastParameter: {}, // 自定义toast参数
	},

	/**
	 * 切换导航栏
	 */
	handleChangeNav(e) {
		const navActivityIndex = e.currentTarget.dataset.index
		this.setData({
			navActivityIndex
		})
	},

	/**
	 * 获取用户的仓票(我的仓票)
	 */
	getMyStock() {
		const that = this
		const token = wx.getStorageSync('token')
		app.http({
			config: {
				url: 'api/v1/user_stock',
				data: {
					token,
					type: 0,
					page: that.data.myThisPage
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'myStockRes')
			let data = res.data.data.data
			let myLastPage = res.data.data.last_page
			data.forEach(element => {
				element.get_money = Number(element.get_money)
			})
			let myStockList = that.data.myStockList.length > 0 ? that.data.myStockList.concat(data) : data
			that.setData({
				myStockList,
				myLastPage
			})
		}).catch(err => {
			console.log(err, 'myStockErr')
		})
	},

	/**
	 * 获取用户的仓票(已用仓票)
	 */
	getUsedStock() {
		const that = this
		const token = wx.getStorageSync('token')
		app.http({
			config: {
				url: 'api/v1/user_stock',
				data: {
					token,
					type: 1,
					page: that.data.usedThisPage
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'usedStockRes')
			let data = res.data.data.data
			let usedLastPage = res.data.data.last_page
			data.forEach(element => {
				element.get_money = Number(element.get_money)
			})
			let usedStockList = that.data.usedStockList.length > 0 ? that.data.usedStockList.concat(data) : data
			that.setData({
				usedStockList,
				usedLastPage
			})
		}).catch(err => {
			console.log(err, 'usedStockErr')
		})
	},

	/**
	 * 获取用户的仓票(过期仓票)
	 */
	getExpiredStock() {
		const that = this
		const token = wx.getStorageSync('token')
		app.http({
			config: {
				url: 'api/v1/user_stock',
				data: {
					token,
					type: 2,
					page: that.data.expiredThisPage
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'expiredStockRes')
			let data = res.data.data.data
			let expiredLastPage = res.data.data.last_page
			data.forEach(element => {
				element.get_money = Number(element.get_money)
			})
			let expiredStockList = that.data.expiredStockList.length > 0 ? that.data.expiredStockList.concat(data) : data
			that.setData({
				expiredStockList,
				expiredLastPage
			})
		}).catch(err => {
			console.log(err, 'expiredStockErr')
		})
	},

	/**
	 * 使用仓票
	 */
	handleUseStock (e) {
		const that = this
		const id = e.currentTarget.dataset.id
		const token = wx.getStorageSync('token')
		wx.showModal({
			title: '提示',
			content: '是否开发票？',
			confirmText: '是',
			cancelText: '否',
			success (res) {
				if (res.confirm) {
					app.http({
						config: {
							url: 'api/v1/use_stock',
							data: {
								token,
								id,
								is_bill: 1
							},
							method: 'POST'
						},
						isAuth: true
					}).then(res => {
						console.log(res, 'useStockRes')
						let toastParameter = {
							icon: 'success',
							content: res.data.msg,
							duration: 1500,
						}
						that.setData({
							toastParameter,
							myStockList: [],
							myThisPage: 1,
							myLastPage: 1,
							usedStockList: [],
							usedThisPage: 1,
							usedLastPage: 1
						}, function () {
							setTimeout(() => {
								that.getMyStock()
								that.getUsedStock()
							}, 1500)
						})
					}).catch(err => {
						console.log(err, 'useStockErr')
						wx.showModal({
							title: '提示',
							content: err.data.msg,
							showCancel: false
						})
					})
				} else {
					app.http({
						config: {
							url: 'api/v1/use_stock',
							data: {
								token,
								id,
								is_bill: 0
							},
							method: 'POST'
						},
						isAuth: true
					}).then(res => {
						console.log(res, 'useStockRes')
						let toastParameter = {
							icon: 'success',
							content: res.data.msg,
							duration: 1500,
						}
						that.setData({
							toastParameter,
							myThisPage: 1,
							myLastPage: 1
						}, function () {
							setTimeout(() => {
								that.getMyStock()
							}, 1500)
						})
					}).catch(err => {
						console.log(err, 'useStockErr')
						wx.showModal({
							title: '提示',
							content: err.data.msg,
							showCancel: false
						})
					})
				}
			}
		})
	},

	/**
	 * 仓票回收
	 */
	handleReviewStock (e) {
		const that = this
		const id = e.currentTarget.dataset.id
		const token = wx.getStorageSync('token')
		wx.showModal({
			title: '提示',
			content: '是否申请回收？',
			success (res) {
				if (res.confirm) {
					app.http({
						config: {
							url: 'api/v1/review_stock',
							data: {
								token,
								id
							},
							method: 'POST'
						},
						isAuth: true
					}).then(res => {
						console.log(res, 'reviewStockRes')
						let toastParameter = {
							icon: 'success',
							content: res.data.msg,
							duration: 1500,
						}
						that.setData({
							toastParameter,
							expiredStockList: [],
							expiredThisPage: 1,
							expiredLastPage: 1
						}, function () {
							setTimeout(() => {
								that.getExpiredStock()
							}, 1500)
						})
					}).catch(err => {
						console.log(err, 'reviewStockErr')
						wx.showModal({
							title: '提示',
							content: err.data.msg,
							showCancel: false
						})
					})
				}
			}
		})
	},

	onLoad (query){
		app.setTitle('填个标题吧');
		const that = this
		const CustomBar = app.store.custom.CustomBar
		that.setData({
			CustomBar
		})
		this.getMyStock()
		this.getUsedStock()
		this.getExpiredStock()
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
	switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    console.log(cur)
    var topValue = 192
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth,
      scrollTop: topValue * cur
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },

	/**
	 * 触底分页 (需要分页的请反我牌)
	 */
	onReachBottom() {
		let { page, isEnd } = this.data;
	
		if (!isEnd) {
		  this.setData({
			'page.data.page': page.data.page + 1
		  });
		}

		const that = this
		let { myThisPage, myLastPage, usedThisPage, usedLastPage, expiredThisPage, expiredLastPage, navActivityIndex } = that.data
		switch(navActivityIndex) {
			case 0:
				if (myThisPage < myLastPage) {
					myThisPage += 1
					that.setData({
						myThisPage
					}, () => {
						this.getMyStock()
					})
				}
				break;
			case 1:
				if (usedThisPage < usedLastPage) {
					usedThisPage += 1
					that.setData({
						usedThisPage
					}, () => {
						this.getUsedStock()
					})
				}
				break;
			case 2:
				if (expiredThisPage < expiredLastPage) {
					expiredThisPage += 1
					that.setData({
						expiredThisPage
					}, () => {
						this.getExpiredStock()
					})
				}
				break;
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
