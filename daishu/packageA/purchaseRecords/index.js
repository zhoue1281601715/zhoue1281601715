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
		activeIdx: -1,
		// ------------------------- 
		thisPage: 1, // 当前页
		lastPage: 1, // 最后一页
		stockList: [] // 列表
	},

	/**
	 * 获取购买记录
	 */
	getStockRecord() {
		const that = this
		const token = wx.getStorageSync('token')
		app.http({
			config: {
				url: 'api/v1/stock_record',
				data: {
					token,
					page: that.data.thisPage
				},
				method: 'POST'
			},
			isAuth: true
		}).then(res => {
			console.log(res, 'stockRecordRes')
			let stockList = that.data.stockList.length > 0 ? that.data.stockList.concat(res.data.data.data) : res.data.data.data
			const lastPage = res.data.data.last_page
			stockList.forEach(element => {
				element.created_time = element.created_at.substr(0, 10)
			})
			that.setData({
				stockList,
				lastPage
			})
		}).catch(err => {
			console.log(err, 'stockRecordErr')
		})
	},

	onLoad (query){
		app.setTitle('填个标题吧');
		this.getStockRecord()
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
				this.getStockRecord()
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
