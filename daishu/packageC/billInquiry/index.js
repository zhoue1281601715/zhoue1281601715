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
		date: "2021-1",
    billList: [],
    income: "",
		expenditure: "",
		thisPage: 1,
		lastPage: 1,
	},
	
	/**
	 * 处理月份格式
	 */
  formatMonth(month) {
    let handleMonth = month + 1
    if (handleMonth < 10) {
      handleMonth = "0" + handleMonth
    }
    return handleMonth
  },

  /**
	 * 微信picker选择完成
	 */ 
  bindDateChange(e) {
		const that = this
		if (that.data.date === e.detail.value) {
			return false
		} else {
			that.setData({
				billList: [],
				thisPage: 1,
				lastPage: 1,
				date: e.detail.value
			}, () => {
				that.billSear()
			})
		}
	},
	
  /**
	 * 账单查询
	 */
  billSear() {
    const that = this
		app.https({
			config: {
				url: 'xcx/account/list',
				data: {
					customer_id: that.data.customer_id,
					month: that.data.date,
					page: that.data.thisPage
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'billSearRes')
			const lastPage = Math.ceil(res.data.count / 30)
			const billList = that.data.billList.length > 0 ? that.data.billList.concat(res.data.data) : res.data.data
			that.setData({
				billList,
				lastPage
      }, () => {
				that.showPictures()
			})
		}).catch(err => {
			console.log(err, 'billSearErr')
		})
    that.billSummary()
	},
	
	/**
	 * 右侧头像取subject的第一个字
	 */
  showPictures() {
    let billList = this.data.billList
    billList.map((item, index) => {
      item.showWord = item.subject.substring(0, 1)
    })
    this.setData({
      billList:billList
    })
  },

	/**
	 * 客户账单汇总
	 */
  billSummary() {
    const that = this
    const parameter = {
      customer_id: that.data.customer_id,
      month: that.data.date
    }
    app.request.post('/xcx/account/stat', parameter).then(res => {
      const getData = res
      const pay = that.removeStr(getData.pay + "")
      that.setData({
        income: getData.receive,
        expenditure: pay
      })
    })
  },

  removeStr(str) {
    let reult = str.replace(/\-/g, "")
    return reult
  },

	onLoad (query){
		app.setTitle('填个标题吧');
		const currentTime = new Date()
		const currentUser = wx.getStorageSync("currentUserInfo");
    const initialization = currentTime.getFullYear() + '-' + this.formatMonth(currentTime.getMonth())
    this.setData({
      customer_id: currentUser.customer_id,
      date: initialization
    })
	},

	onShow (){
		this.billSummary()
    this.billSear()
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
		let { thisPage, lastPage } = that.data
		if (thisPage < lastPage) {
			thisPage += 1
			that.setData({
				thisPage
			}, () => {
				that.billSear()
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
