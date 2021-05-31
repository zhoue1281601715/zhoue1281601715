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
		arr: ['日账单', '月账单'],
		checkArr: ['支出', '收入'],
		checkIndex: 0,
		currentTab:0,
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
	},

	onLoad (query){
		app.setTitle('填个标题吧');
		const that = this
		const CustomBar = app.store.custom.CustomBar
		that.setData({
			CustomBar
		})
	},
	
	onShow (){
		console.log(this.data.arr)
	},

	tabOn: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.index
    });
  },
	
	/**
	 * 切换 支出/收入
	 */
	handleCheckboxChange(e) {
		const that = this
		const index = e.currentTarget.dataset.index
		if (index === that.data.checkIndex) {
			return false
		} else {
			that.setData({
				checkIndex: index
			})
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
		
	}
})
