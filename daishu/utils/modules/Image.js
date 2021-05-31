let tools = require('./Tools');

class Image {
	constuctor (){}

	_getInfo (){

	}

	_preview (urls, index = 0, complete = ()=>{}){

		return new Promise((resolve, reject) => {
			let data = {};

			if(urls.length == ''){
				console.error('没有找到图片路径');

				reject({message : '没有找到图片路径'});
				return false;
			}

			data.urls = urls;

			if(tools.dataType(urls) === 'array'){
				let len = urls.length - 1;
				if(len >= index){
					data.current = urls[index];
				}
			}else if(tools.dataType(urls) != 'string'){
				console.error('请输入格式为Array 或 String');
			}

			data.success = () => {
				resolve();
			};

			data.fail = () => {
				reject();
			};

			data.complete = complete;

			wx.previewImage(data);
		});
		
	}

	_choose (options = {}, complete = () => {}){
		return new Promise((resolve, reject) => {
			let obj = {
				count : 9,
				sizeType : ['original', 'compressed'],
				sourceType : ['album', 'camera']
			}

			obj = Object.assign(obj, options);
			
			if(obj.count > 9) obj.count = 9;

			obj.success = res => {
				resolve(res);
			};

			obj.fail = () => {
				reject();
			};
			
			obj.complete = complete;

			wx.chooseImage(obj);
		});
	}

	_save (){


	}
}

export default Image;