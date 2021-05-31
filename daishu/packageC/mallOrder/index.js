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
		orderList: [], // 订单列表
		thisPage: 1, // 当前页
		lastPage: 1, // 最后一页
		navList: ['待付款', '待发货', '待收货', '待评价', '已完成'], // 导航列表
		currentTab: 0, // 展示区间
		showPopup: false, // 显示/关闭弹窗
		popupPositionBottom: -800, // 弹窗下定位值
		unique: '', // 订单唯一识别ID
		totalPrice: 0, // 订单总价
		toastParameter: {}, // 自定义toast参数
	},

	/**
	 * 获取订单列表
	 */
	getOrderList () {
		let that = this
		let token = wx.getStorageSync('token')
		let paid = ''
		let order_status = ''
		let currentTab = that.data.currentTab
		switch (currentTab) {
			case 0:
				paid = 0
				order_status = 0
				break;
			case 1:
				paid = 1
				order_status = 0
				break;
			case 2:
				paid = 1
				order_status = 1
				break;
			case 3:
				paid = 1
				order_status = 2
				break;
			case 4:
				paid = 1
				order_status = 3
				break;
		}
		wx.showLoading({
			title: '加载中',
		})
		app.http({
			config: {
				url: 'api/v1/order_list',
				data: {
					token,
					paid,
					order_status,
					page: that.data.thisPage
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'orderListRes')
			const list = res.data.data.list.data
			const lastPage = res.data.data.list.last_page
			list.forEach(item => {
				let total_price = 0
				item.cartitem.forEach(ele => {
					ele.cart_info = JSON.parse(ele.cart_info)
					total_price += ele.cart_info.truePrice
				})
				item.total_price = total_price
			})
			const orderList = that.data.orderList.length > 0 ? that.data.orderList.concat(list) : list
			console.log('orderList', orderList)
			that.setData({
				orderList,
				lastPage
			}, () => {
				wx.hideLoading()
			})
		}).catch(err => {
			console.log(err, 'orderListErr')
			wx.hideLoading()
		})
	},

	/**
	 * 切换Tab导航
	 */
	handleChangeNav (e) {
		const index = e.currentTarget.dataset.index
		const currentTab = this.data.currentTab
		if (currentTab === index) {
			return false
		} else {
			this.setData({
				currentTab: index,
				orderList: [],
				thisPage: 1,
				lastPage: 1
			}, () => {
				this.getOrderList()
			})
		}
	},

	/**
	 * 去付款
	 */
	handleToPay (e) {
		const that = this
		const unique = e.currentTarget.dataset.unique
		const totalPrice = e.currentTarget.dataset.total_price
		that.setData({
			showPopup: true,
		}, () => {
			that.setData({
				popupPositionBottom: 0,
				unique,
				totalPrice
			})
		})
	},

	/**
	 * 隐藏弹窗
	 */
	handleHidePopup () {
		const that = this
		const showPopup = !that.data.showPopup
		that.setData({
			popupPositionBottom: -800
		}, function () {
			setTimeout(() => {
				that.setData({
					showPopup
				})
			}, 300)
		})
	},

	/**
	 * 付款
	 */
	handlePayment (e) {
		const that = this
		const token = wx.getStorageSync('token')
		const { unique, currentTab } = that.data
		const pay_type = e.currentTarget.dataset.pay_type
		switch (pay_type) {
			case 'weixin': // 微信支付
				app.http({
					config: {
						url: 'api/v1/pay_order',
						data: {
							token,
							unique,
							pay_type
						},
						method: 'POST'
					},
					isAuth: true
				}).then(res => {
					console.log(res, 'paymentRes')
					wx.requestPayment({
						timeStamp: res.data.data.timeStamp,
						nonceStr: res.data.data.nonceStr,
						package: res.data.data.package,
						signType: 'MD5',
						paySign: res.data.data.paySign,
						success (res) {
							console.log('paymentSuccess', res)
							that.setData({
								currentTab,
								orderList: [],
								thisPage: 1,
								lastPage: 1,
								popupPositionBottom: -800,
								showPopup: false
							}, () => {
								that.getOrderList()
							})
						},
						fail (res) {
							console.log('paymentFail', res)
						}
					})
				}).catch(err => {
					console.log(err, 'paymentErr')
					wx.showModal({
						title: '提示',
						content: err.data.msg,
						showCancel: false
					})
				})
				break;
			case 'yue': // 余额支付
				wx.showModal({
					title: '提示',
					content: '确认使用余额支付？',
					success (res) {
						if (res.confirm) {
							app.http({
								config: {
									url: 'api/v1/pay_order',
									data: {
										token,
										unique,
										pay_type
									},
									method: 'POST'
								},
								isAuth: true
							}).then(res => {
								console.log(res, 'paymentRes')
								let toastParameter = {
									icon: 'success',
									content: res.data.msg,
									duration: 1500,
								}
								that.setData({
									toastParameter,
								}, function () {
									setTimeout(() => {
										that.setData({
											showPopup: false
										}, () => {
											that.setData({
												currentTab,
												orderList: [],
												thisPage: 1,
												lastPage: 1
											}, () => {
												that.getOrderList()
											})
										})
									}, 1500)
								})
							}).catch(err => {
								console.log(err, 'paymentErr')
								wx.showModal({
									title: '提示',
									content: err.data.msg,
									showCancel: false
								})
							})
						}
					}
				})
				break;
		}
	},

	/**
	 * 删除订单
	 */
	handleDeleteOrder (e) {
		const that = this
		const token = wx.getStorageSync('token')
		const unique = e.currentTarget.dataset.unique
		const currentTab = that.data.currentTab
		wx.showModal({
			title: '提示',
			content: '确定删除此订单？',
			success (res) {
				if (res.confirm) {
					app.http({
						config: {
							url: 'api/v1/delete_order',
							data: {
								token,
								unique
							},
							method: 'POST'
						},
						isAuth: true
					}).then(res => {
						console.log(res, 'deleteOrderRes')
						let toastParameter = {
							icon: 'success',
							content: res.data.msg,
							duration: 1500,
						}
						that.setData({
							toastParameter,
						}, function () {
							setTimeout(() => {
								that.setData({
									currentTab,
									orderList: [],
									thisPage: 1,
									lastPage: 1
								}, () => {
									that.getOrderList()
								})
							}, 1500)
						})
					}).catch(err => {
						console.log(err, 'deleteOrderErr')
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
	 * 确认收货
	 */
	handleConfirmReceipt (e) {
		const that = this
		const token = wx.getStorageSync('token')
		const unique = e.currentTarget.dataset.unique
		const currentTab = that.data.currentTab
		wx.showModal({
			title: '提示',
			content: '确认收货？',
			success (res) {
				if (res.confirm) {
					app.http({
						config: {
							url: 'api/v1/que_order',
							data: {
								token,
								unique
							},
							method: 'POST'
						},
						isAuth: true
					}).then(res => {
						console.log(res, 'confirmRecepitRes')
						let toastParameter = {
							icon: 'success',
							content: res.data.msg,
							duration: 1500,
						}
						that.setData({
							toastParameter,
						}, function () {
							setTimeout(() => {
								that.setData({
									currentTab,
									orderList: [],
									thisPage: 1,
									lastPage: 1
								}, () => {
									that.getOrderList()
								})
							}, 1500)
						})
					}).catch(err => {
						console.log(err, 'confirmRecepitErr')
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
	 * 再次购买 
	 */
	handlePayAgain (e) {
		const token = wx.getStorageSync('token')
		const unique = e.currentTarget.dataset.unique
		app.http({
			config: {
				url: 'api/v1/pay_again',
				data: {
					token,
					unique
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'payAgainRes')
			const cart_id = res.data.data
			app.http({
				config: {
					url: 'api/v1/confirm_order',
					data: {
						cart_id
					},
					method: 'POST'
				},
				isAuth: true
			}).then(res => {
				console.log(res, 'settlementRes')
				const key = res.data.data.orderKey
				wx.navigateTo({
					url: `/packageA/orderConfirmation/index?key=${key}&cart_id=${cart_id}`,
				})
			}).catch(err => {
				console.log(err, 'settlementErr')
				wx.showModal({
					title: '提示',
					content: err.data.msg,
					showCancel: false,
				})
			})
		}).catch(err => {
			console.log(err, 'payAgainErr')
			wx.showModal({
				title: '提示',
				content: err.data.msg,
				showCancel: false
			})
		})
	},

	onLoad (query) {
		app.setTitle('填个标题吧');
		const that = this
		const CustomBar = app.store.custom.CustomBar
		that.setData({
			CustomBar
		})
		console.log('CustomBar', CustomBar)
	},

	onShow () {
		this.setData({
			orderList: []
		})
		this.getOrderList()
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
		let { page, isEnd } = this.data;
	
		if (!isEnd) {
		  this.setData({
			'page.data.page': page.data.page + 1
		  });
		}

		let { thisPage, lastPage } = this.data
		if (thisPage < lastPage) {
			thisPage += 1
			this.setData({
				thisPage
			}, () => {
				this.getOrderList()
			})
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
