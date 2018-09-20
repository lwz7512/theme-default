var $ = require('jquery');
var url = require('url');
var loading = require('./loading');
var platform = require('./platform');

var gitbook = window.gitbook;

var linksInPart = []; // url, url, ...
var lielsInPart = []; // li, li,  ...
var currentIndex= 0; // index by li sequence

/*
    Get current scroller element
*/
function getScroller() {
    if (platform.isSmallScreen()) {
        return $('.book-body');
    } else {
        return $('.body-inner');
    }
}

/*
    Handle a change of url withotu refresh the whole page
*/
function handleNavigation(relativeUrl, title, push) {

    var uri = url.resolve(window.location.pathname, relativeUrl);

    // reset the location
    location.href = location.href.split('#')[0]+'#'+title;

    var promise = $.Deferred(function(deferred) {
        $.ajax({
            type: 'GET',
            url: uri,
            cache: true,
            headers:{
                'Access-Control-Expose-Headers': 'X-Current-Location'
            },
            success: function(html, status, xhr) {
              // Update title
              document.title = title+' . '+$(document).data('title');

              var newArticle = '<h2 style="text-align: center">'+title+'</h2>'+html;
              $('.markdown-section').empty();
              $('.markdown-section').append(newArticle);

              $scroller = getScroller();

              $scroller.animate({
                  scrollTop: 0
              }, 400, 'swing', function() {
                  // Reset scroll binding when finished
                  // console.log('>>> scrolled!');
              });

              // lazy disappear for better experience ...@2018/09/19
              setTimeout(function(){
                deferred.resolve();
              }, 100);
            }
        });
    }).promise();

    return loading.show(
        promise
        .fail(function (e) {
            console.log(e); // eslint-disable-line no-console
            // location.href = relativeUrl;
        })
    );
}


function isLeftClickEvent(e) {
    return e.button === 0;
}

function isModifiedEvent(e) {
    return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}

/*
    Handle click on a li link into it...
*/
function handleLinkClick(e) {
    e.stopPropagation();
    e.preventDefault();

    var $this = $(this);
    var target = $this.attr('target');

    if (isModifiedEvent(e) || !isLeftClickEvent(e) || target) {
        return;
    }

    var currentTarget = $(e.currentTarget);
    var link = currentTarget.find('a');
    var title = link[0].textContent;
    var href = '';
    if(link.length){
      href = link[0].getAttribute('href');
    }

    // disable next button AFTER into page list...
    $('.navigation-prev').attr('href', '');
    $('.navigation-next').attr('href', '');

    // remember current position
    currentIndex = linksInPart.indexOf(href);

    // load article snippet...
    if (href) handleNavigation(href, title, true);
}

function stopLinkClick(e) {
  e.stopPropagation();
  e.preventDefault();
}

function navtoPrev(e) {
  if(currentIndex == 0) return console.log('>>> TO THE FIRST!');

  currentIndex --;
  if(!lielsInPart[currentIndex]) return;

  var href   = linksInPart[currentIndex];
  var title = lielsInPart[currentIndex].textContent;
  handleNavigation(href, title, true);
  // console.log('load: '+href+'#'+title);
}

function navtoNext(e) {
  if(currentIndex == 0) return; // switch in parts...
  if(currentIndex == linksInPart.length-1) return console.log('>>> TO THE END!');

  currentIndex ++;
  if(!lielsInPart[currentIndex]) return;

  var href   = linksInPart[currentIndex];
  var title = lielsInPart[currentIndex].textContent;
  handleNavigation(href, title, true);
  // console.log('load: '+href+'#'+title);
}

function init() {
  // console.log('>>> list navigation loaded!');
  var sitename = document.title.split(' ')[2];

  $(document).data('title', sitename);
  // FIXME, do not use this or cause confict with listnav @2018/09/19
  $(document).off('click', '.page-inner a');
  // in list navigation
  $(document).on('click', '.book-body .markdown-section li', handleLinkClick); // load post ...
  $(document).on('click', '.book-body .markdown-section>p>a', stopLinkClick); // disable link in introduction
  // redefine the navigation button action
  $(document).on('click', '.book-body .navigation-prev', navtoPrev);
  $(document).on('click', '.book-body .navigation-next', navtoNext);

}

// When page changed, reset buttons
gitbook.events.on('page.change', function() {
  // RESET link list each part switch!!
  linksInPart = [];
  lielsInPart = [];
  // save current posts...
  $('.markdown-section li').each(function(i, item){
    // console.log(item);
    var a = item.querySelector('a');
    // console.log(a);
    if(a) linksInPart.push(a.getAttribute('href'));
    if(a) lielsInPart.push(a);
  });
  // console.log('linksInPart NUM: ');
  // console.log(linksInPart.length);

  // each time page change, reset the navigation id;
  currentIndex = 0;

});


module.exports = {
    init: init
};
