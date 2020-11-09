//WebFont読み込み
(function(d) {
    var config = {
            kitId: "jur8wjt",
            scriptTimeout: 3000,
            async: true
        },
        h = d.documentElement,
        t = setTimeout(function() {
            h.className =
                h.className.replace(/\bwf-loading\b/g, "") + " wf-inactive";
        }, config.scriptTimeout),
        tk = d.createElement("script"),
        f = false,
        s = d.getElementsByTagName("script")[0],
        a;
    h.className += " wf-loading";
    tk.src = "https://use.typekit.net/" + config.kitId + ".js";
    tk.async = true;
    tk.onload = tk.onreadystatechange = function() {
        a = this.readyState;
        if (f || (a && a != "complete" && a != "loaded")) return;
        f = true;
        clearTimeout(t);
        try {
            Typekit.load(config);
        } catch (e) {}
    };
    s.parentNode.insertBefore(tk, s);
})(document);
$(function() {
    // #で始まるアンカーをクリックした場合に処理
    $("a[href^=#]").click(function() {
        // スクロールの速度
        var speed = 700; // ミリ秒
        // アンカーの値取得
        var href = $(this).attr("href");
        // 移動先を取得
        var target = $(href == "#" || href == "" ? "html" : href);
        // 移動先を数値で取得
        var position = target.offset().top;
        // スムーススクロール
        $("body,html").animate({ scrollTop: position - 140 }, speed, "swing");
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
