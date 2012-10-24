window.addEventListener("load", function(){
  chrome.tabs.getSelected(null, function(tab) {
    var flags = document.getElementsByName('flags[]');
    function flags_changed(){
      var ck = [];
      for(var i = 0; i < flags.length; i++){
        if(flags[i].checked){
          ck.push(flags[i].value);
        }
      }
      chrome.cookies.set({
        url: tab.url,
        name: 'xhprof:flags',
        path: '/',
        value: ck.join('+')
      }, function(){});
    }
    chrome.cookies.get({
      url: tab.url,
      name: 'xhprof:flags'
    }, function(cookie){
      if(cookie){
        var ck = cookie.value.split('+');
        for(var i = 0; i < flags.length; i++){
          flags[i].checked = ck.indexOf(flags[i].value) > -1;
        }
      }
      for(var i = 0; i < flags.length; i++){
        flags[i].addEventListener('click', flags_changed, false);
      }
    });
    var source = document.getElementsByName('source')[0];
    chrome.cookies.get({
      url: tab.url,
      name: 'xhprof:source'
    }, function(cookie){
      if(cookie){
        source.value = cookie.value;
      }
      source.addEventListener('keyup', function(){
        chrome.cookies.set({
          url: tab.url,
          name: 'xhprof:source',
          path: '/',
          value: source.value
        }, function(){});
      }, false);
    });
  });
});
