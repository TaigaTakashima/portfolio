//////////////textillate.js//////////////
/*
 * textillate.js
 * http://jschr.github.com/textillate
 * MIT licensed
 *
 * Copyright (C) 2012-2013 Jordan Schroter
 */

(function ($) {
    "use strict";
  
    function isInEffect (effect) {
      return /In/.test(effect) || $.inArray(effect, $.fn.textillate.defaults.inEffects) >= 0;
    };
  
    function isOutEffect (effect) {
      return /Out/.test(effect) || $.inArray(effect, $.fn.textillate.defaults.outEffects) >= 0;
    };
  
  
    function stringToBoolean(str) {
      if (str !== "true" && str !== "false") return str;
      return (str === "true");
    };
  
    // custom get data api method
    function getData (node) {
      var attrs = node.attributes || []
        , data = {};
  
      if (!attrs.length) return data;
  
      $.each(attrs, function (i, attr) {
        var nodeName = attr.nodeName.replace(/delayscale/, 'delayScale');
        if (/^data-in-*/.test(nodeName)) {
          data.in = data.in || {};
          data.in[nodeName.replace(/data-in-/, '')] = stringToBoolean(attr.nodeValue);
        } else if (/^data-out-*/.test(nodeName)) {
          data.out = data.out || {};
          data.out[nodeName.replace(/data-out-/, '')] =stringToBoolean(attr.nodeValue);
        } else if (/^data-*/.test(nodeName)) {
          data[nodeName.replace(/data-/, '')] = stringToBoolean(attr.nodeValue);
        }
      })
  
      return data;
    }
  
    function shuffle (o) {
        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }
  
    function animate ($t, effect, cb) {
      $t.addClass('animated ' + effect)
        .css('visibility', 'visible')
        .show();
  
      $t.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
          $t.removeClass('animated ' + effect);
          cb && cb();
      });
    }
  
    function animateTokens ($tokens, options, cb) {
      var that = this
        , count = $tokens.length;
  
      if (!count) {
        cb && cb();
        return;
      }
  
      if (options.shuffle) $tokens = shuffle($tokens);
      if (options.reverse) $tokens = $tokens.toArray().reverse();
  
      $.each($tokens, function (i, t) {
        var $token = $(t);
  
        function complete () {
          if (isInEffect(options.effect)) {
            $token.css('visibility', 'visible');
          } else if (isOutEffect(options.effect)) {
            $token.css('visibility', 'hidden');
          }
          count -= 1;
          if (!count && cb) cb();
        }
  
        var delay = options.sync ? options.delay : options.delay * i * options.delayScale;
  
        $token.text() ?
          setTimeout(function () { animate($token, options.effect, complete) }, delay) :
          complete();
      });
    };
  
    var Textillate = function (element, options) {
      var base = this
        , $element = $(element);
  
      base.init = function () {
        base.$texts = $element.find(options.selector);
  
        if (!base.$texts.length) {
          base.$texts = $('<ul class="texts"><li>' + $element.html() + '</li></ul>');
          $element.html(base.$texts);
        }
  
        base.$texts.hide();
  
        base.$current = $('<span>')
          .html(base.$texts.find(':first-child').html())
          .prependTo($element);
  
        if (isInEffect(options.in.effect)) {
          base.$current.css('visibility', 'hidden');
        } else if (isOutEffect(options.out.effect)) {
          base.$current.css('visibility', 'visible');
        }
  
        base.setOptions(options);
  
        base.timeoutRun = null;
  
        setTimeout(function () {
          base.options.autoStart && base.start();
        }, base.options.initialDelay)
      };
  
      base.setOptions = function (options) {
        base.options = options;
      };
  
      base.triggerEvent = function (name) {
        var e = $.Event(name + '.tlt');
        $element.trigger(e, base);
        return e;
      };
  
      base.in = function (index, cb) {
        index = index || 0;
  
        var $elem = base.$texts.find(':nth-child(' + ((index||0) + 1) + ')')
          , options = $.extend(true, {}, base.options, $elem.length ? getData($elem[0]) : {})
          , $tokens;
  
        $elem.addClass('current');
  
        base.triggerEvent('inAnimationBegin');
        $element.attr('data-active', $elem.data('id'));
  
        base.$current
          .html($elem.html())
          .lettering('words');
  
        // split words to individual characters if token type is set to 'char'
        if (base.options.type == "char") {
          base.$current.find('[class^="word"]')
              .css({
                'display': 'inline-block',
                // fix for poor ios performance
                '-webkit-transform': 'translate3d(0,0,0)',
                '-moz-transform': 'translate3d(0,0,0)',
                '-o-transform': 'translate3d(0,0,0)',
                'transform': 'translate3d(0,0,0)'
              })
              .each(function () { $(this).lettering() });
        }
  
        $tokens = base.$current
          .find('[class^="' + base.options.type + '"]')
          .css('display', 'inline-block');
  
        if (isInEffect(options.in.effect)) {
          $tokens.css('visibility', 'hidden');
        } else if (isOutEffect(options.in.effect)) {
          $tokens.css('visibility', 'visible');
        }
  
        base.currentIndex = index;
  
        animateTokens($tokens, options.in, function () {
          base.triggerEvent('inAnimationEnd');
          if (options.in.callback) options.in.callback();
          if (cb) cb(base);
        });
      };
  
      base.out = function (cb) {
        var $elem = base.$texts.find(':nth-child(' + ((base.currentIndex||0) + 1) + ')')
          , $tokens = base.$current.find('[class^="' + base.options.type + '"]')
          , options = $.extend(true, {}, base.options, $elem.length ? getData($elem[0]) : {})
  
        base.triggerEvent('outAnimationBegin');
  
        animateTokens($tokens, options.out, function () {
          $elem.removeClass('current');
          base.triggerEvent('outAnimationEnd');
          $element.removeAttr('data-active');
          if (options.out.callback) options.out.callback();
          if (cb) cb(base);
        });
      };
  
      base.start = function (index) {
        setTimeout(function () {
          base.triggerEvent('start');
  
          (function run (index) {
            base.in(index, function () {
              var length = base.$texts.children().length;
  
              index += 1;
  
              if (!base.options.loop && index >= length) {
                if (base.options.callback) base.options.callback();
                base.triggerEvent('end');
              } else {
                index = index % length;
  
                base.timeoutRun = setTimeout(function () {
                  base.out(function () {
                    run(index)
                  });
                }, base.options.minDisplayTime);
              }
            });
          }(index || 0));
        }, base.options.initialDelay);
      };
  
      base.stop = function () {
        if (base.timeoutRun) {
          clearInterval(base.timeoutRun);
          base.timeoutRun = null;
        }
      };
  
      base.init();
    }
  
    $.fn.textillate = function (settings, args) {
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('textillate')
          , options = $.extend(true, {}, $.fn.textillate.defaults, getData(this), typeof settings == 'object' && settings);
  
        if (!data) {
          $this.data('textillate', (data = new Textillate(this, options)));
        } else if (typeof settings == 'string') {
          data[settings].apply(data, [].concat(args));
        } else {
          data.setOptions.call(data, options);
        }
      })
    };
  
    $.fn.textillate.defaults = {
      selector: '.texts',
      loop: false,
      minDisplayTime: 2000,
      initialDelay: 0,
      in: {
        effect: 'fadeInLeftBig',
        delayScale: 1.5,
        delay: 50,
        sync: false,
        reverse: false,
        shuffle: false,
        callback: function () {}
      },
      out: {
        effect: 'hinge',
        delayScale: 1.5,
        delay: 50,
        sync: false,
        reverse: false,
        shuffle: false,
        callback: function () {}
      },
      autoStart: true,
      inEffects: [],
      outEffects: [ 'hinge' ],
      callback: function () {},
      type: 'char'
    };
  
  }(jQuery));
  
//////////////Lettering.js//////////////
/*global jQuery */
/*!	
* Lettering.JS 0.6.1
*
* Copyright 2010, Dave Rupert http://daverupert.com
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/
*
* Thanks to Paul Irish - http://paulirish.com - for the feedback.
*
* Date: Mon Sep 20 17:14:00 2010 -0600
*/
(function($){
	function injector(t, splitter, klass, after) {
		var a = t.text().split(splitter), inject = '';
		if (a.length) {
			$(a).each(function(i, item) {
				inject += '<span class="'+klass+(i+1)+'">'+item+'</span>'+after;
			});	
			t.empty().append(inject);
		}
	}
	
	var methods = {
		init : function() {

			return this.each(function() {
				injector($(this), '', 'char', '');
			});

		},

		words : function() {

			return this.each(function() {
				injector($(this), ' ', 'word', ' ');
			});

		},
		
		lines : function() {

			return this.each(function() {
				var r = "eefec303079ad17405c889e092e105b0";
				// Because it's hard to split a <br/> tag consistently across browsers,
				// (*ahem* IE *ahem*), we replaces all <br/> instances with an md5 hash 
				// (of the word "split").  If you're trying to use this plugin on that 
				// md5 hash string, it will fail because you're being ridiculous.
				injector($(this).children("br").replaceWith(r).end(), r, 'line', '');
			});

		}
	};

	$.fn.lettering = function( method ) {
		// Method calling logic
		if ( method && methods[method] ) {
			return methods[ method ].apply( this, [].slice.call( arguments, 1 ));
		} else if ( method === 'letters' || ! method ) {
			return methods.init.apply( this, [].slice.call( arguments, 0 ) ); // always pass an array
		}
		$.error( 'Method ' +  method + ' does not exist on jQuery.lettering' );
		return this;
	};

})(jQuery);

//////////////DrawSVG.js//////////////
/*! jQuery DrawSVG v1.1.0 (2016-10-05) - git.io/vGFa5 - Copyright (c) 2016 Leonardo Santos - MIT License */
!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):"object"==typeof module&&module.exports?module.exports=function(e,n){return void 0===n&&(n="undefined"!=typeof window?require("jquery"):require("jquery")(e)),t(n),n}:t(jQuery)}(function(t){"use strict";var e="drawsvg",n={duration:1e3,stagger:200,easing:"swing",reverse:!1,callback:t.noop},a=function(){var a=function(a,o){var i=this,r=t.extend(n,o);i.$elm=t(a),i.$elm.is("svg")&&(i.options=r,i.$paths=i.$elm.find("path"),i.totalDuration=r.duration+r.stagger*i.$paths.length,i.duration=r.duration/i.totalDuration,i.$paths.each(function(t,e){var n=e.getTotalLength();e.pathLen=n,e.delay=r.stagger*t/i.totalDuration,e.style.strokeDasharray=[n,n].join(" "),e.style.strokeDashoffset=n}),i.$elm.attr("class",function(t,n){return[n,e+"-initialized"].join(" ")}))};return a.prototype.getVal=function(e,n){return 1-t.easing[n](e,e,0,1,1)},a.prototype.progress=function(t){var e=this,n=e.options,a=e.duration;e.$paths.each(function(o,i){var r=i.style;if(1===t)r.strokeDashoffset=0;else if(0===t)r.strokeDashoffset=i.pathLen+"px";else if(t>=i.delay&&t<=a+i.delay){var s=(t-i.delay)/a;r.strokeDashoffset=e.getVal(s,n.easing)*i.pathLen*(n.reverse?-1:1)+"px"}})},a.prototype.animate=function(){var n=this;n.$elm.attr("class",function(t,n){return[n,e+"-animating"].join(" ")}),t({len:0}).animate({len:1},{easing:"linear",duration:n.totalDuration,step:function(t,e){n.progress.call(n,t/e.end)},complete:function(){n.options.callback.call(this),n.$elm.attr("class",function(t,n){return n.replace(e+"-animating","")})}})},a}();t.fn[e]=function(n,o){return this.each(function(){var i=t.data(this,e);i&&""+n===n&&i[n]?i[n](o):t.data(this,e,new a(this,n))})}});