var home = {
    init: function () {
        this.starPage();
        this.collapseMenu();
        this.backTop();
    },
    starPage: function () {
        var startPage = $("#startPage");
        var app=$("#app");
        setTimeout(function () {
            startPage.fadeOut(300,function () {
                app.fadeIn();
            });

        }, 3000)
    },
    collapseMenu: function () {
        var collBtn = $(".section-middle-top .icon-arrow");
        collBtn.click(function () {
            $(this).stop().toggleClass("icon-tmb-03");
            $(this).parent().parent().stop().toggleClass("active");
            $(this).parent().siblings(".section-middle-bottom").stop().slideToggle();
        })
    },
    backTop:function () {
        $(".section").on('scroll', function () {
            var scrollTop = $(this).scrollTop();
            if (scrollTop > 100) {
                $('.floatMenu .icon-tmb-ico-top').css('display', 'block');

            } else {
                $('.floatMenu .icon-tmb-ico-top').css('display', 'none');
            }
        });
        $('.floatMenu .icon-tmb-ico-top').on('click', function () {
            $('.section').animate({'scrollTop': 0}, 500);
        });
    }
};
$(function () {
    home.init();
})