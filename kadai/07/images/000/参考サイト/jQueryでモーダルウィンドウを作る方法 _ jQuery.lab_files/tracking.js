$(document).ready(function(){
   $('.tracking').click(function(){
      var url = $(this).attr('href');
      var file = url.replace(/^(.+)(\/)(.+)$/, '$3');
      file = file.replace(/^(.+)(name=)(.+)$/, '$3');
      //_gaq.push(['_trackEvent', 'download', 'template', file]);
        ga('send', 'event', 'download', 'template', file);
   });
});

$(document).ready(function(){
    $('.html5_dl').click(function(){
        var url = $(this).attr('href');
        var file = url.match(".+/(.+?)\.[a-z]+([\?#;].*)?$")[1];
        ga('send', 'event', 'download', 'template', file);
   });
});


$(document).ready(function(){
    $('.jquery_dl').click(function(){
        var url = $(this).attr('href');
        var file = url.match(".+/(.+?)\.[a-z]+([\?#;].*)?$")[1];
        ga('send', 'event', 'download', 'jquery_dl', file);
   });
});

$(document).ready(function(){
   $('.ctmp').click(function(){
      var url = $(this).attr('href');
      //_gaq.push(['_trackEvent', 'click', 'ctmp', url]);
        ga('send', 'event', 'click', 'ctmp', url);
   });
});

$(document).ready(function(){
   $('.wix').click(function(){
      var url = $(this).attr('href');
     // _gaq.push(['_trackEvent', 'click', 'wix', url]);
        ga('send', 'event', 'click', 'wix', url);
   });
});