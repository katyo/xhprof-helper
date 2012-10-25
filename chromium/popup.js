function checklist(boxes, list, i){
  if(list instanceof Array){
    for(i = 0; i < boxes.length; i++){
      boxes[i].checked = list.indexOf(boxes[i].value) > -1;
    }
  }else{
    list = [];
    for(i = 0; i < boxes.length; i++){
      if(boxes[i].checked){
        list.push(boxes[i].value);
      }
    }
    return list;
  }
}

window.addEventListener('load', function(){
  chrome.tabs.getSelected(null, function(tab) {
    var opts_set = document.getElementById('opts'),
    state = document.getElementsByName('state')[0],
    flags = document.getElementsByName('flags[]'),
    source = document.getElementsByName('source')[0],
    types = document.getElementsByName('types[]'),
    runs_set = document.getElementById('runs');

    function conf(){
      chrome.extension.sendMessage({
        tabId: tab.id,
        opts:{
          state: state.checked,
          flags: checklist(flags),
          source: source.value,
          types: checklist(types)
        }
      });
    }

    chrome.extension.sendMessage({
      tabId: tab.id,
      opts:null
    }, function(opts, i){
      state.checked = opts.state;
      checklist(flags, opts.flags);
      source.value = opts.source;
      checklist(types, opts.types);

      state.addEventListener('click', conf, false);
      for(i = 0; i < flags.length; i++){
        flags[i].addEventListener('click', conf, false);
      }
      source.addEventListener('keyup', conf, false);
      for(i = 0; i < types.length; i++){
        types[i].addEventListener('click', conf, false);
      }
    });

    chrome.extension.sendMessage({
      tabId: tab.id,
      runs:null
    }, function(runs){
      var links = [];
      for(var i = 0; i < runs.length; i++){
        links.push('<a href="'+runs[i].url+'">'+runs[i].run+'</a>');
      }
      if(links.length){
        runs_set.innerHTML = '<ul><li>'+links.join('</li><li>')+'</li></ul>';
      }
    });
  });
});
