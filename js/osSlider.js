/**
 * osSlider 闃冲厜杞挱鎻掍欢 v1.0
 * objs 浼犻€佸璞�
 */
function osSlider(objs) {
    var that = this; //that鑾峰緱this鐨勪綔鐢ㄥ煙 鍚庨潰閮芥槸that 闃叉骞叉壈
    that.objs = objs; //灏嗕紶閫佹潵鐨勫璞¤祴浜坱his
    that.pNode = $(that.objs.pNode); //pNode杞挱瀹瑰櫒瀵硅薄
    that.cNodes = that.pNode.find(that.objs.cNode); //cNodes杞挱瀛愯妭鐐瑰璞￠泦鍚�
    that.cNodeNums = that.cNodes.length; //棰勫瓨杞挱浣撶殑鎬绘暟
    that.nowNodeKey = 0; //鍒濆绗竴娆￠粯璁ゆ樉绀鸿妭鐐逛负绗竴涓�
    that.width = that.cNodes.find('img').width();//寰楀埌瀹瑰櫒鐨勫搴�
    that.height = that.cNodes.find('img').height();//寰楀埌瀹瑰櫒鐨勯珮搴�
    that.moveFlag = true;//娣诲姞鏄惁鍙互杩涜涓嬩竴涓疆鎾姸鎬�
    that.isPause = false;//鏄惁鏆傚仠鐘舵€�
    that.speedNum = 0;//鑷姩杞挱鐨勮鏁�
    if (!that.objs.speed) {//娣诲姞榛樿鏃堕棿
        that.objs.speed = 3000;
    }
    if (!that.objs.autoPlay) {//娣诲姞榛樿鑷姩鎾斁
        that.objs.autoPlay = true;
    }
    that.init = function() {//杞挱鐨勫垵濮嬪寲
        that.pNode.addClass('osSlider-main');
        that.pNode.css({//杞挱瀹瑰櫒鐨勫ぇ灏忔帶鍒� 鍚敤bfc妯″紡
            'width':that.width,
            'height':that.height,
            'overflow':'hidden',
            'position':'relative'
        });
        //鍒涘缓涓婁笅鏉″垏鎹㈡寜閽�
        var $toggleBtn = $('<ul class="slider-btn"><li class="slider-btn-prev">prev</li><li class="slider-btn-next">next</li></ul>');
        $toggleBtn.appendTo(that.pNode);
        //涓哄垏鎹㈡寜閽粦瀹氫簨浠�
        $(that.pNode).find('.slider-btn-prev').bind('click',function(){
            that.toggleMove('prev');
        });
        $(that.pNode).find('.slider-btn-next').bind('click',function(){
            that.toggleMove('next');
        });
        //涓洪珮浜鑸垱寤鸿妭鐐�
        var $navParent = $('<ul class="slider-nav"></ul>');
        $navParent.appendTo(that.pNode);
        that.cNodes.each(function(index, el) {//閲囩敤閬嶅巻锛屾坊鍔犲墠鍚庨『搴�
            if (index==0) {//璁╃涓€涓樉绀哄湪鍓嶉潰 鍚屾椂涓烘瘡涓疆鎾綋鍒涘缓瀵瑰簲nav鐐�
                var indexNum = 20;
                $navParent.append('<li class="active">'+(index+1)+'</li>');
            } else {
                var indexNum = index;
                $navParent.append('<li>'+(index+1)+'</li>');
            }
            $(this).css({//涓烘瘡涓€涓疆鎾綋娣诲姞鏍峰紡鍜岄『搴�
                'width':that.width + 'px',
                'height':that.height + 'px',
                'overflow':'hidden',
                'position':'absolute',
                'top':'0px',
                'left':'0px',
                'z-index':indexNum
            });
        });
        //涓洪珮浜鑸妭鐐圭粦瀹氫簨浠�
        $(that.pNode).find('.slider-nav li').each(function(index, el) {
            $(this).bind('click',function(){
                that.toggleMove(false,index);
            });
        });
        //鍒ゆ柇鏄惁鑷姩鎾斁
        if (that.objs.autoPlay) {
            that.moveTime();
        }
    }
    /**
     * 鍒囨崲杞挱鍚� 杞挱瀵艰埅鐨勯珮浜�
     * @param {Number} tid
     */
    that.sliderNavToggle = function(tid,nid) {
        $('.slider-nav li').each(function(index, el) {
            if (index==tid||index==nid) {
                $(this).toggleClass('active');
            }
        });
    }
    /**
     * 鍒囨崲鏁堟灉鎸囦护鍑芥暟 閬垮厤BUG
     * @param {String} command 'prev'|'next'
     * @param {Number} tid 涓嬩竴涓鍒囨崲鐨則id
     * command涓巘id鍙互缂虹渷涓€涓紝鍑芥暟鑷姩鍒ゆ柇
     */
    that.toggleMove = function(command,tid) {
        if (that.moveFlag) {
            if (!command) {
                if (that.nowNodeKey==tid) {
                    return;
                } else if ((that.nowNodeKey==0&&tid==that.cNodeNums-1)||tid<that.nowNodeKey) {
                    command = 'prev';
                } else {
                    command = 'next';
                }
            }
            if (!tid) {
                if(tid==0) {
                } else if (command=='prev') {
                    tid = that.nowNodeKey-1;
                    if (that.nowNodeKey==0) {
                        tid = that.cNodeNums-1;
                    }
                } else {
                    tid = that.nowNodeKey+1;
                    if (that.nowNodeKey==that.cNodeNums-1) {
                        tid = 0;
                    }
                }
            }
            /**
             * 闅忔満鍑芥暟
             */
            function random(min,max) {
                return Math.floor(Math.random()*(max+1)-min);
            }
            that.moveSwitch(random(0,6),command,tid);
        }
    }
    /**
     * 鏍规嵁鍒嗛厤鐨勫垏鎹㈡寚浠ゆ墽琛屾晥鏋�
     * @param {Number} mid 鍔ㄧ敾鎸囦护
     * @param {String} command 'prev'|'next'
     * @param {Number} tid 涓嬩竴涓鍒囨崲鐨則id
     */
    that.moveSwitch = function(mid,command,tid) {
        nid = that.nowNodeKey;
        that.moveFlag = false;
        that.speedNum = 0;
        that.sliderNavToggle(nid,tid);
        switch (mid) {
            case 0:
                that.gridTop(tid,0);
                break;
            case 1:
                that.gridTop(tid,1);
                break;
            case 2:
                that.gridTop(tid,2);
                break;
            case 3:
                that.gridLeft(tid,0);
                break;
            case 4:
                that.gridLeft(tid,1);
                break;
            case 5:
                that.gridLeft(tid,2);
                break;
            case 6:
                that.cellToggle(tid);
                break;
            default:
                that.gridTop(tid);
                break;
        }
    }
    /**
     * 鏍呮牸涓婁笅鍒囨崲
     */
    that.gridTop = function(tid,showNum) {
        that.cNodes[tid].style.zIndex = 19;//璁╀笅涓妭鐐瑰噯澶囧ソ
        var $backHTML = that.cNodes[that.nowNodeKey].innerHTML;//澶囦唤褰撳墠鑺傜偣鐨勫唴瀹�
        that.cNodes[that.nowNodeKey].innerHTML = '';//娓呯┖鑺傜偣锛屾柟渚夸娇鐢�
        for (var i = 0; i < 12; i++) {//鍒╃敤寰幆 鍒涘缓鍑烘爡鏍艰妭鐐�
            var $cvNode = $('<div class="cvNode"></div>');
            $(that.cNodes[that.nowNodeKey]).append($cvNode);
            $cvNode.html($backHTML);
            $cvNode.css({//涓烘瘡涓爡鏍艰妭鐐规坊鍔燾ss鏍峰紡
                'position':'absolute',
                'width':that.width/12+'px',
                'height':that.height+'px',
                'zIndex':20,
                'overflow':'hidden',
                'left':that.width/12*i+'px',
                'top':'0'
            });
            $cvNode.find('*').first().css({
                'display':'block',
                'margin-left':that.width/-12*i+'px'
            });
        }

        //鍒嗛厤瀵瑰簲鏁堟灉
        switch (showNum) {
            default:
            case 0:
                //娣诲姞鍔ㄧ敾杩囨浮鏁堟灉 寮犵墮鑸炵埅
                $(that.cNodes[that.nowNodeKey]).find('.cvNode').each(function(index,el){
                    if (index%2==0) {
                        var topNums = that.height;
                    } else {
                        var topNums = that.height*-1;
                    }
                    $(this).animate({
                        top:topNums + 'px'
                    },1500);
                });
                setTimeout(function(){//鍔ㄧ敾缁撴潫鍚庡紑濮嬫仮澶嶅師鏈夌姸鎬�
                    that.moveFlag = true;
                    that.cNodes[tid].style.zIndex = 20;
                    that.cNodes[that.nowNodeKey].style.zIndex = that.nowNodeKey;
                    $(that.cNodes[that.nowNodeKey]).html($backHTML);//娓呴櫎鍔ㄧ敾浜х敓鐨勫浣欏唴瀹�
                    that.nowNodeKey = tid;//寰楀埌鏂扮殑褰撳墠鑺傜偣key
                },1500);
                break;
            case 1:
                //鍏煎鍒颁笅闈�
            case 2:
                if (showNum==1) {
                    //娣诲姞鍔ㄧ敾杩囨浮鏁堟灉 涓嬮檷
                    $(that.cNodes[that.nowNodeKey]).find('.cvNode').each(function(index,el){
                        var sp = 80*index;
                        $(this).animate({
                            top: $(this).height() + 'px'
                        },500+sp);
                    });
                } else {
                    //娣诲姞鍔ㄧ敾杩囨浮鏁堟灉 涓婂崌
                    $(that.cNodes[that.nowNodeKey]).find('.cvNode').each(function(index,el){
                        var sp = 80*index;
                        $(this).animate({
                            top: $(this).height()*-1 + 'px'
                        },500+sp);
                    });
                }
                setTimeout(function(){//鍔ㄧ敾缁撴潫鍚庡紑濮嬫仮澶嶅師鏈夌姸鎬�
                    that.moveFlag = true;
                    that.cNodes[tid].style.zIndex = 20;
                    that.cNodes[that.nowNodeKey].style.zIndex = that.nowNodeKey;
                    $(that.cNodes[that.nowNodeKey]).html($backHTML);//娓呴櫎鍔ㄧ敾浜х敓鐨勫浣欏唴瀹�
                    that.nowNodeKey = tid;//寰楀埌鏂扮殑褰撳墠鑺傜偣key
                },1380);
                break;
        }
    }

    /**
     * 鏍呮牸宸﹀彸寮犵墮鑸炵埅鍒囨崲
     */
    that.gridLeft = function(tid,showNum) {
        that.cNodes[tid].style.zIndex = 19;//璁╀笅涓妭鐐瑰噯澶囧ソ
        var $backHTML = that.cNodes[that.nowNodeKey].innerHTML;//澶囦唤褰撳墠鑺傜偣鐨勫唴瀹�
        that.cNodes[that.nowNodeKey].innerHTML = '';//娓呯┖鑺傜偣锛屾柟渚夸娇鐢�
        for (var i = 0;i<12;i++) {//鍒╃敤寰幆 鍒涘缓鍑烘爡鏍艰妭鐐�
            var $cvNode = $('<div class="cvNode"></div>');
            $(that.cNodes[that.nowNodeKey]).append($cvNode);
            $cvNode.html($backHTML);
            $cvNode.css({//涓烘瘡涓爡鏍艰妭鐐规坊鍔燾ss鏍峰紡
                'position':'absolute',
                'width':that.width+'px',
                'height':that.height/12+'px',
                'zIndex':20,
                'overflow':'hidden',
                'left':'0',
                'top':that.height/12*i+'px',
            });
            $cvNode.find('*').first().css({
                'display':'block',
                'margin-top':that.height/-12*i+'px'
            });
        }
        switch (showNum) {
            default:
            case 0:
                //娣诲姞鍔ㄧ敾杩囨浮鏁堟灉 寮犵墮鑸炵埅
                $(that.cNodes[that.nowNodeKey]).find('.cvNode').each(function(index,el){
                    if (index%2==0) {
                        var leftNums = that.width;
                    } else {
                        var leftNums = that.width*-1;
                    }
                    $(this).animate({
                        'left':leftNums + 'px'
                    },1500);
                });
                break;
            case 1:
            case 2:
                if (showNum==1) {
                    //娣诲姞鍔ㄧ敾杩囨浮鏁堟灉 鍚戝乏
                    $(that.cNodes[that.nowNodeKey]).find('.cvNode').each(function(index,el){
                        var sp = 80*index;
                        $(this).animate({
                            'left':that.width*-1 + 'px'
                        },620+sp);
                    });
                } else {
                    //娣诲姞鍔ㄧ敾杩囨浮鏁堟灉 鍚戝彸
                    $(that.cNodes[that.nowNodeKey]).find('.cvNode').each(function(index,el){
                        var sp = 80*index;
                        $(this).animate({
                            'left':that.width + 'px'
                        },620+sp);
                    });
                }
                break;
        }
        setTimeout(function(){//鍔ㄧ敾缁撴潫鍚庡紑濮嬫仮澶嶅師鏈夌姸鎬�
            that.moveFlag = true;
            that.cNodes[tid].style.zIndex = 20;
            that.cNodes[that.nowNodeKey].style.zIndex = that.nowNodeKey;
            $(that.cNodes[that.nowNodeKey]).html($backHTML);//娓呴櫎鍔ㄧ敾浜х敓鐨勫浣欏唴瀹�
            that.nowNodeKey = tid;//寰楀埌鏂扮殑褰撳墠鑺傜偣key
        },1500);
    }

    //鏍煎瓙鍒囨崲鏁堟灉
    that.cellToggle = function(tid) {
        that.cNodes[tid].style.zIndex = 19;//璁╀笅涓妭鐐瑰噯澶囧ソ
        var $backHTML = that.cNodes[that.nowNodeKey].innerHTML;//澶囦唤褰撳墠鑺傜偣鐨勫唴瀹�
        that.cNodes[that.nowNodeKey].innerHTML = '';//娓呯┖鑺傜偣锛屾柟渚夸娇鐢�
        for (var i = 0;i<20;i++) {//鍒╃敤寰幆 鍒涘缓鍑烘爡鏍艰妭鐐�
            if (i<5) {//琛屾暟鍒ゆ柇
                var rows = 0;
            } else if (i<10) {
                var rows = 1;
            } else if (i<15) {
                var rows = 2;
            } else {
                var rows = 3;
            }
            var $cvNode = $('<div class="cvNode"></div>');
            $(that.cNodes[that.nowNodeKey]).append($cvNode);
            $cvNode.html($backHTML);
            $cvNode.css({//涓烘瘡涓爡鏍艰妭鐐规坊鍔燾ss鏍峰紡
                'position':'absolute',
                'width':that.width/5+'px',
                'height':that.height/4+'px',
                'zIndex':20,
                'overflow':'hidden',
                'left':that.width/5*(i%5)+'px',
                'top':that.height/4*rows+'px',
            });
            $cvNode.find('*').first().css({
                'display':'block',
                'margin-left':that.width/-5*(i%5)+'px',
                'margin-top':that.height/-4*rows+'px',
            });
        }
        //娣诲姞鍔ㄧ敾杩囨浮鏁堟灉
        $(that.cNodes[that.nowNodeKey]).find('.cvNode').each(function(index,el){
            if (index%2==0) {
                $(this).find('*').first().animate({
                    "margin-left": $(this).width() + 'px'
                }, 500);
            }
        });
        setTimeout(function(){
            $(that.cNodes[that.nowNodeKey]).find('.cvNode').each(function(index,el){
                if (index%1==0) {
                    $(this).find('*').first().animate({
                        "margin-left": $(this).width() + 'px'
                    }, 500);
                }
            });
        },600);
        setTimeout(function(){//鍔ㄧ敾缁撴潫鍚庡紑濮嬫仮澶嶅師鏈夌姸鎬�
            that.moveFlag = true;
            that.cNodes[tid].style.zIndex = 20;
            that.cNodes[that.nowNodeKey].style.zIndex = that.nowNodeKey;
            $(that.cNodes[that.nowNodeKey]).html($backHTML);//娓呴櫎鍔ㄧ敾浜х敓鐨勫浣欏唴瀹�
            that.nowNodeKey = tid;//寰楀埌鏂扮殑褰撳墠鑺傜偣key
        },1100);
    }

    //鑷姩鎾斁鎺у埗鏂规硶
    that.moveTime = function() {
        setTimeout(function(){
            if (that.moveFlag) {
                that.speedNum++;
                if (that.speedNum>=that.objs.speed/100) {
                    that.speedNum = 0;
                    that.toggleMove('next');
                }
            }
            if (!that.isPause) {
                setTimeout(arguments.callee,100);
            }
        },100);
    }
    that.init();
}