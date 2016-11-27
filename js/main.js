// Global parameters
window.params = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};


jQuery(document).ready(function($) {
    //create_canvas();


    //$('#background_music')[0].play();
    //$('#background_music')[0].volume = .1;

    /*---------------------------
                                  Fullpage
    ---------------------------*/
    if ( $('#fullpage').length > 0 ) {
        $('#fullpage').fullpage({
            anchors:['main-page', 'second-page', 'third-page', 'fourth-page', 'fifth-page'],
            scrollingSpeed: 1000,

            //Custom selectors
            sectionSelector: '.fullpage-section',
            slideSelector: '.fullpage-slide',

            //events
            onLeave: function(index, nextIndex, direction){},
            afterLoad: function(anchorLink, index){
                setTimeout(function () {
                    $('.slice-images').removeClass('finished');
                    $('.active .slice-images').addClass('finished');
                 }, 800);
                $('.active .infoSide h2, .active .infoSide p, .active .infoSide .button').addClass('shown');
            },
            afterRender: function(){
        
            },
            afterResize: function(){},
            afterResponsive: function(isResponsive){},
            afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
            onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex){}
        });
    }


    $('.scroll-down').on('click', function(event) {
      event.preventDefault();
      $.fn.fullpage.moveSectionDown();
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

}); // end file


function create_canvas(){
  var image = $('#canvas-img')[0];
  var imageCanvas = document.createElement('canvas');
  var imageCanvasContext = imageCanvas.getContext('2d');
  var lineCanvas = document.createElement('canvas');
  var lineCanvasContext = lineCanvas.getContext('2d');
  var pointLifetime = 500;
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
    imageCanvas.width = lineCanvas.width = window.innerWidth;
    imageCanvas.height = lineCanvas.height = window.innerHeight;
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
    var minimumLineWidth = 150;
    var maximumLineWidth = 200;
    var lineWidthRange = maximumLineWidth - minimumLineWidth;
    var maximumSpeed = 60;

    lineCanvasContext.clearRect(0, 0, lineCanvas.width, lineCanvas.height);
    lineCanvasContext.lineCap = 'round';
    lineCanvasContext.shadowBlur = 80;
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
