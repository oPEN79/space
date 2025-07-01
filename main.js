jQuery(document).ready(function($) {

	'use strict';

    $(".b1").click(function () {
      $(".pop").fadeIn(300);      
    });

		$(".b2").click(function () {
      $(".pop2").fadeIn(300);   
    });

		$(".b3").click(function () {
      $(".pop3").fadeIn(300);      
    });

    $(".pop > span, .pop").click(function () {
      $(".pop").fadeOut(300);
    });
		
		$(".pop2 > span, .pop2").click(function () {
      $(".pop2").fadeOut(300);
    });

		$(".pop3 > span, .pop3").click(function () {
      $(".pop3").fadeOut(300);
    });


  $(window).on("scroll", function() {
    if($(window).scrollTop() > 1) {
      $(".header").addClass("active");
    } else {
      //remove the background property so it comes transparent again (defined in your css)
      $(".header").removeClass("active");
    }
  });

	/************** Mixitup (Filter Projects) *********************/
  $('.projects-holder').mixitup({
    effects: ['fade','grayscale'],
    easing: 'snap',
    transitionSpeed: 400
  });

});

