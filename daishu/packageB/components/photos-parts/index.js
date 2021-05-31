const { $Toast } = require('../../../utils/iview/base/index');
import Image from '../../../utils/modules/Image';

const app = getApp();


Component({
	data: {
		imgList: [],
		seatList : [],
		allList : [],
		add: true
	},
	properties: {
		imgcount: {
			type: Number,
			value: 9
		},
		btnBg: {
			type: String,
			value: ''
		},
    padding : {
      type : String,
      value : '24'
    },
    tips : {
      type : String,
      value: '上传照片'
    },
    btnBgColor : {
      type : String,
      value: '#EFEFF4'
    },
    btnColor : {
      type : String,
      value : '#666'
    },
    itemMarginLeft : {
      type : String,
      value : '18'
    },
    itemMarginBottom : {
      type : String,
      value : '18'
    },
    btnBorderColor : {
      type : String,
      value: '#eee'
    },
    fontSize : {
      type : String,
      value : '22'
    },
		position: {
			type: String,
			value: 'start'
		},
		radius: {
			type: Boolean,
			value: true
		},
		seat: {
			type: Array,
			value: []
		},
    width : {
      type : String,
      value : '158'
    },
    height : {
      type : String,
      value : '158'
    }

	},
	attached (){
		var seat = this.data.seat || [];
		var count = this.data.imgcount;
		
		if(this.data.imgcount < seat.length){
			seat = seat.slice(0, count)
		}

		this.setData({
			seatList : seat,
			allList : seat
		})
	},
	methods: {
		uploadImg() {
			let img = new Image();
			let _that = this;
			let { imgList, imgcount, add, allList, seatList } = _that.data;

			img._choose({
				count: imgcount
			}).then(res => {

				allList = allList.concat(res.tempFilePaths);
				imgList = imgList.concat(res.tempFilePaths);

				add = true;

				if (allList.length >= imgcount) add = false;

				if (allList.length > imgcount) {
					allList = allList.slice(0, imgcount);
					imgList = imgList.slice(0, (imgcount - imgcount));

					$Toast({
						content: `图片不能超过${imgcount}张`,
						type: 'warning'
					});

					_that.triggerEvent('error', { code: -1, message: `图片不能超过${imgcount}张` });
				}

				_that.setData({
					imgList: imgList,
					allList: allList,
					add: add
				});

				_that.triggerEvent('photoChange', { photo: allList, upload : imgList, seat : seatList });
			})
		},

		closeCurr(event) {
			let { index } = event.currentTarget.dataset;

			let imgs = this.data.imgList;
			let allImg = this.data.allList;
			let seat = this.data.seatList;

			allImg.splice(index, 1);

			if(seat.length <= index){
				imgs.splice((index - seat.length), 1);
			}else{
				seat.splice(index, 1);
			}
			

			this.setData({
				imgList: imgs,
				allList: allImg,
				seatList: seat,
				add: true
			});

			this.triggerEvent('photoChange', { photo: allImg, upload : imgs, seat : seat });
		},

		prevCur(event) {
			let { index } = event.currentTarget.dataset;
			let imgs = this.data.allList;
			let img = new Image()
			let array = [imgs[index]]

			img._preview(array)
		},
	}


})
