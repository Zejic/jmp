/**
 * Created by jianwuzhang on 2016/10/11.
 */
(function ($) {
var jumpTips = function (elem, opts) {
var def = {
            jmpElem: '',
            tmp: 'def',
            jmpId: 'jmpZ',
            dataJmp: 'jmpD',
            contentData: 'content',
            position: 'bl',
            className: '',
            autoPos: 1,
            jmpStyle: {},
            leaveShow: 0
};
this.$el = $(elem);
this.opts = $.extend(def, opts);
this.ui = {};
this.tmp = {};
this.init();
    };

jumpTips.prototype = {
init: function () {
this.initElements();
this.initTmp();
$.browser.isIPad ? this.bindIPadEvents() : this.bindEvents();
        },
initElements: function () {
this.ui.body = $('body');
this.ui.window = $(window);
if($.browser.isIPad && !window['ipad_body_touch']){
                window['ipad_body_touch'] = {
                    isStartEvent: 0,
                    currentJumpId: ''
};
            }
        },
initTmp: function () {
this.tmp = {
                info: '${content}',
                def: '<div style="z-index: 1005; margin: 0; position: absolute; min-width: 50px; max-width: 450px;padding: 8px 10px;">${content}</div>'
};
        },
createEl: function (content) {
var div = document.createElement('div');
            div.innerHTML = content;
return div.firstChild;
        },
bindEvents: function () {
var self = this;
this.$el.on('mouseenter', this.opts.jmpElem, function (e) {
                self.jmpBind($(this));
            }).on('mouseleave', this.opts.jmpElem, function (e) {
var tar = $(this);
if(self.opts.leaveShow && e.relatedTarget && e.relatedTarget.id == tar.data(self.opts.dataJmp)){
return false;
                }
                self.hideJmp(tar);
            });
        },
bindIPadEvents: function () {
var self = this;
this.$el.on('mouseenter touchstart', this.opts.jmpElem, function (e) {
                self.jmpBind($(this));
                window['ipad_body_touch'].currentJumpId = $(this).data(self.opts.dataJmp);
            }).on('mouseleave', this.opts.jmpElem, function (e) {
var tar = $(this);
if(self.opts.leaveShow && e.relatedTarget && e.relatedTarget.id == tar.data(self.opts.dataJmp)){
return false;
                }
                self.hideJmp(tar);
            });
if(window['ipad_body_touch'] && !window['ipad_body_touch'].isStartEvent){
this.ui.body.on('touchstart', function () {
$(this).find('[id^="' + self.opts.jmpId + '"]').hide();
                    window['ipad_body_touch'].currentJumpId && $('#' + window['ipad_body_touch'].currentJumpId).show();
                    window['ipad_body_touch'].currentJumpId = '';
                });
                window['ipad_body_touch'].isStartEvent = 1;
            }
        },
jmpBind: function ($this) {
$this.data(this.opts.dataJmp) ? this.showJmp($this) : this.createJmp($this);
        },
createJmp: function ($this) {
var html = this.getContent($this),
                $jmp = $(this.createEl(html)),
                jid = this.opts.jmpId + +new Date();
$this.data(this.opts.dataJmp, jid);
            $jmp.attr('id', jid);
            $jmp.css(this.opts.jmpStyle);
this.opts.className && $jmp.addClass(this.opts.className);
this.ui.body.append($jmp);
            $jmp.css({
                left: this.getPositionLeft($this, $jmp),
                top: this.getPositionTop($this, $jmp),
                visibility: 'visible'
});
this.opts.leaveShow && this.jmpBindEvent($jmp);
        },
jmpBindEvent:function($jmp){
var self = this;
$jmp.on('mouseleave', function(e){
if (self.opts.leaveShow && e.relatedTarget && $(e.relatedTarget).data(self.opts.dataJmp) == $jmp.attr('id')){
return false;
                }
$jmp.hide();
            });
        },
getContent: function ($this) {
var currTmp = this.tmp[this.opts.tmp] || this.tmp.def,
                content = $this.data(this.opts.contentData);
var winContent = typeof window[content] === "string" ? window[content] : "";
return currTmp.replace('${content}', winContent || content || "");
        },
showJmp: function ($this) {
var $jmp = $('#' + $this.data(this.opts.dataJmp));
            $jmp.show();
            $jmp.css({
                left: this.getPositionLeft($this, $jmp),
                top: this.getPositionTop($this, $jmp),
                visibility: 'visible'
});
        },
hideJmp: function ($this) {
var $jmp = $('#' + $this.data(this.opts.dataJmp));
            $jmp.hide();
        },
getPositionLeft: function ($this, $jmp) {
var offset = $this.offset(),
                jmpWidth = $jmp.outerWidth() || $jmp.width(),
                thisWidth = $this.outerWidth() || $this.width(),
                windowWidth = this.ui.window.outerWidth() || this.ui.window.width(),
                left = -9999;
if (windowWidth <= jmpWidth) {
return 0;
            }
switch (this.opts.position) {
case 'bl':
                case 'tl':
left = offset.left;
if (this.opts.autoPos && windowWidth - offset.left < jmpWidth) {
                        left = thisWidth + offset.left - jmpWidth > 0 ? thisWidth + offset.left - jmpWidth : (windowWidth - jmpWidth) / 2;
                    }
break;
case 'br':
                case 'tr':
left = thisWidth + offset.left - jmpWidth;
if (this.opts.autoPos &&  thisWidth + offset.left - jmpWidth < 0) {
                        left = windowWidth - offset.left > jmpWidth ? offset.left : (windowWidth - jmpWidth) / 2;
                    }
break;
default:
left = offset.left;
break;
            }
return left;
        },
getPositionTop: function ($this, $jmp) {
var offset = $this.offset(),
                thisHeight = $this.outerHeight() || $this.height(),
                jmpHeight = $jmp.outerHeight() || $this.height(),
                bodyScrollTop = this.ui.body.scrollTop() || this.ui.window.scrollTop(),
                bodyHeight = this.ui.body.outerHeight() || this.ui.body.height(),
                top = -9999;
switch (this.opts.position) {
case 'bl':
                case 'br':
top = offset.top + thisHeight;
if (this.opts.autoPos &&  bodyHeight + bodyScrollTop - offset.top - thisHeight < jmpHeight && offset.top - bodyScrollTop >= jmpHeight) {
                        top = offset.top - jmpHeight;
                    }
break;
case 'tl':
                case 'tr':
top = offset.top - jmpHeight;
if (this.opts.autoPos &&  bodyHeight + bodyScrollTop - offset.top - thisHeight >= jmpHeight && offset.top - bodyScrollTop < jmpHeight) {
                        top = offset.top + thisHeight;
                    }
break;
default:
top = offset.top + thisHeight;
break;
            }
return top;
        }
    };

$.fn.extend({
jumpTips: function (opts) {
new jumpTips(this, opts);
return this;
        }
    });
})(cQuery || jQuery);
