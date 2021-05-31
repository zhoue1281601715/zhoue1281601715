Component({
  externalClasses: ['icon'],
	properties : {
    height : {
      type : String,
      value : '90'
    },
    width : {
      type : String,
      value : '750'
    },
    bColor : {
      type : String,
      value : '#fff'
    },
    fColor : {
      type : String,
      value: '#efefef'
    },
    style : {
      type : String,
      value: 'border-radius: 70rpx; padding: 0 30rpx;'
    },
    placeholder : {
      type : String,
      value: '请说出你的愿望'
    },
    fontSize : {
      type : Number,
      value : 28
    },
    marginTop : {
      type : Number,
      value : 10
    },
    marginLeft: {
      type: Number,
      value: 30
    },
    color : {
      type : String,
      value : '#333'
    },
    iconColor : {
      type : String,
      value : '#333'
    },
    placeholdColor: {
      type: String,
      value: '#999'
    }
    
	},
	data : {
    isFocurs: false,
    value: ''
	},
	attached (){
		
		
	},
	ready: function() {},
	methods : {

    searchBlur() {
      this.setData({
        isFocurs: false,
        searchValue: ''
      })
    },
    searchInput() {
      this.setData({
        isFocurs: true,
      })
    },

    searchSuccess(e) {
      const { value } = e.detail;
      this.triggerEvent('confirm', {value})
    },

	}
})