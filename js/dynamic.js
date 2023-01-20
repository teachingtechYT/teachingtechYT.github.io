var pages = ["Home", "Calibration", "Troubleshooting", "Upgrade Guides", "Diagonal Z Hop", "Review Policy", "Sponsors", "Contact"]
var urls = ["index.html", "calibration.html", "troubleshooting.html", "upgrades.html", "diagonalZhop.html", "reviewpolicy.html", "sponsors.html", "contact.html"]
var menu = '<img src="img/ttwhite.png" />';
var tab;
for(var i = 0; i < pages.length; i++){
    menu += '<a href="'+urls[i]+'" target="_self"';
    if(pages[i] == pageName){
        menu += ' class="currentPage"';
    }
    menu += '>'+pages[i]+'</a>';
}
menu += '<span id="donate">Useful? Considering supporting me: <a href="https://paypal.me/testlawgicau" target="_blank"><img class="icon" src="img/paypal.png" /></a><a href="http://www.patreon.com/teachingtech" target="_blank"><img class="icon" src="img/patreon.png" /></a></span>';
$('#menu').html(menu);
function sizeBody(){
    var menuClearance = $('#menu').outerHeight()+30;
    $('body').css("margin-top",menuClearance);
}

$('head').append('<title>'+pageTitle+'</title>');
var header ='<table class="head"><tr><td><img src="img/tt.png" class="icon" style="vertical-align:middle;" /></td><td><h1>'+pageTitle+'</h1></td></tr></table>';
$('#header').html(header);

var up = '^ <span style="font-weight:bold;">TOP</span> ^';
$('#up').html(up);
$( "#up" ).bind( "click", function() {
    $('html, body').animate({scrollTop: '0px'}, 500);
});

var footer = `
<p style="text-align: center;">This page is fully <a href="https://github.com/teachingtechYT/teachingtechYT.github.io" target="_blank">open source</a>. If you find a bug or have a feature request, please post in the <a href="https://github.com/teachingtechYT/teachingtechYT.github.io/issues" target="_blank">issues</a> section. Make sure to read the <a href="https://github.com/teachingtechYT/teachingtechYT.github.io/issues/323" target="_blank">pinned readme</a>.</p>
    <p style="text-align: center;">This page was created using:</p>
    <ul style="margin-top:-20px;">
        <li><a href="https://jquery.com/" target="_blank">jQuery</a></li>
        <li><a href="https://github.com/jellekralt/Responsive-Tabs" target="_blank">Responsive Tabs by jellekraut</a></li>
        <li><a href="https://fonts.google.com/specimen/Roboto" target="_blank">Roboto font</a></li>
        <li><a href="https://github.com/tedktedk/videobox" target="_blank">Videobox by tedktedk</a></li>
        <li><a href="https://github.com/noelboss/featherlight" target="_blank">Featherlight by noelboss</a></li>
        <li><a href="https://github.com/toperkin/staticFormEmails/blob/master/README.md" target="_blank">staticFormEmails by toperkin</a></li>
    </ul>`;
$('#footer').html(footer);

$(document).ready(function(){
    $('#tabs').responsiveTabs({
        startCollapsed: 'accordion'
    });
    $(".videoThumb").videoBox({
        width: '480',
        height: '360',
        loop: false,
        autoplay: false,
        byline: false,
        color: "00adef",
        maxheight: '',
        maxwidth: '',
        portrait: true,
        title: '',
        controls: 1
    });
    sizeBody();
    $(window).resize(function(){
        sizeBody();
    });
    tab = $(location).attr('hash');
  });