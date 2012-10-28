function checkelem(box, state){
  if(state !== null && state !== undefined){
    if(box.hasClass('active') != state){
      box.button('toggle');
    }
  }else{
    return box.hasClass('active');
  }
}
function checklist(boxes, list, i){
  if(list instanceof Array){
    for(i = 0; i < boxes.length; i++){
      checkelem(boxes.eq(i), list[i]);
    }
  }else{
    list = [];
    for(i = 0; i < boxes.length; i++){
      if(checkelem(boxes.eq(i))){
        list.push(boxes[i].value);
      }
    }
    return list;
  }
}

window.addEventListener('load', function(){
  chrome.tabs.getSelected(null, function(tab) {
    var state = $('#state'),
    flags = $('#flags button'),
    source = $('#source'),
    types = $('#types button'),
    runs_set = $('#runs');

    function conf(){
      setTimeout(function(){
        chrome.extension.sendMessage({
          tabId: tab.id,
          opts:{
            state: checkelem(state),
            flags: checklist(flags),
            source: source.val(),
            types: checklist(types)
          }
        });
      }, 0);
    }

    chrome.extension.sendMessage({
      tabId: tab.id,
      opts:null
    }, function(opts, i){
      checkelem(state, opts.state);
      checklist(flags, opts.flags);
      source.val(opts.source);
      checklist(types, opts.types);

      state.click(conf);
      flags.click(conf);
      source.change(conf).keyup(conf);
      types.click(conf);
    });

    chrome.extension.sendMessage({
      tabId: tab.id,
      runs:null
    }, function(runs){
      var links = [];
      for(var i = 0; i < runs.length; i++){
        links.push('<a href="'+runs[i].url+'" class="btn btn-info btn-mini">'+runs[i].run+'</a>');
      }
      if(links.length){
        runs_set.html(links.join(' '));
      }
    });
  });
});
