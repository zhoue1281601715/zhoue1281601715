import { Config } from '../../../config';

Component({
	externalClasses: ['j-class'],
	properties : {
		opentType : {
			type : String,
			value : 'navigate'
		},
		url : {
			type : String,
			value : ''
		}
	},
	data : {
		_openType : ''
	},
	attached (){
		var that = this;
		var array = ['navigate', 'redirect', 'switchTab', 'reLaunch', 'navigateBack'];

		var tabBar = Config.tabBar || [],
			_url = that.data.url,
			opentType = that.data.opentType;

		if(array.indexOf(opentType) < 0){
			console.error('路由没有该方法');
			return false;
		}

		tabBar.forEach(function (cur){
			var tabUrl = '/' + cur;
			
			if(tabUrl.indexOf(_url) == 0){
				opentType = 'switchTab';
			}
		})
		
		

		that.setData({
			_openType : opentType
		})
	}
})