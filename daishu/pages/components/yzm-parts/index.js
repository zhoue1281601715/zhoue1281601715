const { $Toast } = require('../../../utils/iview/base/index');
const Tools = require('../../../utils/modules/Tools');
import { Config } from '../../../config';
import NetWork from '../../../utils/modules/NetWork';

const app = getApp();

Component({
  relations: {
    '../form-parts/index': {
      type: 'parent'
    }
  },
	externalClasses: ['j-class', 'j-active-class'],
	properties : {
		time : {
			type : Number,
			value : 120
		},
		tip : {
			type : String,
			value : '发送验证码'
		},
		options : {
			type : Object,
			value : {
        url : '',
        data : {}
      }
		},
		tel : {
			type : String,
			value : '',
			require : true
		}
	},
	data : {
		yzm_status : true,
    _baseUrl: Config.baseUrl,
		_tip : '',
		_time : 0
	},
	attached : function (){
		this.setData({
			_tip : this.data.tip,
			_time: this.data.time
		})
	},
	methods : {
		yzm (){
			
			let _that = this;
			let tel = _that.data.tel;
			let bool = false;
			let net = new NetWork(Config.baseUrl)

			if(!_that.data.yzm_status) return false;

			let reg_tpl = /^1[34578]\d{9}$/;

			if(!reg_tpl.test(tel) || !tel){
				$Toast({
					content: '手机格式不正确',
					type: 'warning'
				});
				bool = true
			}

			if(!bool){
				
				app.http({
					obj : _that.data.options
				}).then(res => {
          _that.triggerEvent('success', {});
          _that.setData({
            _tip: _that.data._time + '秒再发送',
            yzm_status: false,
            yzm_tel: tel
          });

          let yzm = setInterval(function () {
            var cd = _that.data._time - 1;
            if (cd <= 0) {
              clearInterval(yzm)
              _that.setData({
                _tip: _that.data.tip,
                yzm_status: true,
                _time: _that.data.time
              });
            } else {
              _that.setData({
                _tip: cd + '秒再发送',
                _time: cd
              });
            }
          }, 1000)
          }).catch(() => {
            _that.triggerEvent('fail', {});
          })
			}
			
		},
	}
})