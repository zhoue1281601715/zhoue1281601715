String.prototype.weekInMonthCount = function () {
    var date = new Date((new Date(this).setDate(1)) || (new Date()).setDate(1));
    var firstWeekDate = 1;// 默认第一周是本月1号  为了模拟本月1号是否为本月第1周的判断
    if (date.getDay() === 1) { // 判断1号是周一
        firstWeekDatek = 1;
    } else if (date.getDay() === 0) { // 判断1号是周日
        firstWeekDate = 8 - 7 + 1;
    } else { // 判断1号是周二至周六之间
        firstWeekDate = 8 - date.getDay() + 1;
    }
    date.setMonth(date.getMonth()+1);
    date.setDate(0);
    var monthHasDays = date.getDate();// 本月天数
    monthHasDays = date.getDate() - firstWeekDate + 1;
    var hasWeek = Math.ceil(monthHasDays/7); // 计算本月有几周
    return hasWeek;
};

// 获取今天是今年的第几周
String.prototype.weekIndexInYear = function () {
    var nowDate = new Date(this != '' ? this : new Date());
    var initTime = new Date(this != '' ? this : new Date());
    initTime.setMonth(0); // 本年初始月份
    initTime.setDate(1); // 本年初始时间
    var differenceVal = nowDate - initTime ; // 今天的时间减去本年开始时间，获得相差的时间
    var todayYear = Math.ceil(differenceVal/(24*60*60*1000)); // 获取今天是今年第几天
    var index = Math.ceil(todayYear/7); // 获取今天是今年第几周
    return index;
};

// 获取今天是今年的第几天
String.prototype.dateIndexInYear = function () {
    var nowDate = new Date(this != '' ? this : new Date());
    var initTime = new Date(this != '' ? this : new Date());
    initTime.setMonth(0); // 本年初始月份
    initTime.setDate(1); // 本年初始时间
    var differenceVal = nowDate - initTime ; // 今天的时间减去本年开始时间，获得相差的时间
    return Math.ceil(differenceVal/(24*60*60*1000));
};

// 获取今天是第几周
String.prototype.weekIndexInMonth = function () {
    var date = new Date(this.trim() != '' ? this : new Date());
    var dateStart = new Date((new Date(this.trim() != '' ? this : new Date()).setDate(1))); // 本月初
    var firstWeek = 1;
    if (dateStart.getDay() === 1) {
        firstWeek = 1;
    } else if (dateStart.getDay() === 0) {
        firstWeek = 8 - 7 + 1;
    } else {
        firstWeek = 8 - dateStart.getDay() + 1;
    }
    var weekIndex = 1;
    var c = date.getDate();
    if (date.getDay() === 1 && date.getDate() < 7) {
        weekIndex = 1;
    } else if (c < firstWeek ) {
        weekIndex = -1;
    } else {
        if (c < 7) {
            weekIndex = Math.ceil(c/7);
        } else {
            c =  c - firstWeek + 1;
            if (c%7 === 0) {
                if (dateStart.getDay() !== 6) {
                    weekIndex = c/7;
                } else {
                    weekIndex = c/7 + 1;
                }
            } else {
                weekIndex = Math.ceil(c/7);
            }
        }
    }
    return weekIndex;
};

function Calendar(obj = {}){

    this.callback = obj.hasOwnProperty('callback') ? obj.callback : function (){};

    var curValueArray = this.formatDate();
    this.curDay = curValueArray;
    this.isCur = false;   // 是否是本月

    var initValue = this.getFormat(curValueArray, 2)
    var dateData = this.calc(initValue)
    this.render(dateData);
}


Calendar.prototype.updateMonth = function (value, type="step"){

    var oldDate = JSON.parse(JSON.stringify(this.curDay));

    switch(type){
        case 'step' :
            if(value == -1){
                if(parseInt(oldDate[1]) == 1){
                    oldDate[0] -= 1;
                    oldDate[1] = 12;
        
                }else{
                    var oo = parseInt(oldDate[1]) + value;
                    if(oo < 10){
                        oo = '0' + oo;
                    }
                    oldDate[1] = oo;
        
                }
            }else if(value == 1){
                if(parseInt(oldDate[1]) == 12){
                    oldDate[0] += 1;
                    oldDate[1] = '01';
                }else{
                    var oo = parseInt(oldDate[1]) + value;
                    if(oo < 10){
                        oo = '0' + oo;
                    }
                    oldDate[1] = oo;
                }
            }
        break;
        case 'diy' :
            oldDate = value.split('-');
        break;
    }

    //console.log(oldDate)
    this.curDay = oldDate;
    var initValue = this.getFormat(oldDate, 2)
    var dateData = this.calc(initValue)
    this.render(dateData);

}	

Calendar.prototype.formatDate = function (str){
    var time, year, month, day;

    if(!str || str == ''){

        time = (new Date());
    }else{
        time = (new Date(parseInt(str)));
    }

    year = time.getFullYear();
    month = time.getMonth() + 1;
    day = time.getDate();

    if(month < 10){
        month = '0' + month;
    }else{
        month = month + ''
    }

    if(day < 10){
        day = '0' + day;
    }else{
        day = day + '';
    }

    return [year, month, day];
    
}

Calendar.prototype.getFormat = function (obj, num){
    if(typeof num == 'number'){
        if(num > 3 || num < 0){
            num = 3;
        }
    }else{
        num = 3
    }

    var offset = 3 - num;
    var o = JSON.parse(JSON.stringify(obj))
    o.splice(num, offset);
    return o.join('-');

}

Calendar.prototype.calc = function (date){
    var curMonth = new Date(date + '-01');
    var curArray = this.formatDate(curMonth.getTime());
    var oneDay = 3600 * 24 * 1000;
    var step = 0;
    

    var ka = curArray[1];
    var ka2 = curArray[1];
    var sjc = curMonth.getTime();

    var result = [];
    this.isCur = false;

    while(ka == ka2){

    
        var thisSjc = sjc + (step * oneDay);  // 当天时间戳
        var newThis = new Date(thisSjc);
        var thisDate = this.formatDate(thisSjc);   // 数组年月日
        var thisFormat = this.getFormat(thisDate);  // 格式化年月日

        var yearWeek = thisFormat.weekIndexInYear();  // 今年第几周

        /* 不全前面空虚 */
        
        if(result.length == 0){
            var bu_day = newThis.getDay();
            if(bu_day != 0){
                for(var i = bu_day; i > 0; i--){
                    var bu_thisSjc = sjc - (i * oneDay);  // 当天时间戳
                    var bu_newThis = new Date(bu_thisSjc);
                    var bu_thisDate = this.formatDate(bu_thisSjc);   // 数组年月日
                    var bu_thisFormat = this.getFormat(bu_thisDate);  // 格式化年月日



                    var bu_re = {
                        week : bu_newThis.getDay(),
                        year : bu_thisDate[0],
                        month : bu_thisDate[1],
                        day : bu_thisDate[2],
                        weekinyear : yearWeek,
                        current : false,
                        this : false
                    }

                    result.push(bu_re)

                }
            }
        }

        /* 不全前面空虚 end */

        var _this = false;
        if(thisFormat == this.getFormat(this.formatDate((new Date()).getTime()))){
             _this = true;
             this.isCur = true;
        }
        if(ka == thisDate[1]){
            var re = {
                week : newThis.getDay(),
                year : thisDate[0],
                month : thisDate[1],
                day : thisDate[2],
                weekinyear : yearWeek,
                current : true,
                this : _this
            }

            result.push(re)
            ++step;

        }else{
            ka2 = thisDate[1];
        }
    }

    /* 后面不全补空 */
    var af_index = result.length;
    if(af_index < 42){
        var end = 42 - af_index + step;
        for(var i = step; i < end; i++){
            var af_thisSjc = sjc + (i * oneDay);  // 当天时间戳
            var af_newThis = new Date(af_thisSjc);
            var af_thisDate = this.formatDate(af_thisSjc);   // 数组年月日
            var af_thisFormat = this.getFormat(af_thisDate);  // 格式化年月日

            var af_re = {
                week : af_newThis.getDay(),
                year : af_thisDate[0],
                month : af_thisDate[1],
                day : af_thisDate[2],
                weekinyear : yearWeek,
                current : false,
                this : false
            }

            result.push(af_re)

        }
    }
    /* 后面不全补空 END */

    return result;


}

Calendar.prototype.render = function (obj){
    var tpl = [];
    var week = 0;

    //var html = '<tr><th style="width: 2%;">周</th><th style="width: 14%;">周日</th><th style="width: 14%;">周一</th><th style="width: 14%;">周二</th><th style="width: 14%;">周三</th><th style="width: 14%;">周四</th><th style="width: 14%;">周五</th><th style="width: 14%;">周六</th></tr><tr>';

    obj.forEach(function (cur, index, array){

        //if(index % 7 == 0) html += '</tr><tr>';
        if(index == 0) week = cur.weekinyear;

        if(index == 0 || index % 7 == 0){
           // html += `<td style="vertical-align:top"><br/>${week}</td>`;
            ++week;
        }

       // html += '<td>';

      //  var tpl_class = '';

       // if(cur.this) tpl_class += 'active '
       // if(!cur.current) tpl_class += 'nocur '
        

        // html+= `<div class="curriculum-div ${tpl_class}" data-url="/">`;
        // html+= `<div class="cur-div-day" data-day="${cur.day}" onclick="showSingle(event)">${cur.day}</div>`;
        // html+= '<div class="cur-div-lists">';
        // //html+= '<p>06:00 000(老師C)</p>';
        // //html+= '<p>06:00 000(老師C)</p>';
        // html+= '</div>';
        // html+= '</div>';
        // html+= '</td>';

    })

   // html += '</tr>';


   // $('.table-render').html(html);
    
    //console.log(obj)
   // this.callback(this.curDay, this.isCur);
   this.callback(obj);
}

export {Calendar};

// var c = new Calendar({
//     callback : function (date, cur){
        
//         var month = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

//         $('.curYear').html(date[0]);
//         $('.curMonth').html(month[parseInt(date[1]) - 1]);
//         $('.curriculum-currday').hide();

//         if(cur){
//             $('.today').prop('disabled', true)
//         }else{
//             $('.today').prop('disabled', false)
//         }
//     }
// })