/*!
 * Dropdownhover v1.0.0 (http://bs-dropdownhover.kybarg.com)
 */
+function ($) {
  'use strict';

  // DROPDOWNHOVER CLASS DEFINITION
  // =========================

  var Dropdownhover = function (element, options) {
    this.options    = options    
    this.$element   = $(element)

    var that = this

    // Defining if navigation tree or single dropdown
    this.dropdowns = this.$element.hasClass('dropdown-toggle') ? this.$element.parent().find('.dropdown-menu').parent('.dropdown') : this.$element.find('.dropdown')

    this.dropdowns.each(function(){
        $(this).on('mouseenter.bs.dropdownhover', function(e) {
          that.show($(this).children('a, button'))
        })
    })
    this.dropdowns.each(function(){
        $(this).on('mouseleave.bs.dropdownhover', function(e) {
          that.hide($(this).children('a, button'))
        })
    })

  }

  Dropdownhover.TRANSITION_DURATION = 300
  Dropdownhover.DELAY = 150
  Dropdownhover.TIMEOUT

  Dropdownhover.DEFAULTS = {
    animations : ['fadeInDown', 'fadeInRight', 'fadeInUp', 'fadeInLeft'],
  }

  // Opens dropdown menu when mouse is over the trigger element
  Dropdownhover.prototype.show = function (_dropdownLink) {


    var $this = $(_dropdownLink)

    window.clearTimeout(Dropdownhover.TIMEOUT)
    // Close all dropdowns
    $('.dropdown').not($this.parents()).each(function(){
         $(this).removeClass('open');
     });

    var effect = this.options.animations[0]

    if ($this.is('.disabled, :disabled')) return

    var $parent  = $this.parent()
    var isActive = $parent.hasClass('open')

    if (!isActive) {

      var $dropdown = $this.next('.dropdown-menu')
      var relatedTarget = { relatedTarget: this }

      $parent
        .addClass('open')

      var side = this.position($dropdown)
      side == 'top' ? effect = this.options.animations[2] :
      side == 'right' ? effect = this.options.animations[3] :
      side == 'left' ? effect = this.options.animations[1] :
      effect = this.options.animations[0]

      $dropdown.addClass('animated ' + effect)

      var transition = $.support.transition && $dropdown.hasClass('animated')

      transition ?
        $dropdown
          .one('bsTransitionEnd', function () {
            $dropdown.removeClass('animated ' + effect)
          })
          .emulateTransitionEnd(Dropdownhover.TRANSITION_DURATION) :
        $dropdown.removeClass('animated ' + effect)
    }

    return false
  }

  // Closes dropdown menu when moise is out of it
  Dropdownhover.prototype.hide = function (_dropdownLink) {

    var that = this
    var $this = $(_dropdownLink)
    var $parent  = $this.parent()
    Dropdownhover.TIMEOUT = window.setTimeout(function () {
      $parent.removeClass('open')
    }, Dropdownhover.DELAY)
  }

  // Calculating position of dropdown menu
  Dropdownhover.prototype.position = function (dropdown) {

    var win = $(window);

    // Reset css to prevent incorrect position
    dropdown.css({ bottom: '', left: '', top: '', right: '' }).removeClass('dropdownhover-top')
  
    var viewport = {
      top : win.scrollTop(),
      left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();
    
    var bounds = dropdown.offset();
      bounds.right = bounds.left + dropdown.outerWidth();
      bounds.bottom = bounds.top + dropdown.outerHeight();
    var position = dropdown.position();
      position.right = bounds.left + dropdown.outerWidth();
      position.bottom = bounds.top + dropdown.outerHeight();
  
    var side = ''
   
    var isSubnow = dropdown.parents('.dropdown-menu').length

    if(isSubnow) {

      if (position.left < 0) {
        side = 'left'
        dropdown.removeClass('dropdownhover-right').addClass('dropdownhover-left')
      } else {
        side = 'right'
        dropdown.addClass('dropdownhover-right').removeClass('dropdownhover-left')
      }

      if (bounds.left < viewport.left) {
        side = 'right'
        dropdown.css({ left: '100%', right: 'auto' }).addClass('dropdownhover-right').removeClass('dropdownhover-left')
      } else if (bounds.right > viewport.right) {
        side = 'left'
        dropdown.css({ left: 'auto', right: '100%' }).removeClass('dropdownhover-right').addClass('dropdownhover-left')
      }

      if (bounds.bottom > viewport.bottom) {
        dropdown.css({ bottom: 'auto', top: -(bounds.bottom-viewport.bottom) })
      } else if (bounds.top < viewport.top) {
        dropdown.css({ bottom: -(viewport.top-bounds.top), top: 'auto' })
      }

    } else { // Defines special position styles for root dropdown menu

      var parentLi = dropdown.parent('.dropdown')
      var pBounds = parentLi.offset()
        pBounds.right = pBounds.left + parentLi.outerWidth()
        pBounds.bottom = pBounds.top + parentLi.outerHeight()

      if (bounds.right > viewport.right) {
        dropdown.css({ left: -(bounds.right-viewport.right), right: 'auto' })
      }

      if (bounds.bottom > viewport.bottom && (pBounds.top - viewport.top) > (viewport.bottom - pBounds.bottom) || dropdown.position().top < 0) {
        side = 'top'
        dropdown.css({ bottom: '100%', top: 'auto' }).addClass('dropdownhover-top').removeClass('dropdownhover-bottom')
      } else {
        side = 'bottom'
        dropdown.addClass('dropdownhover-bottom')
      }
    }

    return side;

  }


  // DROPDOWNHOVER PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdownhover')
      var settings = $this.data()
      if($this.data('animations') !== undefined && $this.data('animations') !== null)
         settings.animations =  $.isArray(settings.animations) ? settings.animations : settings.animations.split(' ')

      var options = $.extend({}, Dropdownhover.DEFAULTS, settings, typeof option == 'object' && option)

      if (!data) $this.data('bs.dropdownhover', (data = new Dropdownhover(this, options)))

    })
  }

  var old = $.fn.dropdownhover

  $.fn.dropdownhover             = Plugin
  $.fn.dropdownhover.Constructor = Dropdownhover


  // DROPDOWNHOVER NO CONFLICT
  // ====================

  $.fn.dropdownhover.noConflict = function () {
    $.fn.dropdownhover = old
    return this
  }


  // APPLY TO STANDARD DROPDOWNHOVER ELEMENTS
  // ===================================

  var resizeTimer;
  $(document).ready(function () {
    $('[data-hover="dropdown"]').each(function () {
      var $target = $(this)
      Plugin.call($target, $target.data())
    })
  })
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){
      if($(window).width() >= 768) // Breakpoin plugin is activated (728px)
        $('[data-hover="dropdown"]').each(function () {
          var $target = $(this)
          Plugin.call($target, $target.data())
        })
      else  // Disabling and clearing plugin data if screen is less 768px
        $('[data-hover="dropdown"]').each(function () {
          $(this).removeData('bs.dropdownhover')
          if($(this).hasClass('dropdown-toggle'))
            $(this).parent('.dropdown').find('.dropdown').andSelf().off('mouseenter.bs.dropdownhover mouseleave.bs.dropdownhover')
          else
            $(this).find('.dropdown').off('mouseenter.bs.dropdownhover mouseleave.bs.dropdownhover')
        })
    }, 200)
  })

}(jQuery);




jQuery(document).on('click', '.mega-dropdown', function(e) {
            e.stopPropagation()
        })

        $(document).ready(function() {
            $('#Carousel').carousel({
                interval: 5000
            })
        });
		

//top sticky nav ------
var affixElement = '#stickyNav';
$(affixElement).affix({
  offset: {
    // Distance of between element and top page
    top: function () {
      return (this.top = $(affixElement).offset().top -60)
    },
  }
});



//jQuery for page scrolling feature - requires jQuery Easing plugin
$(document).ready(function(){
	$('a.page-scroll').on('click',function (e) {
	    e.preventDefault();

	    var target = this.hash;
	    var $target = $(target);

	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 900, 'swing', function () {
	        window.location.hash = target;
	    });
	});
});



(function( $ ) {

    //Function to animate slider captions 
	function doAnimations( elems ) {
		//Cache the animationend event in a variable
		var animEndEv = 'webkitAnimationEnd animationend';
		
		elems.each(function () {
			var $this = $(this),
				$animationType = $this.data('animation');
			$this.addClass($animationType).one(animEndEv, function () {
				$this.removeClass($animationType);
			});
		});
	}
	
	//Variables on page load 
	var $myCarousel = $('#carousel-example-generic'),
		$firstAnimatingElems = $myCarousel.find('.item:first').find("[data-animation ^= 'animated']");
		
	//Initialize carousel 
	$myCarousel.carousel();
	
	//Animate captions in first slide on page load 
	doAnimations($firstAnimatingElems);
	
	//Pause carousel  
	$myCarousel.carousel('pause');
	
	
	//Other slides to be animated on carousel slide event 
	$myCarousel.on('slide.bs.carousel', function (e) {
		var $animatingElems = $(e.relatedTarget).find("[data-animation ^= 'animated']");
		doAnimations($animatingElems);
	});  
    $('#carousel-example-generic').carousel({
        interval:3000,
    });
	
})(jQuery);	
