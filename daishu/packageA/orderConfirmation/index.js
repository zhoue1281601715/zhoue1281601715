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
		address_id: '', // 地址ID
		addressDetails: '', // 地址详情
		type: ['自提', '快递'], // 取货方式列表
		typeActivity: 1, // 当前取货方式下标
		showPopup: false, // 显示/关闭弹窗
		popupPositionBottom: -1200, // 弹窗下定位值
		key: '', // 唯一的主键ID
		cart_id_list: [], // 要支付的商品列表的订单ID
		carList: [], // 订单列表
		totalPrice: 0, // 总价
		toastParameter: {}, // 自定义toast参数
		activeIdx: -1,
	},

	/**
   * 获取地址列表
   */
  getAddressList () {
    const that = this
    const token = wx.getStorageSync('token')
    app.http({
      config: {
        url: 'api/v1/list_address',
        data: {
          token
        },
        method: 'POST'
      },
      isAuth: true
    }).then(res => {
      console.log(res, 'addressListRes')
			const addressList = res.data.data.data
			addressList.forEach(element => {
				if (element.is_default === 1) {
					that.setData({
						address_id: element.id
					}, () => {
						that.handleGetAddress()
					})
				}
			})
    }).catch(err => {
      console.log(err, 'addressListErr')
    })
  },

	/**
	 * 获取地址详情
	 */
	handleGetAddress () {
		const that = this
    const token = wx.getStorageSync('token')
    app.http({
      config: {
        url: 'api/v1/detail_address',
        data: {
					token,
					address_id: that.data.address_id
        },
        method: 'POST'
      },
      isAuth: true
    }).then(res => {
			console.log(res, 'addressRes')
			that.setData({
				addressDetails: res.data.data
			})
    }).catch(err => {
      console.log(err, 'addressErr')
    })
	},

	/**
	 * 修改取货方式
	 */
	handleChangeType (e) {
		const typeActivity = e.currentTarget.dataset.index
		this.setData({
			typeActivity
		})
	},

	/**
	 * 获取用户购物车列表
	 */
	getShoppingCarList () {
		let that = this
		let token = wx.getStorageSync('token')
		app.http({
			config: {
				url: 'api/v1/user_cart',
				data: {
					token,
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'getShoppingCarListRes')
			const shoppingCarList = res.data.data.cartList.valid
			const cart_id_list = that.data.cart_id_list
			let carList = []
			shoppingCarList.forEach(element => {
				cart_id_list.forEach(item => {
					if (element.id == item) {
						carList.push(element)
					}
				})
			})
			that.setData({
				carList
			}, () => {
				let totalPrice = 0
				carList.forEach(element => {
					totalPrice += element.truePrice * element.cart_num
				})
				that.setData({
					totalPrice
				})
			})
		}).catch(err => {
			console.log(err, 'getShoppingCarListErr')
		})
	},

	/**
	 * 显示弹窗
	 */
	handleShowPopup () {
		const that = this
		const showPopup = !that.data.showPopup
		that.setData({
			showPopup,
		}, () => {
			that.setData({
				popupPositionBottom: 0
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
			popupPositionBottom: -1200
		}, function () {
			setTimeout(() => {
				that.setData({
					showPopup
				})
			}, 300)
		})
	},

	/**
	 * 创建订单
	 */
	handlePayment (e) {
		const that = this
		const token = wx.getStorageSync('token')
		const { key, address_id, typeActivity } = that.data
		const self = typeActivity === 1 ? 0 : 1
		const paytype = e.currentTarget.dataset.paytype
		switch (paytype) {
			case 'weixin':
				app.http({
					config: {
						url: 'api/v1/create_order',
						data: {
							token,
							key,
							paytype,
							addressId: address_id,
							self
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
							wx.navigateBack({
								delta: 1,
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
			case 'yue':
				wx.showModal({
					title: '提示',
					content: '确认使用余额支付？',
					success (res) {
						if (res.confirm) {
							app.http({
								config: {
									url: 'api/v1/create_order',
									data: {
										token,
										key,
										paytype,
										addressId: address_id,
										self
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
											wx.navigateBack({
												delta: 1,
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

	onLoad (query){
		app.setTitle('填个标题吧')
		const that = this
		const { key, cart_id } = query
		const cart_id_list = cart_id.split(",")
		console.log('key', key)
		console.log('cart_id', cart_id)
		console.log('cart_id_list', cart_id_list)
		that.setData({
			key,
			cart_id_list
		}, () => {
			that.getShoppingCarList()
		})
		that.getAddressList()
	},

	onShow (){
		const address_id = this.data.address_id
		console.log('address_id', address_id)
		if (address_id) {
			this.handleGetAddress()
		}
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
