(function() {
  var mobile = $('link[href$="?mobi"]')[0];
  if (mobile) {
    window._mobileSearch = {
      
      // language settings
      lang : {
        search_stop : 'Stop searching',
        search_loading : '<div class="mobile_search_info">Loading...</div>',
        
        // {GUEST?STRING} applies the STRING in the brackets if the user is a guest
        search_error : '<div class="mobile_search_info">The page could not be retrieved. Please check with an administrator about your search permissions{GUEST? or <a href="/login">login</a> if you haven\'t yet}.</div>'
      },
      
      // search presets
      presets : {
        'Search Presets' : '',
        'Advanced Search' : 'RESET', // RESET is a special value ( see preset.onchange )
        'Active Topics' : '/search?search_id=activetopics',
        'New Posts' : '/search?search_id=newposts',
        'Your Posts' : '/search?search_id=egosearch',
        'Unanswered' : '/search?search_id=unanswered'
      },
      
      active : false, // actively searching ?
      
      // open the search window
      open : function(href, callback) {
        if (_mobileSearch.active) _mobileSearch.close();
      
        var box = document.createElement('DIV'), preset = document.createElement('SELECT'), i;
        box.id = 'fa_mobile_search';
        box.innerHTML = '<div id="mobile_search_content">' + _mobileSearch.lang.search_loading + '</div><div id="mobile_search_nav" class="mobile_title application_header">&nbsp;<a href="javascript:_mobileSearch.close();" class="defaultBtn" style="float:right;margin-right:3px;">' + _mobileSearch.lang.search_stop + '</a></div>';
        
        for (i in _mobileSearch.presets) preset.innerHTML += '<option value="' + _mobileSearch.presets[i] + '">' + i + '</option>';
        preset.onchange = function() {
          if (this.value) {
            if (this.value == 'RESET') document.getElementById('faMobileSearch').firstChild.click();
            else _mobileSearch.open(this.value, function(content, data) {
              _mobileSearch.formatMobile(content);
            });
          }
        };
        
        box.lastChild.insertBefore(preset, box.lastChild.getElementsByTagName('A')[0]);
        
        $.get(href + (/\?/.test(href) ? '&' : '?') + 'change_version=prosilver', function(data) {
          var main = $('#main-content', data)[0], page;
          if (main) {
            box.firstChild.innerHTML = '';
            box.firstChild.appendChild(main);

            $('.pagination:not(strong) span a', box.firstChild).click(_mobileSearch.getPage);

            callback && callback(box.firstChild, data);
          } else box.firstChild.innerHTML = _mobileSearch.lang.search_error.replace(/\{GUEST\?(.*?)\}/, _userdata.session_logged_in ? '' : '$1');
        });

        document.body.style.overflow = 'hidden';
        document.body.appendChild(box);
      
        _mobileSearch.active = true;
      },
      
      // close the search window
      close : function() {
        if (_mobileSearch.active) {
          var box = document.getElementById('fa_mobile_search');
          box && document.body.removeChild(box);
          document.body.style.overflow = '';
          _mobileSearch.active = false;
        }
      },
      
      // get the next page
      getPage : function() {
        var content = document.getElementById('fa_mobile_search').firstChild;
        content.innerHTML = _mobileSearch.lang.search_loading;
        
        $.get(this.href + (/\?/.test(this.href) ? '&' : '?') + 'change_version=prosilver', function(data) {
          var main = $('#main-content', data)[0];

          if (main) {
            content.scrollTop = 0;
            content.innerHTML = '';
            content.appendChild(main);
          
            $('.pagination:not(strong) span a', content).click(_mobileSearch.getPage);
            _mobileSearch.formatMobile(content);
          }
        });
        return false;
      },
      
      // format elements with mobile classes
      formatMobile : function(context) {
        context = context ? context : document;
        var a = $('a', context), i = 0, j = a.length, pagination = $('p.pagination', context);
        
        $('h1', context).addClass('mobile_set');
        $('.row', context).addClass('mobile_item');
        
        pagination.addClass('mobile_title');
        $('span a:not(.pag-img), span strong', pagination).attr('class', 'defaultBtn');
        
        $('.postbody h2', context).addClass('post_header');
        
        for (; i < j; i++) a[i].href = a[i].href.replace(/(?:&|\?)change_version=prosilver/, '');
      }

    };
    
    // write stylesheet into header
    document.write('<style type="text/css">#fa_mobile_search{background:#C4C4C6;position:fixed;top:0;left:0;right:0;bottom:0;padding-top:35px;z-index:99998}#mobile_search_content{height:100%;width:100%;overflow-y:auto}#mobile_search_nav{position:fixed;top:0;left:0;right:0;z-index:99999}#mobile_search_nav a{line-height:26px}#fa_mobile_search .mobile_set,ul#mNavbar{height:auto}ul#mNavbar{padding:3px 0}.mobile_search_info{font-weight:700;text-align:center;padding:3px}#fa_mobile_search .forabg .dterm,#fa_mobile_search .forabg .icon{background-repeat:no-repeat;background-position:5px 50%}#fa_mobile_search .forabg .dterm{padding-left:35px;width:80%}#fa_mobile_search .postprofile{margin-top:16px;text-align:center}#fa_mobile_search .postprofile dd{display:none}#fa_mobile_search .postprofile .author,#fa_mobile_search .postprofile .author+dd{display:inline;margin:0 3px}#fa_mobile_search p.pagination{font-size:0;text-align:center}#fa_mobile_search p.pagination span a,#fa_mobile_search p.pagination span strong{font-size:13px;line-height:26px;margin:3px}#fa_mobile_search strong.defaultBtn{color:#FF0}#fa_mobile_search .submit-buttons{text-align:center}#fa_mobile_search fieldset{padding:6px}#fa_mobile_search fieldset input.defaultBtn{margin:3px 0}#fa_mobile_search fieldset dl select{max-width:90%}#fa_mobile_search fieldset dl{margin:6px 0}#fa_mobile_search fieldset dl dt{font-weight:700;margin-right:3px;float:left}#fa_mobile_search #main-content>:first-child,#fa_mobile_search #main-content>p:not(.pagination),#fa_mobile_search .forabg .header,#fa_mobile_search .forabg .lastpost,#fa_mobile_search .forabg .posts,#fa_mobile_search .forabg .span-tab,#fa_mobile_search .forabg .views,#fa_mobile_search .pag-img,#fa_mobile_search .right-box,#fa_mobile_search .topic-actions,#fa_mobile_search form[name=jumpbox]{display:none}</style>');
    
    // DOM ready modifications
    $(function() {
      var search = document.createElement('LI');
      search.id = 'faMobileSearch';
      search.innerHTML = '<a class="navElement" href="/search"><img src="http://i21.servimg.com/u/f21/18/21/60/73/mobile10.png"/><br/><span class="navBtnLabel">Search</span></a>';
      search.firstChild.onclick = function(e) {
        _mobileSearch.open(this.href, function(content, data) {
          $('h1, h2', content).addClass('mobile_set');
          $('.panel', content).addClass('post');
          $('.button1, .button2', content).attr('class', 'defaultBtn');
          
          $('form[action^="/search"]', content).submit(function(e) {
            _mobileSearch.open('/search?' + $(this).serialize(), function(content, data) {
              _mobileSearch.formatMobile(content);
            });
            e.preventDefault();
          });
        });
        e.preventDefault();
      };

      $(function(){
        var bar = document.getElementById('mNavbar');
        bar && bar.appendChild(search);
      });
    });
  }
})();
