const app = getApp();
Component({
	options: {
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
	},
	relations: {
		'../yzm-parts/index': {
		  type: 'child', 
		}
	  },
	externalClasses: ['j-class', 'i-class'],
	properties : {
		type : {	/* 表单类型 */
			type : String,
			value : 'input'
		},
		title : {	/* 表单标题 */
			type : String,
			value : ''
		},
		placeholder : {   /* 表单placeholder type 为input、textarea才有 */
			type : String,
			value : ''
		},
		icon : {	/* 表单右侧图标 */
			type : String,
			value : ''
		},
		default : {
			type : Boolean,
			value : false
		},
		name : {
			type : String,
			value : ''
		},
		disabled : {
			type : Boolean,
			value : false
		},
		value : {
			type : String | Array | Object,
			value : ''
		},
		rangeKey : {
			type : String,
			value : ''
		},
		range : {
			type : Array,
			value : []
		},
		start : {
			type : String,
			value : ''
		},
		end : {
			type : String,
			value : ''
		},
		fields : {
			type : String,
			value : ''
		},
		customItem : {
			type : String,
			value : ''
		},
		subType : {
			type : String,
			value : 'selector'
		},
		
		checked : {
			type : Boolean,
			value : false
		},
		group : {
			type : Array | Object,
			value : []
		},
		img : {
			type : String,
			value : ''
		},
		placeholderClass : {
			type : String,
			value : ''
		},
		placeholderStype : {
			type : String,
			value : ''
		},
		maxlength : {
			type : Number,
			value : -1
		},
		autoFocus : {
			type : Boolean,
			value : false
		}
	},
	data : {
		
	},
	attached (){
		
	},
	methods : {
		cancel (e){
			this.triggerEvent('cancel', e);
		},
		change (e){
			//console.log(e)
			this.triggerEvent('change', e);
		},
		tapEvent (e){
			this.triggerEvent('tapEvent', e);
		},
    textareaAInput (e){
      this.triggerEvent('input', e)
    }
	}
})