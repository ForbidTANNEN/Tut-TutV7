
// Nav Bar shadow
$(window).scroll(function() {
    if ($(window).scrollTop() > 10) {
        $('.navbar').addClass('floatingNav');
    } else {
        $('.navbar').removeClass('floatingNav');
    }
});
