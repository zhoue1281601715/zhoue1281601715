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
			ishide : true,
			checkedStatus: false, // 商品选中状态
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
		activeIdx: -1,
		shoppingCarList: '', // 购物车列表
		goodsList: '', // 猜你喜欢商品列表
		thisPage: 1, // 当前页面
		lastPage: 1, // 最后一页
		shoppingCarCheckedTotal: 0, // 购物车商品选项选中数量
		totalPrice: 0, // 合计价格
		allChecked: false, // 全选标识
		editFlag: false, // 编辑标识
		toastParameter: {}, // 自定义toast参数
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
					page: that.data.thisPage
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'getShoppingCarListRes')
			let shoppingCarList = res.data.data.cartList.valid
			// 遍历购物车列表，给每一项添加一个自定义标识（这里命名为checked），用户点击自定义checkbox时改变该标识的状态，从而判断是选中还是取消选中
			shoppingCarList.forEach(element => {
				element.checked = false // 默认所有选项的选中状态都是未选中
				element.edit = false // 商品数量编辑标识，默认false
			})
			let goodsList = that.data.goodsList.length > 0 ? that.data.goodsList.concat(res.data.data.goodsList.data) : res.data.data.goodsList.data
			const lastPage = res.data.data.goodsList.last_page
			that.setData({
				shoppingCarList,
				goodsList,
				lastPage
			})
		}).catch(err => {
			console.log(err, 'getShoppingCarListErr')
		})
	},

	/**
	 * 用户点击自定义checkbox，选中/取消 该选项
	 */
	handleCheckboxChange (e) {
		let that = this
		let shoppingCarList = that.data.shoppingCarList // 购物车列表
		let shoppingCarLen = shoppingCarList.length // 购物车列表长度
		let itemIndex = e.currentTarget.dataset.index // 该商品选项在购物车列表中的下标
		let itemChecked = !shoppingCarList[itemIndex].checked // 先用一个变量存储该商品选项的checked，并取反
		shoppingCarList[itemIndex].checked = itemChecked // 修改该商品选项的checked状态
		let totalPrice = itemChecked ? (that.data.totalPrice + e.currentTarget.dataset.item_total_price) : (that.data.totalPrice - e.currentTarget.dataset.item_total_price) // 根据商品选中与取消选中来计算合计价格
		let shoppingCarCheckedTotal = itemChecked ? ++that.data.shoppingCarCheckedTotal : --that.data.shoppingCarCheckedTotal // 购物车商品选项选中总数
		let allChecked = shoppingCarCheckedTotal === shoppingCarLen ? true : false // 判断选中总数是否等于购物车列表长度，如果是，代表全部选中，如果不是，则代表还未全部选中
		that.setData({
			shoppingCarList,
			totalPrice,
			shoppingCarCheckedTotal,
			allChecked,
		})
	},

	/**
	 * 全选/全不选
	 */
	handleCheckedAllChange () {
		let that = this
		let allChecked = !that.data.allChecked
		let shoppingCarList = that.data.shoppingCarList // 购物车列表
		let totalPrice = 0 // 合计价格
		let shoppingCarCheckedTotal = 0 // 购物车商品选项选中选项总数
		if (allChecked) {
			shoppingCarCheckedTotal = shoppingCarList.length
			shoppingCarList.forEach(element => {
				element.checked = true
				totalPrice += element.truePrice * element.cart_num
			})
			that.setData({
				allChecked,
				shoppingCarList,
				totalPrice,
				shoppingCarCheckedTotal,
			})
		} else {
			shoppingCarList.forEach(element => {
				element.checked = false
			})
			that.setData({
				allChecked,
				shoppingCarList,
				totalPrice,
				shoppingCarCheckedTotal,
			})
		}
	},

	/**
	 * 用户点击编辑/完成
	 */
	handleEdit () {
		let that = this
		let editFlag = !that.data.editFlag
		that.setData({
			editFlag,
		})
	},

	/**
	 * 删除选中选项
	 */
	handleDeleteGoods () {
		let that = this
		let token = wx.getStorageSync('token')
		let shoppingCarList = that.data.shoppingCarList // 购物车列表
		let cart_ids = ''
		shoppingCarList.forEach(element => {
			if (element.checked) {
				cart_ids = cart_ids === '' ? (cart_ids + element.id) : (cart_ids + `,${element.id}`)
			}
		})
		if (cart_ids.length > 0) {
			app.http({
				config: {
					url: 'api/v1/delete_cart',
					data: {
						token,
						cart_ids,
					},
					method: 'POST'
				},
				isAuth: true
			}).then(res => {
				console.log(res, 'deleteGoodsRes')
				let toastParameter = {
					icon: 'success',
					content: res.data.msg,
					duration: 2000,
				}
				that.setData({
					toastParameter,
					allChecked: false,
					totalPrice: 0,
					shoppingCarCheckedTotal: 0,
				}, function () {
					that.getShoppingCarList()
				})
			}).catch(err => {
				console.log(err, 'deleteGoodsErr')
				wx.showModal({
					title: '提示',
					content: err.data.msg,
					showCancel: false,
				})
			})
		}
	},

	/**
	 * 点击购物车商品右下角数量（例：x1），展开商品数量修改组件
	 */
	handleEditGoodsNum (e) {
		let that = this
		let index = e.currentTarget.dataset.index
		let shoppingCarList = that.data.shoppingCarList // 购物车列表
		shoppingCarList[index].edit = true
		that.setData({
			shoppingCarList,
		})
	},

	/**
	 * 点击 "-" 号，减少商品数量
	 */
	handleReduceGoodsNum (e) {
		let that = this
		let cart_id = e.currentTarget.dataset.cart_id
		let original_cart_num = e.currentTarget.dataset.cart_num
		let index = e.currentTarget.dataset.index
		let shoppingCarList = that.data.shoppingCarList // 购物车列表
		if (original_cart_num > 1) {
			let cart_num = original_cart_num - 1
			wx.showLoading()
			app.http({
				config: {
					url: 'api/v1/edit_cart',
					data: {
						cart_id,
						cart_num,
					},
					method: 'POST'
				},
				isAuth: true
			}).then(res => {
				console.log(res, 'ReduceGoodsNumRes')
				wx.hideLoading()
				shoppingCarList[index].cart_num = cart_num
				that.setData({
					shoppingCarList,
				})
			}).catch(err => {
				console.log(err, 'ReduceGoodsNumErr')
				wx.showModal({
					title: '提示',
					content: err.data.msg,
					showCancel: false,
				})
			})
		}
	},

	/**
	 * 点击 "+" 号，增加商品数量
	 */
	handleAddGoodsNum (e) {
		let that = this
		let cart_id = e.currentTarget.dataset.cart_id
		let original_cart_num = e.currentTarget.dataset.cart_num
		let index = e.currentTarget.dataset.index
		let stock = e.currentTarget.dataset.stock
		let shoppingCarList = that.data.shoppingCarList // 购物车列表
		if (original_cart_num < stock) {
			let cart_num = original_cart_num + 1
			wx.showLoading()
			app.http({
				config: {
					url: 'api/v1/edit_cart',
					data: {
						cart_id,
						cart_num,
					},
					method: 'POST'
				},
				isAuth: true
			}).then(res => {
				console.log(res, 'addGoodsNumRes')
				wx.hideLoading()
				shoppingCarList[index].cart_num = cart_num
				that.setData({
					shoppingCarList,
				})
			}).catch(err => {
				console.log(err, 'addGoodsNumErr')
				wx.showModal({
					title: '提示',
					content: err.data.msg,
					showCancel: false,
				})
			})
		}
	},

	/**
	 * 用户通过输入框输入数量修改购物车商品要购买的数量，当输入框失去焦点后进行一系列处理
	 */
	handleInputBlur (e) {
		let that = this
		let cart_id = e.currentTarget.dataset.cart_id
		let index = e.currentTarget.dataset.index
		let stock = e.currentTarget.dataset.stock
		let shoppingCarList = that.data.shoppingCarList // 购物车列表
		let original_cart_num = isNaN(Number(e.detail.value)) ? 1 : Number(e.detail.value)
		let cart_num = 1
		if (original_cart_num > 0) {
			cart_num = original_cart_num > stock ? stock : original_cart_num
		}
		wx.showLoading()
		app.http({
			config: {
				url: 'api/v1/edit_cart',
				data: {
					cart_id,
					cart_num,
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'addGoodsNumRes')
			wx.hideLoading()
			shoppingCarList[index].cart_num = cart_num
			that.setData({
				shoppingCarList,
			})
		}).catch(err => {
			console.log(err, 'addGoodsNumErr')
			wx.showModal({
				title: '提示',
				content: err.data.msg,
				showCancel: false,
			})
		})
	},

	/**
	 * 结算
	 */
	handleSettlement () {
		const that = this
		const shoppingCarList = that.data.shoppingCarList // 购物车列表
		let cart_id = ''
		shoppingCarList.forEach(element => {
			if (element.checked) {
				cart_id += `${element.id},`
			}
		})
		if (cart_id) {
			cart_id = cart_id.substr(0, cart_id.length - 1)
			console.log('cart_id', cart_id)
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
		}
	},

	onLoad (query) {
		app.setTitle('填个标题吧')
	},
	
	onShow () {
		this.setData({
			totalPrice: 0,
			allChecked: false,
			shoppingCarList: []
		}, () => {
			this.getShoppingCarList()
		})
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
				this.getShoppingCarList()
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
