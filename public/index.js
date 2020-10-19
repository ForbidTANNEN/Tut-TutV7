// Nav Bar shadow
$(window).scroll(function() {
    if ($(window).scrollTop() > 10) {
        $('.navbar').addClass('floatingNav');
    } else {
        $('.navbar').removeClass('floatingNav');
    }
});


//overlay
$( document ).ready(function() {
  $(".overlay").height($(".half-width-img").height());
  $(".overlay1").height($(".half-width-img").height());
});
$( window ).resize(function() {
    $(".overlay").height($(".half-width-img").height());
    $(".overlay1").height($(".half-width-img").height());
});

$(".overlay").mouseover(function(){
  $("#tutorText").addClass("show");
  console.log("lol");
});

$(".overlay").mouseout(function(){
  $("#tutorText").removeClass("show");
})

$(".overlay1").mouseover(function(){
  $("#tutorText1").addClass("show");
  console.log("lol");
});

$(".overlay1").mouseout(function(){
  $("#tutorText1").removeClass("show");
})
