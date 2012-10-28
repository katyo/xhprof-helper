window.addEventListener('load', function(){
  var url = $('#url'),
  key = $('#key');

  function conf(){
    var opts = JSON.parse(localStorage.opts);
    url.val(opts.url);
    key.val(opts.key);
  }

  function save(){
    localStorage.opts = JSON.stringify({
      url: url.val(),
      key: key.val()
    });
    var group = $(this).parents('.control-group').removeClass('warning').addClass('success');
    setTimeout(function(){
      group.removeClass('success');
    }, 2000);
  }

  function res(){
    $(this).parents('.control-group').removeClass('success').addClass('warning');
  }

  conf();

  var fields = [url, key];
  for(var field in fields){
    for(var event in {change:0,keyup:0,blur:0}){
      fields[field].bind(event, save);
    }
    fields[field].bind('focus', res);
  }
});
