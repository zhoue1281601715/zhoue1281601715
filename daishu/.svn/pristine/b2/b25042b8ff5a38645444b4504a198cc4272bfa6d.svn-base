Component({
    externalClasses: ['i-class', 'i-class-mask'],
    // relations: {
    //   '../../../pages/plate-parts/index': {
    //     type: 'parent',
    //   }
    // },
    properties: {
        visible: {
            type: Boolean,
            value: false
        },
        title: {
            type: String,
            value: ''
        },
        showOk: {
            type: Boolean,
            value: true
        },
        showCancel: {
            type: Boolean,
            value: true
        },
        okText: {
            type: String,
            value: '确定'
        },
        cancelText: {
            type: String,
            value: '取消'
        },
        // 按钮组，有此值时，不显示 ok 和 cancel 按钮
        actions: {
            type: Array,
            value: []
        },
        // horizontal || vertical
        actionMode: {
            type: String,
            value: 'horizontal'
        },

        bg : {
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
        isHide : {
            type : Boolean,
            value : true
        }
    },
    methods: {
        handleClickItem ({ currentTarget = {} }) {
            const dataset = currentTarget.dataset || {};
            const { index } = dataset;
            this.triggerEvent('click', { index });
        },
        handleClickOk () {
            this.triggerEvent('ok');
        },
        handleClickCancel () {
            this.triggerEvent('cancel');
        },
        plateBg (){
            this.triggerEvent('plateBg', {});
        }
    }
});
