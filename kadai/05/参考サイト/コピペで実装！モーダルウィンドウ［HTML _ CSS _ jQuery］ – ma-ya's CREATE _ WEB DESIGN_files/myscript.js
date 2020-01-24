////////////scrollEvents_start////////////
jQuery(function () {

  //navHeaderShow_variables
  var cloneNav = jQuery('#navHeader').clone().attr('id', 'cloneNav').addClass('cloneNav').insertAfter('#navHeader');
  var logoMove = jQuery('.logoFollow:last');
  var showClass = 'isShow';
  //showUp_variables
  var forShow1 = jQuery('.forShow1');
  var forShow2 = jQuery('.forShow2');
  var forShow3 = jQuery('.forShow3');
  var forShow4 = jQuery('.forShow4');
  var forShows = [forShow1, forShow2, forShow3, forShow4];
  //textillate_variables
  var heading = jQuery('.heading');
  //commentAnim_variables
  var commentAnim = jQuery('#commentAnim');
  //rollBack_variables
  var rollBack = jQuery('#rollBack');
  //helloMogi_variables
  var mogiFooter = jQuery('#mogiFooter');
  var contentsHeight = jQuery(document).height();

  ////scrollEvents////
  jQuery(window).on('scroll', _.throttle(function () {

    //common_variables
    var windowHeight = jQuery(this).height();
    var scroll = jQuery(this).scrollTop();

    //navHeaderShow_func
    if (scroll > 700) {
      logoMove.css('display', 'inline-block');
      cloneNav.addClass(showClass);
    } else {
      cloneNav.removeClass(showClass);
    }
    //showUp_func
    for (var j = 0; len = forShows.length, j < len; j++) {
      forShows[j].each(function (i) {
        var forShowPoint = jQuery(this).offset().top - 30;
        var delayTime = 90;
        if (scroll > forShowPoint - windowHeight) {
          jQuery(this).delay(i * delayTime).queue(function () {
            jQuery(this).addClass('showUp');
          });
        }
      });
    }
    //textillate_func
    heading.each(function () {
      var headingPoint = jQuery(this).offset().top;
      if (scroll > headingPoint - windowHeight) {
        jQuery(this).css('opacity', 1).textillate({
          in: {
            effect: 'fadeInUp',
            shuffle: true,
            delay: 20,
            delayScale: 3,
          }
        });
      }
    });
    //commentAnim_func
    if (commentAnim.length) {
      var myCommentPoint = commentAnim.offset().top;
      if (scroll > myCommentPoint - windowHeight) {
        commentAnim.css('opacity', 1).addClass('animated zoomInDown');
      }
    }
    //rollBack_func
    if (scroll > 700) {
      rollBack.fadeIn(500);
    } else {
      rollBack.fadeOut(500);
    }
    //helloMogi_func
    if (contentsHeight - (scroll + windowHeight) < 100) {
      mogiFooter.show(function () {
        jQuery(this).addClass('helloMogi');
      });
    } else {
      if (mogiFooter.hasClass('helloMogi')) {
        mogiFooter.fadeOut(200, function () {
          jQuery(this).removeClass('helloMogi');
        });
      }
    }

  }, 150));
  ////scrollEvents////

  ////optional_func////
  //rollBackClicked
  rollBack.click(function () {
    jQuery('body,html').animate({ scrollTop: 0 }, 700, 'easeInOutQuart');
  });
  ////optional_func////

});
////////////scrollEvents_end////////////

////////////spNavHeader////////////
jQuery(function () {
  var hambBtns = jQuery('#hambBtn');
  var hambBtn1 = jQuery('.hambBtn1');
  var hambBtn2 = jQuery('.hambBtn2');
  var hambBtn3 = jQuery('.hambBtn3');
  var spNav = jQuery('#spNavHeader');
  var spNavLists = jQuery('.spNavHeader ul li');
  var spNavLink = jQuery('#spNavHeader li a');
  var delayTime = 80;
  var fadeTime = 200;
  hambBtns.click(function () {
    toggleNav();
    if (spNavLists.css('display') == 'list-item') {
      spNavLists.fadeOut(fadeTime);
    } else {
      spNavLists.each(function (i) {
        jQuery(this).delay(i * delayTime).fadeIn(fadeTime);
      });
    }
  });
  spNavLink.click(function () {
    toggleNav();
    spNavLists.hide();
  });
  function toggleNav() {
    if (!spNav.hasClass('is-show')) {
      spNav.fadeToggle(fadeTime).toggleClass('is-show');
    } else {
      spNav.fadeToggle(fadeTime, function () {
        jQuery(this).toggleClass('is-show');
      })
    }
    hambBtn1.toggleClass('hambMove1');
    hambBtn2.toggleClass('hambMove2');
    hambBtn3.toggleClass('hambMove3');
  };
});
////////////spNavHeader////////////
//↑can not replace↓//
////////////smoothScroll////////////
jQuery(function () {
  jQuery('.navHeader a[href^="#"]').click(function () {
    var href = jQuery(this).attr('href');
    var target = jQuery(href == '#' || href === '' ? 'html' : href);
    var position = target.offset().top;
    if (href === '#contact') {
      jQuery('html,body').animate({ scrollTop: position }, 700, 'easeInOutQuart');
    } else {
      jQuery('html,body').animate({ scrollTop: position - 50 }, 700, 'easeInOutQuart');
    }
    return false;
  });
  jQuery('#spNavHeader a[href^="#"]').click(function () {
    var href = jQuery(this).attr('href');
    var target = jQuery(href == '#' || href === '' ? 'html' : href);
    var position = target.offset().top;
    if (href === '#contact') {
      jQuery('html,body').animate({ scrollTop: position + 100 }, 700, 'easeInOutQuart');
    } else {
      jQuery('html,body').animate({ scrollTop: position + 50 }, 700, 'easeInOutQuart');
    }
    return false;
  });
});
////////////smoothScroll////////////

////////////otherpage to frontpage////////////
jQuery(window).on('load', function () {
  var fixPx = -50;
  var url = jQuery(location).attr('href');
  if (url.indexOf("?id=") != -1) {
    var idName = url.split("?id=");
    var target = jQuery('#' + idName[idName.length - 1]);
    if (target.length) {
      var pos = target.offset().top + fixPx;
      if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
        if (target.prop('id') == "contact") {
          jQuery("html, body").scrollTop(pos + 150);
        } else {
          jQuery("html, body").scrollTop(pos + 100);
        }
      } else {
        if (target.prop('id') == "contact") {
          jQuery("html, body").scrollTop(pos + 50);
        } else {
          jQuery("html, body").scrollTop(pos);
        }
      }
    }
  }
});
////////////otherpage to frontpage////////////

////////////modal////////////
jQuery(function () {
  jQuery('.modalOpen').click(function () {
    if (jQuery(this).parents('#spNavHeader')[0]) {
      jQuery('#modalArea').show();
    } else {
      jQuery('#modalArea').fadeIn();
    }
  });
  jQuery('#modalClose,#modalOuter').click(function () {
    jQuery('#modalArea').fadeOut();
  });
});
////////////modal////////////

////////////scroll control for fuckin'IE11////////////
if (navigator.userAgent.match(/MSIE 10/i) || navigator.userAgent.match(/Trident\/7\./) || navigator.userAgent.match(/Edge\/12\./)) {
  jQuery('body').on("mousewheel", function () {
    event.preventDefault();
    var wd = event.wheelDelta;
    var csp = window.pageYOffset;
    window.scrollTo(0, csp - wd);
  });
}
////////////scroll control for fuckin'IE11////////////

////////////scrollTriggerAll-bottomFixAbsolutely!!!////////////
jQuery(function () {
  jQuery(window).trigger('scroll');
});
////////////scrollTriggerAll-bottomFixAbsolutely!!!////////////
