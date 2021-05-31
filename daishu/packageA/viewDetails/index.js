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
		shoppingDetails:'',
		shoppingComment:'',
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

		specsList:[], // 商品规格列表
		specs_index: '', // 商品规格选中下标（默认''）
		price: '', // 商品不同规格对应的商品价格
		stock: '', // 商品不同规格对应的商品库存
		image: '', // 商品不同规格对应的商品图片路径
		goods_id: '', // 商品ID
		unique: '', // 商品属性的唯一值
		pecifications: '', // 规格
		goodsNum: 1, // 要购买的商品数量（默认1）
		productWindowFlag: 'none', // 选择商品属性的弹窗显示/关闭（默认：关闭）
		productWindowPositionBottom: '-800', // 选择商品属性的弹窗的bottom定位值
		toastParameter: {},
		
	},
	onLoad (query) {
		this.setData({
			goods_id: query.id
		})
		app.setTitle('填个标题吧');
		this.getShoppingDetails()
		this.getShoppingComment()
	},

	onShow (){

	},

	/**
	 * 选择商品规格
	 * @param {*} e 
	 */
	handleChangeSpecs (e) {
		const { specs_index, price, stock, image, goods_id, unique, pecifications } = e.currentTarget.dataset
		this.setData({
			specs_index,
			price,
			stock,
			image,
			goods_id,
			unique,
			pecifications
		})
	},

	/**
	 * 点击 "-" 号，减少商品数量
	 */
	handleReduceGoodsNum () {
		let that = this
		let goodsNum = that.data.goodsNum - 1
		goodsNum = goodsNum > 1 ? goodsNum : 1
		that.setData({
			goodsNum
		})  
	},

	/**
	 * 点击 "+" 号，增加商品数量
	 */
	handleAddGoodsNum () {
		let that = this
		let goodsNum = (that.data.goodsNum + 1) > that.data.stock ? that.data.stock : (that.data.goodsNum + 1)
		that.setData({
			goodsNum
		})  
	},

	/**
	 * 商品数量输入框失去焦点判断用户输入的值是不是数字
	 */
	handleInputBlur (e) {
		console.log(e)
		let that = this
		let goodsNum = isNaN(Number(e.detail.value)) ? 1 : Number(e.detail.value)
		let goodsVirtualValue = ''
		if (goodsNum > 0) {
			goodsVirtualValue = goodsNum > that.data.stock ? that.data.stock : goodsNum
		} else {
			goodsVirtualValue = 1
		}
		that.setData({
			goodsNum: goodsVirtualValue,
		})
	},

	/**
	 * 显示选择商品属性弹窗
	 */
	handleProductWindowShow () {
		let that = this
		let productWindowFlag = 'block'
		that.setData({
			productWindowFlag,
			productWindowPositionBottom: '0',
		})
	},

	/**
	 * 隐藏选择商品属性弹窗
	 */
	handleProductWindowHide (parameter) {
		let duration = typeof(parameter) === 'number' ? parameter : 300
		console.log('duration', duration)
		this.setData({
			productWindowPositionBottom: '-800',
		}, function () {
			setTimeout(() => {
				this.setData({
					productWindowFlag: 'none',
				})
			}, duration)
		})
	},

	/**
	 * 有用，勿删
	 */
	handleStopBubbing () {},

	/**
	 * 客服
	 * @param {*} e 
	 */
	handleContact (e) {
		console.log(e.detail.path)
		console.log(e.detail.query)
	},

	/**
	 * 加入购物车
	 */
	handleJoinShoppingCar () {
		let that = this
		if (that.data.productWindowFlag === 'block') {
			if (that.data.specs_index === '') {
				wx.showToast({
					title: '请先选择商品规格',
					icon: 'none',
					duration: 1500,
				})
			} else {
				app.http({
					config: {
						url: 'api/v1/add_cart',
						data: {
							goods_id: that.data.goods_id,
							unique: that.data.unique,
							cart_num: that.data.goodsNum,
						},
						method: 'POST'
					},
					isAuth: true
				}).then(res => {
					console.log(res, 'joinShoppingCarRes')
					let toastParameter = {
						icon: 'success',
						content: res.data.msg,
						duration: 2000,
					}
					that.setData({
						toastParameter
					}, function () {
						that.handleProductWindowHide(0)
					})
				}).catch(err => {
					console.log(err, 'joinShoppingCarErr')
					wx.showModal({
						title: '提示',
						content: err.data.msg,
						showCancel: false
					})
				})
			}
		} else {
			that.handleProductWindowShow()
		}
	},

	/**
	 * 立即购买
	 */
	handleBuyNow (e) {
		let that = this
		if (that.data.productWindowFlag === 'block') {
			const { goods_id, unique, goods_name, goods_price, goods_num, goods_pecifications, goods_picture } = e.currentTarget.dataset
			if (goods_pecifications && goods_num) {
				wx.navigateTo({
					url: `/packageA/orderConfirmation/index?goods_id=${goods_id}&unique=${unique}&goods_name=${goods_name}&goods_price=${goods_price}&goods_num=${goods_num}&goods_pecifications=${goods_pecifications}&goods_picture=${goods_picture}`,
				})
			} else {
				wx.showToast({
					title: '请先选择商品规格',
					icon: 'none',
					duration: 1500,
				})
			}
		} else {
			that.handleProductWindowShow()
		}
	},
	
	// 获取商品详情
  getShoppingDetails() {
    let token = wx.getStorageSync('token')
    let that = this
    app.http({
      config: {
        url: 'api/v1/goods_info',
        data: {
					token,
					goods_id: that.data.goods_id
				},
        method: 'POST'
      },
      isAuth: false
    }).then(res => {
			console.log(res, 'goodsDetailsRes')
			let resData = res.data.data
			this.setData({
				shoppingDetails: resData,
				stock: resData.stock,
				specsList: resData.attr_value,
				slider_image: resData.slider_image
			})
    }).catch(err => {
      console.log(err, 'goodsDetailsErr')
    })
	},

	// 获取商品评论
	getShoppingComment() {
    let token = wx.getStorageSync('token')
    let that = this
    app.http({
      config: {
        url: 'api/v1/goods_comment',
        data: {
					token,
					goods_id: that.data.goods_id
				},
        method: 'POST'
      },
      isAuth: false
    }).then(res => {
			console.log(res, 'shoppingCommentRes')
			this.setData({
				shoppingComment:res.data.data.data,
				commentPic:res.data.data.data.pics
			})
			console.log(this.data.shoppingComment)
    }).catch(err => {
      console.log(err, 'shoppingCommentErr')
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
