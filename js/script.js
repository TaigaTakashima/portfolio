$(function() {
    var winW = $(window).width(),
        winH = $(window).height(),
        nav = $("#mainnav ul a"),
        curPos = $(this).scrollTop();

    if (winW < 880) {
        var headerH = 0;
    } else {
        var headerH = 63;
    }

    $(nav).on("click", function() {
        nav.removeClass("active");
        var $el = $(this),
            id = $el.attr("href");
        $("html, body").animate(
            {
                scrollTop: $(id).offset().top - headerH
            },
            500
        );
        $(this).addClass("active");
        if (winW < 880) {
            $("#menuWrap")
                .next()
                .slideToggle();
            $("#menuBtn").removeClass("close");
        }
        return false;
    });

    var timer = false;
    $(window).bind("load resize", function() {
        if (timer !== false) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            var w = $(window).innerWidth(),
                bg = $(".bg"),
                bgH = bg.height();

            if (w > 800) {
                $(function() {
                    $(".vMid").css("height", bgH);
                });
            } else {
                $(function() {
                    $(".vMid").css({ height: "auto", padding: "50px 20px" });
                });
            }
        });
    });

    //ナビゲーション制御
    $(".panel").hide();
    $("#menuWrap").toggle(
        function() {
            $(this)
                .next()
                .slideToggle();
            $("#menuBtn").toggleClass("close");
        },
        function() {
            $(this)
                .next()
                .slideToggle();
            $("#menuBtn").removeClass("close");
        }
    );

    //スクロールに合わせてナビゲーションの色変化
    $(window).on("scroll", function() {
        var curPos = $(this).scrollTop();
        if (curPos > 80) {
            $("#mainnav").addClass("changeNav");
        } else {
            $("#mainnav").removeClass("changeNav");
        }
    });
    $(function() {
        // #で始まるアンカーをクリックした場合に処理
        $("a[href^=#]").click(function() {
            // スクロールの速度
            var speed = 500; // ミリ秒
            // アンカーの値取得
            var href = $(this).attr("href");
            // 移動先を取得
            var target = $(href == "#" || href == "" ? "html" : href);
            // 移動先を数値で取得
            var position = target.offset().top;
            // スムーススクロール
            $("body,html").animate(
                { scrollTop: position },
                speed,
                "swing"
            );
            return false;
        });
        $(window).scroll(function() {
            $(".fadein").each(function() {
                var elemPos = $(this).offset().top,
                    scroll = $(window).scrollTop(),
                    windowHeight = $(window).height();
                if (scroll > elemPos - windowHeight + 100) {
                    $(this).addClass("scrollin");
                }
            });
        });
    });
});
