Component({
	properties : {
		isbackground : {
			type : Boolean,
			value : false
		},
		url : {
			type : String,
			value : '',
		},
		errorUrl : {
			type : String,
			value : '/utils/images/noimg.jpg'
		},
		width : {
			type : String,
			value : ''
		},
		height : {
			type : String,
			value : ''
		}
	},
	data : {
		imgWidth : 0,
		imgHeight : 0
	},
	attached (){
		var _that = this;

		if(!_that.data.width){
			var query = wx.createSelectorQuery().in(this);
			query.select('#img-parts').boundingClientRect(function (res){
				wx.getSystemInfo({
					success : function (r){
						var windowWidth = r.windowWidth;

						_that.setData({
							width : res.width / (windowWidth / 750)
						})
					}
				})
				
			}).exec();
		}
		
	},
	ready: function() {},
	methods : {

		
		
		imgLoad (e){

			var _thisInfo = e.detail
			var {width, height, imgWidth, imgHeight} = this.data;

			if(!height){
				height = width / (_thisInfo.width / _thisInfo.height);
			}

			/* 图片比例 */
			var img_pro = _thisInfo.width / _thisInfo.height;
			var wrap_pro = width / height;


			/* 判断外框的宽高长 */
			if(wrap_pro < img_pro){
				imgHeight = height;
				imgWidth = Math.ceil(img_pro * height);
				
			}else if(wrap_pro > img_pro){
				imgWidth = width;
				imgHeight = Math.ceil(width / img_pro);
				
			}else{
				
				imgWidth = width
				imgHeight = height
				
			}
			
			this.setData({
				imgWidth : imgWidth,
				imgHeight : imgHeight,
				height : height
			})

		},

		imgError (){
			var {width, height, imgWidth, imgHeight} = this.data;
			if(width > height){
				imgWidth = width
				imgHeight = width
			}else{
				imgWidth = height
				imgHeight = height
			}

			this.setData({
				url : this.data.errorUrl,
				imgWidth : imgWidth,
				imgHeight : imgHeight
			})
		}

	}
})