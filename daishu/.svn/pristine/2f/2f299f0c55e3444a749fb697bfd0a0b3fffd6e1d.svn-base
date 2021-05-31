
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
	 // 当前选中的地址
	 radio: 0,
	 // 判断吃否为出仓选择地址 0个人中心->地址管理 ：直接  1：出仓申请填写信息->选择地址
	 isAdd: 0,
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
		activeIdx: -1
	},
	
	mixins: [app.togerther],

	onLoad (query){
		let company_id = wx.getStorageSync("company_id");
		let customer_id = wx.getStorageSync("customer_id");
    this.setData({
      company_id,
      customer_id,
      isAdd: query.isAdd
    })
		app.setTitle('填个标题吧');
	},

	onShow (){
		this.addressList()
	},

	addressList() {
		let self = this
		app.https({
			config: {
				url: 'xcx/buyer/list',
				data: {
					company_id: this.data.company_id,
					customer_id: this.data.customer_id
				},
				method: 'POST'
			},
			isAuth: false
		}).then((res) => {
			console.log(res)
			self.setData({
				shippingList: self.formatAddress(res.data.data)
			})
			console.log(this.data.shippingList)
		}).catch((err2) => {
			console.log(err2)
		})
	},
	// 添加地址
	addAddress() {
		wx.navigateTo({
			url: '../add_address/index',
			success: (result) => {

			},
			fail: () => {},
			complete: () => {}
		});
	},
  formatAddress(array) {
    let self = this
    let newAddressList = array.map((item, index) => {

      item.phoneShow = app.utils.matchPhoneNum(item.phone)
      item.addressStr = item.city + item.area + item.street + item.address
      return item
    })
    return newAddressList
  },
	// 编辑地址
	editAddress(event) {
		console.log('event', event)
		let edit = event.currentTarget.dataset.info
		console.log(edit)
		wx.navigateTo({
			url: '../add_address/index?edit=' + JSON.stringify(edit),
		})
	},
	// 选择地址
	chooseAddress(event) {
		let index = event.currentTarget.dataset.index
		let pages = getCurrentPages() // 当前页面栈
		let prevPage = pages[pages.length - 2] //上一页面
		let shippingList = this.data.shippingList
		if (this.data.isAdd == 2) {
			prevPage.setAddressData(shippingList[index]);
		} else {
			prevPage.setData({
				consignee: shippingList[index],
				consigneeShow: false
			})
		}

		wx.navigateBack({
			delta: 1
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

