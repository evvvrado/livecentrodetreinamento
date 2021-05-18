$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });


  // Debounce do Lodash
debounce = function(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};


(function(){
	var $target = $('.showin'),
			animationClass = 'anime-start',
			offset = $(window).height() * 3/4;

	function animeScroll() {
		var documentTop = $(document).scrollTop();

		$target.each(function(){
			var itemTop = $(this).offset().top;
			if (documentTop > itemTop - offset) {
				$(this).addClass(animationClass);
			} else {
				$(this).removeClass(animationClass);
			}
		});
	}

	animeScroll();

	$(document).scroll(debounce(function(){
		animeScroll();
	}, 200));
})();


//Slide
const iflSlider={
	redim:false,
	init:function(slider){
		iflSlider.ajustaTamanho(slider);
		slider.find('.sliderBtn button').each(function(idx,btn){
			$(btn).click(function(event){
				let pre=$(slider).find('.sliderPreCorpo');
				let i=$(slider).find('.sliderItem');
				let w=i.outerWidth(true);
				let novo=0;
				if(idx==1 || $(btn).hasClass('proximo'))novo=pre[0].scrollLeft+w;
				else novo=pre[0].scrollLeft-w;
				if('scrollBehavior' in document.documentElement.style)pre[0].scroll({left:novo,behavior:'smooth'});
				else pre.stop(true,true).animate( { scrollLeft : novo } , 300);
			});
		});
	},
	initTodos:function(){
		$('.slider').each(function(idxS,slider){
			iflSlider.init($(slider));
		});
	},
	resizeTodos:function(){
		$('.slider .sliderItem').css('width','');
		$('.slider .sliderPreCorpo').css('width','');
		if(iflSlider.redim){
			clearTimeout(iflSlider.redim);
			iflSlider.redim=false;
		};
		iflSlider.redim=setTimeout(function(){
			$('.slider').each(function(idxS,slider){
				iflSlider.ajustaTamanho($(slider));
				iflSlider.redim=false;
			});
		},100);
	},
	ajustaTamanho:function(slider){
		let pre=$(slider).find('.sliderPreCorpo');
		if(pre.length){
			let corpo=$(slider).find('.sliderCorpo');
			let i=$(slider).find('.sliderItem');
			let w=i.outerWidth(true);
			let sw=pre.outerWidth(true);
			if(sw<w)i.css('width',sw+'px');
			if(pre[0].offsetWidth<corpo[0].offsetWidth)slider.find('.sliderBtn').css('opacity','');
			else slider.find('.sliderBtn').css('opacity','0');
		}
	}
}