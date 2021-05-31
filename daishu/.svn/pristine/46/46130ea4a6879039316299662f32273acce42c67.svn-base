
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
		show: false,
		orderList: [{}, {}],

    // 送货公司
    logistics_consignee_name: "",
    //送货车牌
    delivery_plate: "",
    // 备注
    remark: "",
    is_company: false,
    is_plate: false,
		is_remark: false,
		details:[],
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
		
	},
	mixins: [app.togerther],
	onLoad (query){
		app.setTitle('填个标题吧');
		var comfireShopList=wx.getStorageSync('tempList')
		let currentUser = wx.getStorageSync("currentUserInfo");
    comfireShopList.map((item, index) => {
      item.wareNum = parseInt(item.wareNum)
      item.item_id = item.id
      item.warehouse_id =currentUser.warehouse_id
      item.company_id = currentUser.company_id
      delete item.id
    })
    this.setData({
			comfireShopList: comfireShopList,
			currentUser,
		})
		console.log(comfireShopList)
    this.packagingData(comfireShopList)
	},
	onShow (){
		
	},
	  // 将商品列表包装城接口需要的格式
		packagingData(arr) {
			let result = []
	
			// 后台接口需要的参数列表
			let props = [
				"company_id",
				"warehouse_id",
				"customer_id",
				"item_id",
				"quantity_e",
				"batch1",
				"batch2",
				"production_date",
				"expiration_date",
				"remark"
			]
			arr.map((item, index) => {
				result[index] = {}
				for (let i = 0; i < props.length; i++) {
					result[index][props[i]] = item[props[i]]
				}
			})
			console.log('result---------', result)
			this.setData({
				result: result
			})
		},
 // 下单参数
 placeAnOrderParams(event) {
	let type = event.currentTarget.dataset.type
	this.setData({
		[type]: event.detail.value
	})
},

// 校验接口需要的参数
checkData() {
	let getData = this.data
	if (!getData.delivery_company) {
		app.utils.wx_toast("请填写送货公司")
		this.setData({
			is_company: true
		})
		return false
	}
	if (!getData.delivery_plate) {
		app.utils.wx_toast("请填写送货车牌")
		this.setData({
			is_plate: true
		})
		return false
	}
	if (!getData.delivery_plate) {
		app.utils.wx_toast("请填写备注信息")
		this.setData({
			is_remark: true
		})
		return false
	}
	return true
},

// 确认下单
confirmOrder() {
	let self = this
	let currentUser = this.data.currentUser
	if (this.data.cant_click) {
		return
	}
	// this.cant_click_fn()
	if (!this.checkData()) {
		return
	}


	let data = {
		type: 0,
		company_id: currentUser.company_id,
		warehouse_id: currentUser.warehouse_id,
		warehouse_name: currentUser.warehouse_name,
		kefu: currentUser.kefu,
		xcx_openid: currentUser.xcx_openid,
		print_custom: currentUser.print_custom,
		table_num: currentUser.table_num,
		customer_id: currentUser.customer_id,
		customer_name: currentUser.customer_name,
		
		delivery_company: this.data.delivery_company,
		delivery_plate: this.data.delivery_plate,
		remark: this.data.remark,
		details:this.data.result
	}
	console.log('parameter----', data)
	// return
	app.https({
		config: {
			url: 'xcx/bill/save',
			data,
			method: 'POST',
			header:{'Conten-Type':'application/JSON;charset=UTF-8'},
		},
		
		isAuth: false
	}).then((res) => {
		console.log(res)
		wx.setStorageSync('tempList', [])
		wx.setStorageSync('goodsList', [])
		self.navgateToPage(1)
	
	}).catch((err) => {
		console.log(err)
		wx.hideLoading({
			success: res => {
				$Toast({
					content: err.data.msg,
					type: 'error'
				});
			}
		});
	})
	// app.request.json_post('/xcx/bill/save', parameter, self.navgateToPage).then(res => {
	// 	self.navgateToPage(1)
	// })
},
  // 下单结果
  navgateToPage(param) {
    param = param ? param : 0
    //0:下单失败 1:下单成功
    wx.navigateTo({
      url: '../in_stock_res/in_stock_res?res=' + param,
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

