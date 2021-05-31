const Tools = require('../../../utils/modules/Tools');

Component({
	externalClasses: ['j-class'],
	// relations: {
	// 	'../date-parts/index': {
	// 	  type: 'child', 
	// 	},
	// },
	properties : {
		background : {
			type : String,
			value : 'rgba(0,0,0,.4)'
		},
		position : {
			type : String,
			value : '1,1'
		},
		animateIn : {
			type : String,
			value : 'fadeInDown'
		},
		animateOut : {
			type : String,
			value : 'fadeOutUp'
		},
		animateDuration : {
			type : Number,
			value : .3
		},
    
		jStyle : {
			type : String,
			value : 'width:100vw;height:100vh'
		},
		isHide : {
			type : Boolean,
			value : true,
			observer (n, o){
				var {animateIn, animateOut} = this.data;

				if(!!n){
					this.setData({
						outAnimate : 'fadeOut',
						animate : animateOut
					});

					setTimeout(() => {
						
						this.setData({
							_hidden : true
						})
					}, 400)
				}else{
					this.setData({
						outAnimate : 'fadeIn',
						_hidden : false,
						animate : animateIn
					})
				}
			}
		}
	},
	data : {
		domInfo : {},
		_position : '',
		animate : '',
		_hidden : true,
		outAnimate : 'fadeIn'
	},
	ready : function (){
		
		var {position, animateIn} = this.data;
		var _p = position.split(',');
		var _html = '';

		switch(_p[0]){
			case '0' :
				_html += 'left: 0; '
			break;
			case '1' :
				_html += "left : 50%; "
			break;
			case '2' :
				_html += "right : 0; left: auto;"
			break;
		}

		switch(_p[1]){
			case '0' :
				_html += 'top: 0; '
			break;
			case '1' :
				_html += "top : 50%; "
			break;
			case '2' :
				_html += "bottom : 0; top: auto;"
			break;
		}

		if(_p[0] == 1 && _p[1] == 1){
			_html += 'transform: translate(-50%, -50%);';
		}else if(_p[0] == 1 && _p[1] != 1){
			_html += 'transform: translate(-50%, 0);';
		}else if(_p[0] != 1 && _p[1] == 1){
			_html += 'transform: translate(0, -50%);';
		}else{
			_html += 'transform: translate(0, 0);';
		}

		this.setData({
			_position : _html,
			animate : animateIn
		})

		
	},
	methods : {
		hiddenPlate (){
			var _that = this;
			
			_that.triggerEvent('click', {});
		}
	}
})