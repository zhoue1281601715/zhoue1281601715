const default_data = {
    isHide: false,
    content: '',
    icon: '',
    image: '',
    duration: 2.5,
    mask: true,
    type: 'default', // default || success || warning || error || loading
};

let timmer = null;

Component({
    externalClasses: ['i-class'],
    // relations: {
    //   '../../../pages/plate-parts/index': {
    //     type: 'parent',
    //   }
    // },
    data: {
        ...default_data
    },
    properties: {
        bg : {
            type : String,
            value : 'rgba(0,0,0,0)'
        },
        position : {
            type : String,
            value : '1,1'
        },
        animateIn : {
            type : String,
            value : 'bounceIn'
        },
        animateOut : {
            type : String,
            value : 'bounceOut'
        },
        animateDuration : {
            type : Number,
            value : .5
        },
        // isHide : {
        //     type : Boolean,
        //     value : true
        // }
    },
    methods: {
        handleShow (options) {
            const { type = 'default', duration = 2 } = options;

            this.setData({
                ...options,
                type,
                duration,
                isHide: true
            });

            const d = this.data.duration * 1000;

            if (timmer) clearTimeout(timmer);
            if (d !== 0) {
                timmer = setTimeout(() => {
                    // this.setData({
                    //     isHide : false
                    // })
                    this.handleHide();
                    timmer = null;
                }, d);
            }
        },

        handleHide () {
            this.setData({
              isHide: false
            });
        },
        plateBg (){
            this.triggerEvent('plateBg', {});
        }
    }
});
