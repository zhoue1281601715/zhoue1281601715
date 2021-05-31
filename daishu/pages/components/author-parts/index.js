import Authorization from '../../../utils/modules/Authorization.js';
const auth = new Authorization();

var app = getApp();
Component({
  data: {
    isShow : false
  },
  properties : {
  	ishidden : {
  		type : Boolean,
  		value : true
  	},
    require : {
      type : Boolean,   // 是否强制显示
      value : false
    },
    bgStyle : {
      type : String,
      value: '#2BA245'
    },
    textColor : {
      type : String,
      value : '#666'
    },
    title : {
      type : String,
      value: '小程序需要您的微信授权才能正常使用，申请获取以下权限：'
    },
    tips : {
      type : String,
      value: '获取您的公开信息（昵称、头像等）'
    },
    imgPath : {
      type : String,
      value: '/pages/components/authorization/authorization.jpg'
    }
  },
  observers : {
    'ishidden' : function (o){
      //console.log('1')
      var _that = this;
      var require = _that.data.require;
      if(!o){
        if(require){
          _that.setData({
            isShow: true
          });
        }else{
          auth._getSetting('userInfo').then(res => {

          }).catch(res => {
            _that.setData({
              isShow: true
            });
          })
        }
        
      }
    }
  },
  methods : {
  	loginGetUserInfo: function (e) {
	  	let _data = e.detail;

      this.setData({
        isShow : false
      })

	  	this.triggerEvent('getuserinfo', _data, {});
	  },
    cancel (){
      this.setData({
        isShow: false
      });

      this.triggerEvent('cancel', {}, {});
    }
  },
  lifetimes: {
    attached: function () {
      // var _that = this;
      // var dataHidden = _that.data.ishidden;
      // // 在组件实例进入页面节点树时执行
      // auth._getSetting('userInfo').then(res => {
        
      // }).catch(res => {
      //   if (!dataHidden){
      //     _that.setData({
      //       isShow : true
      //     });
      //   }
      // })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
