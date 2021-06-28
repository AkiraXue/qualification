$(function () {
    //构造函数
    (function () {
        var that = null;

        function App() {
            that = this;
            // 获取 屏幕宽高
            this.winW = document.body.clientWidth;
            this.winH = document.body.clientHeight;
            // 全局基础 接口地址
            this.apiUrl = window.apiUrl;
            this.imgBase = null;
            that.imgLoading = {
                ImagesSrc: [
                    'img/bg1.png',
                    'img/bg2.png',
                    'img/bg3.png',
                    'img/bg4.png',
                    'img/bg5.png',
                    'img/bg6.png',
                    'img/loading.png',
                    'img/p1_1.png',
                    'img/p1_3.png',
                    'img/p1_4.png',
                    'img/p1_5.png',
                    'img/p1_6.png',
                    'img/p1_7.png',
                    'img/p1_8.png',
                    'img/p1_9.png',
                    'img/p1_10.png',
                    'img/p1_11.png',
                    'img/p1_12.png',
                    'img/p1_13.png',
                    'img/p2_1.png',
                    'img/p2_2.png',
                    'img/p2_3.png',
                    'img/p2_4.png',
                    'img/p2_5.png',
                    'img/p2_6.png',
                    'img/p2_7.png',
                    'img/p2_8.png',
                    'img/p2_9.png',
                    'img/p2_10.png',
                    'img/p3_1.png',
                    'img/p3_2.png',
                    'img/p4_1.png',
                    'img/p4_2.png',
                    'img/p4_3.png',
                    'img/p4_4.png',
                    'img/p4_5.png',
                    'img/p4_6.png',
                    'img/p4_7.png',
                    'img/p4_8.png',
                    'img/p4_9.png',
                    'img/p4_10.png',
                    'img/p4_11.png',
                    'img/p4_12.png',
                    'img/p4_13.png',
                    'img/p4_14.png',
                    'img/p4_15.png',
                    'img/p4_bg.png',
                    'img/qd.png'
                ],
                p: 0, //进度
                Srcs: null,
                imgs: {},
                court: 0
            };
            this.init();
        }
        //原型方法
        App.prototype = {
            init: function () {
                that.LoadingImages();
                that.scrollAuto();
                that.event();
                that.share();
            },
            /*================================================ 项目中所有的事件 =================================================*/
            event: function () {
                // 默认设备横屏的时候出现提示
                new LandscapeTip();
                // loading
                var i = 0;
                var time = setInterval(function () {
                    $('.loading p').html(i + '%');
                    i++;
                    if (i > 100) {
                        clearInterval(time);
                        $('.loading').fadeOut();
                        $('.homepage').fadeIn();
                    }
                }, 50);
                // 背景音乐
                document.addEventListener("WeixinJSBridgeReady", function () {
                    $('.bgm audio')[0].play()
                }, false);
                $('.bgm').tap(function () {
                    var bgm = $('.bgm audio')[0].paused;
                    var bgmimgsrc = !bgm ? 'img/pause.png' : 'img/play.png';
                    !bgm ? $('.bgm audio')[0].pause() : $('.bgm audio')[0].play();
                    $('.bgm img').prop('src', bgmimgsrc);
                });
                // 选择性别
                var sex = null; //性别判断
                $('.female,.male').tap(function () {
                    sex === null && $('.upload').fadeIn().removeClass('dn');
                    sex = $(this).hasClass('male');
                    $('.male img')[0].src = 'img/p1_4.png';
                    $('.female img')[0].src = 'img/p1_4.png';
                    $(this).children()[0].src = 'img/p1_3.png';
                    sex ? $('.genderTips').addClass('tipsbg') : $('.genderTips').removeClass('tipsbg');
                    $('.gender .tips').fadeOut();
                });
                // 点击上传照片
                $('.upload').tap(function () {
                    $('.title img').removeClass('shake');
                    $('.title').css('top', '10vw');
                    $('.gender').addClass('dn');
                    $('.uploadImg').fadeIn()
                    firstSet = sex ? 'qc_304317_724083_5' : 'qc_304317_340293_7';
                    secondSet = sex ? 'qc_304317_131221_6' : 'qc_304317_651952_8';
                });
                var uploader2 = new ImgUploader({
                    outputType: 'png',
                    callback: function (res) {
                        // console.log('callback', res.img);
                        that.imgBase = res.img;
                        document.getElementById('preview').src = res.img;
                    }
                });
                $('#file').tap(function (e) {
                    e.stopPropagation();
                    uploader2.select();
                });
                // 确定上传
                $('.determine1').tap(function () {
                    if (!that.imgBase) {
                        $('.uploadImg .tips').removeClass('enlarge');
                        setTimeout(function () {
                            $('.uploadImg .tips').addClass('enlarge');
                        }, 10);
                        return;
                    };
                    getPhotoBase(firstSet);
                });
                // 重新上传照片
                $('.photograph .return').tap(function () {
                    $('.photograph').fadeOut();
                    $('.homepage').fadeIn();
                    that.imgBase = null;
                    $('#preview').prop('src', 'img/p1_12.png');
                    imgArr = [];
                });
                // 选择人物
                let firstSet, secondSet; //服装
                let imgArr = [];
                $('.man').tap(function () {
                    if (imgArr.length === 2) {
                        // console.log(imgArr[0],imgArr[1]);
                        $('.man').addClass('shifLeft');
                        setTimeout(function () {
                            $('.man img').prop('src', imgArr[0]);
                            $('.man').removeClass('shifLeft');
                            [imgArr[0], imgArr[1]] = [imgArr[1], imgArr[0]];
                        }, 800);
                        return;
                    }
                    [firstSet, secondSet] = [secondSet, firstSet];
                    $('.man').addClass('shifLeft');
                    getPhotoBase(firstSet, function () {
                        setTimeout(function () {
                            $('.man').removeClass('shifLeft');
                        }, 800);
                    });
                });
                // 选择场景
                let index = 3; //默认场景
                let swiper = new Swiper('.swiper-container', {
                    slidesPerView: 3,
                    spaceBetween: 10,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    on: {
                        tap: function () {
                            index = this.clickedIndex >= 0 ? this.clickedIndex + 1 : index;
                            $('.scenebg').fadeOut(function () {
                                $('.scenebg').prop('src', 'img/bg' + index + '.png');
                            });
                            setTimeout(function () {
                                $('.scenebg').fadeIn(function () {
                                    $('.photograph').css('backgroundImage', 'url(img/bg' + index + '.png)')
                                });
                            }, 500);
                        }
                    }
                });
                // 按下快门
                let date = new Date();
                let all = ['北京南站', '运动青春', '阳光教室', '丽泽SOHO', '卢沟晓月', '北京园博园'];
                $('.shutter').tap(function () {
                    $('.posterbg').prop('src', 'img/bg' + index + '.png');
                    html2canvas($('.found')[0], {
                        allowTaint: true
                    }).then(function (canvas) {
                        let url = canvas.toDataURL();
                        $('.photo img').attr('crossOrigin', 'Anonymous');
                        $('.photo img').prop('src', url);
                    });
                    $('.sceneName').html('• ' + all[index - 1]);
                    $('.date').html('• ' + date.getFullYear() + '.' + (date.getMonth() + 1) + '.' + date.getDate())
                    $('.photograph').fadeOut();
                    $('.poster').fadeIn();
                });
                // 重新选择场景
                $('.poster .return').tap(function () {
                    $('.poster').fadeOut();
                    $('.photobg .tips').fadeOut();
                    $('.determine2').fadeOut();
                    $('.photograph').fadeIn();
                    swiper.update();
                    $('.result').prop('src', '');
                    $('.addMessage').css('backgroundColor', 'transparent');
                    $('.addMessage img').prop('src', '');
                });
                // 合成图片
                $('.determine2').tap(function () {
                    $(this).fadeOut();
                    $('.poster .tips').fadeIn();
                    html2canvas($('.photobg')[0], {
                        allowTaint: true
                    }).then(function (canvas) {
                        let url = canvas.toDataURL();
                        $('.result').attr('crossOrigin', 'Anonymous');
                        $('.result').prop('src', url);
                    });
                });
                // 添加寄语
                $('.addMessage').tap(function () {
                    $('.poster').fadeOut();
                    $('.graduation').fadeIn();
                });
                // 选择寄语
                let msgIndex = 0; //默认寄语
                $('.message').on('tap', 'li', function () {
                    msgIndex = $(this).index();
                    $('.message').find('li').removeClass('current');
                    $('.circular').prop('src', 'img/p4_1.png');
                    $(this).find('.circular').prop('src', 'img/p4_2.png');
                    $(this).addClass('current');
                });
                $('.determine3').tap(function () {
                    $('.addMessage').css('backgroundColor', '#ffffff');
                    $('.addMessage img').prop('src', 'img/p4_' + (msgIndex + 3) + '.png');
                    $('.graduation').fadeOut();
                    $('.poster').fadeIn();
                    $('.determine2').fadeIn();
                });
                // 获取人脸
                function getPhotoBase(id, func) {
                    $('.mask').fadeIn();
                    $.ajax({
                        url: 'https://fengtai-td.h5.yscase.com/api/index.php/front/compose',
                        type: "POST",
                        data: {
                            template_id: id,
                            img_url: that.imgBase
                        },
                        success: function (res) {
                            if (res.code === 200) {
                                $('.mask').fadeOut(function () {
                                    $('.mask').hide();
                                    func && func();
                                });
                                imgArr.push('data:image/png;base64,' + res.data.image);
                                $('.man img').prop('src', 'data:image/png;base64,' + res.data.image);
                                $('.homepage').fadeOut();
                                $('.photograph').fadeIn(function () {
                                    swiper.update();
                                    $('.man').removeClass('shifLeft');
                                });
                            } else {
                                var info = {
                                    type: 'info', //必须 类型String  接收 info
                                    config: {
                                        txt: '请上传清晰的人脸照片', //必须  说明文字
                                        btn: '确定', //必须  按钮
                                        success: function () { //必须  回调函数
                                            ysLayerinfo.fadeOut()
                                        }
                                    }
                                };
                                var ysLayerinfo = new YsLayer(info);
                                ysLayerinfo.fadeIn();
                                $('.mask').fadeOut();
                            }
                        }
                    });
                }

                // 解决手机 键盘
                $('input').blur(function () {
                    setTimeout(() => {
                        var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
                        window.scrollTo(0, Math.max(scrollHeight, 0))
                    }, 100)
                });
            },
            /*================================================ 截取网址参数 ====================================================*/
            getQueryString: function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null)
                    return unescape(r[2]);
                return null;
            },
            /*================================================ 加载图片 ========================================================*/
            LoadingImages: function () {
                var Srcs = that.imgLoading.ImagesSrc;
                var len = Srcs.length;
                var id;
                //加载图片方法
                for (var i = 0; i < len; i++) {
                    id = Srcs[i].id ? Srcs[i].id : i;
                    that.imgLoading.imgs[id] = new Image();
                    that.imgLoading.imgs[id].onload = function () {
                        that.imgLoading.p = 100 * ((that.imgLoading.court + 1) / len);
                        that.imgLoading.p = parseInt(that.imgLoading.p);
                        progress(that.imgLoading.p);
                        if (that.imgLoading.court >= len - 1)
                            complete(that.imgs);
                        that.imgLoading.court++;
                    };

                    if (Srcs[i].id) {
                        that.imgLoading.imgs[id].src = Srcs[i].src;
                    } else {
                        that.imgLoading.imgs[id].src = Srcs[i];
                    }
                }

                //加载进度
                function progress(loadNum) {};
                //加载完成
                function complete(images) {};
            },
            /*================================================ 微信分享 =========================================================*/
            share: function () {
                new WechatJSSDK({
                    title: '云端教师证——2020年丰台区新教师培训',
                    desc: '为你送上一份特别的入职记忆～',
                    link: location.href,
                    imgUrl: 'http://fengtai-td.h5.yscase.com/img/share.jpg'

                });
            },
            /*================================================ 禁止屏幕滚动 ======================================================*/
            scrollAuto: function () {
                document.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                    return false;
                }, {
                    passive: false
                });
            }
        }
        var app = new App();
    })();
})