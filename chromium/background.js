var defaults = {
  url: 'http://xhprof.yourdomain/',
  key: 'secret'
};

if(!localStorage.opts){
  localStorage.opts = JSON.stringify(defaults);
}

var defaults = {
  state: false,
  flags: [],
  source: 'xhprof',
  types: ['main_frame']
},
pool = {},
filter = {
  urls: ['<all_urls>']
};

function args(args){
  var i, p, ret;
  if(typeof args == 'string'){
    ret = {};
    args = args.split('&');
    for(i = 0; i < args.length; i++){
      p = args[i].split('=');
      ret[p[0]] = decodeURIComponent(p[1]);
    }
  }else if(typeof args == 'object'){
    ret = [];
    for(i in args){
      ret.push(i+'='+encodeURIComponent(args[i]));
    }
    ret = ret.join('&');
  }
  return ret;
}

function opt(key){
  return JSON.parse(localStorage.opts)[key];
}

chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
  var inst = pool[details.tabId];
  if(inst && inst.opts.state && inst.opts.types.indexOf(details.type) > -1){
    details.requestHeaders.push({
      name: 'X-HProf',
      value: args({
        flags: inst.opts.flags.join('+'),
        source: inst.opts.source,
        key: opt('key')
      })
    });
    return {requestHeaders: details.requestHeaders};
  }
}, filter, ['blocking', 'requestHeaders']);

chrome.webRequest.onHeadersReceived.addListener(function(details){
  var inst = pool[details.tabId];
  if(inst && inst.opts.state && inst.opts.types.indexOf(details.type) > -1){
    for(var i = 0; i < details.responseHeaders.length; i++){
      if(details.responseHeaders[i].name == 'X-HProf'){
        var ret = args(details.responseHeaders[i].value);
        inst.runs.push({
          href: details.url,
          type: details.type,
          run: ret.run,
          url: opt('url')+'?source='+inst.opts.source+'&run='+ret.run
        });
      }
    }
  }
}, filter, ['responseHeaders']);

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
  var tabId = request.tabId || sender.tab && sender.tab.id;
  if(tabId in pool){
    var inst = pool[tabId];
    if('opts' in request){
      if(request.opts){
        inst.opts = request.opts;
      }else if(request.opts === true){
        inst.opts = defaults;
      }else{
        sendResponse(inst.opts);
      }
    }
    if('runs' in request){
      if(request.runs){
        inst.runs = [];
      }else{
        sendResponse(inst.runs);
      }
    }
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(changeInfo.status == 'complete'){
    pool[tabId] = pool[tabId] || {
      runs: [],
      opts: defaults
    };
    chrome.pageAction.show(tabId);
  }
});
