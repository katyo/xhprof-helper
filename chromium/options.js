window.addEventListener('load', function(){
  var url = document.getElementsByName('url')[0],
  key = document.getElementsByName('key')[0];

  function conf(){
    var opts = JSON.parse(localStorage.opts);
    url.value = opts.url;
    key.value = opts.key;
  }

  function save(){
    localStorage.opts = JSON.stringify({
      url: url.value,
      key: key.value
    });
  }

  conf();

  var fields = [url, key];
  for(var field in fields){
    for(var event in {change:0,keyup:0,blur:0}){
      fields[field].addEventListener(event, save, false);
    }
  }
});
