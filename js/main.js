// Global parameters
window.params = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};


jQuery(document).ready(function($) {
    if ( !window.params.isMobile ) {
      create_canvas();
    }


    if ( $('#background_music').length > 0 ) {
      $('#background_music')[0].play();
      $('#background_music')[0].volume = 0.1;

      $('.music-control').on('click', function(event) {
        event.preventDefault();
        $(this).toggleClass('muted');
        if ($(this).hasClass('muted')) {
          $('#background_music')[0].pause();
        } else {
          $('#background_music')[0].play();
        }
      });  
    }
    

    $('body').append('<div class="menu-overlay"></div>')


    /*----------------------------
                              Image tilt
    -------------------------*/
  $('.tilter').tilt({
      maxTilt:        20,
      perspective:    1000,   // Transform perspective, the lower the more extreme the tilt gets.
      scale:          1,      // 2 = 200%, 1.5 = 150%, etc..
      speed:          500,    // Speed of the enter/exit transition.
      transition:     true,   // Set a transition on enter/exit.
      axis:           null,   // What axis should be disabled. Can be X or Y.
      reset:          true,   // If the tilt effect has to be reset on exit.
      glare:          false,  // Enables glare effect
      maxGlare:       1       // From 0 - 1.
  })
    
    /*---------------------------
                                  Animation-delay
    ---------------------------*/
    $('[data-delay]').each(function(index, el) {
      $(this).css({
        '-webkit-transition-delay':$(this).attr('data-delay'),
        '-o-transition-delay': $(this).attr('data-delay'),
        '-moz-transition-delay': $(this).attr('data-delay'),
        'transition-delay': $(this).attr('data-delay')
      });
    });

    /*---------------------------
                                  Fullpage
    ---------------------------*/
    if ( $('#fullpage').length > 0 ) {
        $('#fullpage').fullpage({
            lockAnchors: true,
            anchors:['main-page', 'second-page', 'third-page', 'home-textile', 'furniture', 'news'],
            scrollingSpeed: 1000,

            //Custom selectors
            sectionSelector: '.fullpage-section',
            slideSelector: '.fullpage-slide',
            responsiveWidth: 1000,
            //events
            onLeave: function(index, nextIndex, direction){
            },
            afterLoad: function(anchorLink, index){
                var section = $(this);

                setTimeout(function () {
                    $('.active .slice-images').addClass('finished');
                }, 800);
                $('.active .infoSide h2, .active .infoSide p, .active .infoSide .button, .active .smallImg').addClass('shown');

                if ( 1 !== index ) {
                  section.addClass('animated');
                }              
            },
            afterRender: function(){},
            afterRender: function(){},
            afterResize: function(){},
            afterResponsive: function(isResponsive){},
            afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
            onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex){}
        });

        $(window).on('load', function(event) {
          event.preventDefault();
          $('.main-screen').addClass('animated');
          $.fn.fullpage.moveTo(1);
        });
    }


    $('.scroll-down').on('click', function(event) {
      event.preventDefault();
      $.fn.fullpage.moveSectionDown();
    });

    $(function(){
        if ($('#collections').length > 0) {
            $('#collections').mixItUp();
        }
    });

    /*---------------------------
                                ACTIVATE MENU ITEM OVER CURRENT SECTION
    ---------------------------*/
    var $sections = $('section');
    var windowHalf = $(window).height() / 1.5;

    $sections.each(function(){
      if ($(this).offset().top < windowHalf) {
        $(this).addClass('animated');
      }
    });

    $(window).on("scroll", function () {
        var currentScroll = $(this).scrollTop();
        var $currentSection;
        $sections.each(function(){
          var divPosition = $(this).offset().top - windowHalf;
          
          if( divPosition - 1 < currentScroll ){
            $currentSection = $(this);
            $currentSection.addClass('animated');
          }
        });
    });



    /*---------------------------
                                  ADD CLASS ON SCROLL
    ---------------------------*/
    $(function() { 
        var $document = $(document),
            $element = $('.menu-button'),
            $element2 = $('header'),
            className = 'hasScrolled';

        $document.scroll(function() {
            $element.toggleClass(className, $document.scrollTop() >= 1);
            $element2.toggleClass(className, $document.scrollTop() >= 1);
        });
    });
      

    /*---------------------------
                                  MENU TOGGLE
    ---------------------------*/
    $('.open-menu').on('click', function(event) {
      event.preventDefault();
      $(this).toggleClass('active');
      $('.menu-container').toggleClass('active');
      $('canvas').toggleClass('active');
      $('.menu-overlay').toggleClass('active');
    });
    /*prevent scrolling parents block*/
    $( '.menu-container' ).on( 'mousewheel DOMMouseScroll', function ( e ) {
        var e0 = e.originalEvent,
            delta = e0.wheelDelta || -e0.detail;

        this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
        e.preventDefault();
    });

    var mi = 0;
    $('.menu-item').each(function(index, el) {
      $(this).css({
        '-webkit-transition-delay': mi+'s',
        '-o-transition-delay': mi+'s',
        '-moz-transition-delay': mi+'s',
        'transition-delay': mi+'s'
      });
      var link = $(this).find('a');
      link.attr( 'data-letters', link.text() );
      mi += 0.1;
    });




    /*---------------------------
                                  Magnific popup
    ---------------------------*/
    $('.magnific').magnificPopup({
        type: 'inline',

        fixedContentPos: false,
        fixedBgPos: true,

        overflowY: 'auto',
        modal: false,

        closeBtnInside: true,
        preloader: false,
        
        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-slide-bottom'
    });

    $('.article-slider').slick({
        arrows: false,
        dots: true
    });

    $('.gallery').each(function() { // the containers for all your galleries
      $(this).magnificPopup({
          delegate: 'a', // the selector for gallery item
          type: 'image',
          gallery: {
            enabled:true
          }
      });
  });



    /*----------------------------
                              SEND FORM
    -------------------------*/
    /**
     *
     * Open popup
     *
     * @param popup {String} jQuery object (#popup)
     *
     * @return n/a
     *
    */
    function openPopup(popup){
        $.magnificPopup.open({
            items: {
              src: popup
            },
            type: 'inline',
            fixedContentPos: false,
            fixedBgPos: true,
            overflowY: 'auto',
            modal: false,
            closeBtnInside: true,
            preloader: false,
            midClick: true,
            removalDelay: 300,
            mainClass: 'my-mfp-slide-bottom'
        }, 0);
    }

    $('form').on('submit', function(event) {
        event.preventDefault();
        /* Act on the event */
        var data = $(this).serialize();
        $.ajax({
            url: theme.url + '/forms.php',
            type: 'POST',
            data: data,
            success: function(result){
                if (result.status == 'ok') {
                    openPopup('#modal-popup-ok')
                } else {
                    openPopup('#modal-popup-error')
                }
            },
            error: function(result) {
                openPopup('#modal-popup-error');
            }
        })
        .always(function() {
            $('form').each(function(index, el) {
                $(this)[0].reset();
            });
        });
        
    });


    /*Google map init*/
    var map;
    function googleMap_initialize() {
        var lat = $('#map_canvas').data('lat');
        var long = $('#map_canvas').data('lng');

        var mapCenterCoord = new google.maps.LatLng(lat, long);
        var mapMarkerCoord = new google.maps.LatLng(lat, long);

        var mapOptions = {
            center: mapCenterCoord,
            zoom: 10,
            //draggable: false,
            disableDefaultUI: true,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var styles = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];


        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        var styledMapType = new google.maps.StyledMapType(styles, {name: 'Styled'});
        map.mapTypes.set('Styled', styledMapType);
        map.setMapTypeId('Styled');
        var markerImage = new google.maps.MarkerImage('images/location.png');
        var marker = new google.maps.Marker({
            icon: markerImage,
            position: mapMarkerCoord, 
            map: map,
            title:"Majaless"
        });
        
        $(window).resize(function (){
            map.setCenter(mapCenterCoord);
        });
    }

    if ( $('#map_canvas').length > 0 ) {
        googleMap_initialize(); 
    }

}); // end file


function create_canvas(){
  var image = $('#canvas-img')[0];
  var imageCanvas = document.createElement('canvas');
  var imageCanvasContext = imageCanvas.getContext('2d');
  var lineCanvas = document.createElement('canvas');
  var lineCanvasContext = lineCanvas.getContext('2d');
  var pointLifetime = 400;
  var points = [];

  if (image.complete) {
    start();
  } else {
    image.onload = start;
  }

  /**
   * Attaches event listeners and starts the effect.
   */
  function start() {
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', resizeCanvases);
    document.body.appendChild(imageCanvas);
    resizeCanvases();
    tick();
  }

  /**
   * Records the user's cursor position.
   *
   * @param {!MouseEvent} event
   */
  function onMouseMove(event) {
    points.push({
      time: Date.now(),
      x: event.clientX,
      y: event.clientY
    });
  }

  /**
   * Resizes both canvases to fill the window.
   */
  function resizeCanvases() {
    imageCanvas.width = lineCanvas.width = $("body").prop("clientWidth");
    imageCanvas.height = lineCanvas.height = window.innerHeight;
    $('#canvas-overlay').css({
      'height': window.innerHeight,
      'width': $("body").prop("clientWidth")
    });
  }

  /**
   * The main loop, called at ~60hz.
   */
  function tick() {
    // Remove old points
    points = points.filter(function(point) {
      var age = Date.now() - point.time;
      return age < pointLifetime;
    });

    drawLineCanvas();
    drawImageCanvas();
    requestAnimationFrame(tick);
  }

  /**
   * Draws a line using the recorded cursor positions.
   *
   * This line is used to mask the original image.
   */
  function drawLineCanvas() {
    var minimumLineWidth = 60;
    var maximumLineWidth = 60;
    var lineWidthRange = maximumLineWidth - minimumLineWidth;
    var maximumSpeed = 60;

    lineCanvasContext.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
    lineCanvasContext.lineJoin = 'round';
    lineCanvasContext.lineCap = 'round';    
    lineCanvasContext.shadowBlur = 60;
    lineCanvasContext.shadowColor = '#000';

  
    for (var i = 1; i < points.length; i++) {
      var point = points[i];
      var previousPoint = points[i - 1];

      // Change line width based on speed
      var distance = getDistanceBetween(point, previousPoint);
      var speed = Math.max(0, Math.min(maximumSpeed, distance));
      var percentageLineWidth = (maximumSpeed - speed) / maximumSpeed;
      lineCanvasContext.lineWidth = minimumLineWidth + percentageLineWidth * lineWidthRange;

      // Fade points as they age
      var age = Date.now() - point.time;
      var opacity = (pointLifetime - age) / pointLifetime;
      lineCanvasContext.strokeStyle = 'rgba(0, 0, 0, ' + opacity + ')';
      
      lineCanvasContext.beginPath();
      lineCanvasContext.moveTo(previousPoint.x, previousPoint.y);
      lineCanvasContext.lineTo(point.x, point.y);
      lineCanvasContext.stroke();
    }
      var canvasHeight = $('canvas').height();
      var canvasWidth = $('canvas').width();
      $('#canvas-overlay').css({
        'height': window.innerHeight,
        'width': $("body").prop("clientWidth")
      });
  }

  /**
   * @param {{x: number, y: number}} a
   * @param {{x: number, y: number}} b
   * @return {number} The distance between points a and b
   */
  function getDistanceBetween(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }

  /**
   * Draws the original image, masked by the line drawn in drawLineToCanvas.
   */
  function drawImageCanvas() {
    // Emulate background-size: cover
    var width = imageCanvas.width;
    var height = imageCanvas.width / image.naturalWidth * image.naturalHeight;
    
    if (height < imageCanvas.height) {
      width = imageCanvas.height / image.naturalHeight * image.naturalWidth;
      height = imageCanvas.height;
    }

    imageCanvasContext.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    imageCanvasContext.globalCompositeOperation = 'source-over';
    imageCanvasContext.drawImage(image, 0, 0, width, height);
    imageCanvasContext.globalCompositeOperation = 'destination-in';
    imageCanvasContext.drawImage(lineCanvas, 0, 0);

  }  

}
