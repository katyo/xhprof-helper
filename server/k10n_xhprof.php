<?php

if(extension_loaded('xhprof')){
  function _k10n_parse_args($str){
    parse_str($str, $args);
    return (object)$args;
  }
  
  function _k10n_format_args($args){
    $str = array();
    foreach ($args as $key => $val){
      $str[] = $key.'='.rawurlencode($val); 
    }
    return implode('&', $str);
  }
  
  function _k10n_xhprof_cookie($secret_key = NULL){
    static $opts;
    if(isset($opts)){
      return $opts;
    }
    $opts = new stdClass();
    $conf_secret_key = get_cfg_var('xhprof.secret_key');
    if($secret_key === NULL && $conf_secret_key){
      $secret_key = $conf_secret_key;
    }
    if(isset($_SERVER['XHPROF_COOKIE'])){
      $args = _k10n_parse_args($_SERVER['XHPROF_COOKIE']);
      if($secret_key && $args->key != $secret_key){
        return $opts;
      }
      $FLAGS = array(
        'cpu' => XHPROF_FLAGS_CPU,
        'mem' => XHPROF_FLAGS_MEMORY
      );
      $opts->flags = 0;
      $flags = explode('+', $args->flags);
      foreach($flags as $key => $val){
        if(isset($FLAGS[$val])){
          $opts->flags += $FLAGS[$val];
        }
      }
      $opts->source = $args->source;
      $opts->run = uniqid();
    }
    return $opts;
  }
  
  function _k10n_xhprof_head($secret_key = NULL){
    static $opts;
    
    if(isset($opts)){
      return;
    }
    
    $opts = _k10n_xhprof_cookie($secret_key);
    
    if(isset($opts->run)){
      $args = new StdClass();
      $args->run = $opts->run;
      
      header('X-HProf: '._k10n_format_args($args));
      
      xhprof_enable($opts->flags);
    }
  }
  
  function _k10n_xhprof_foot(){
    static $opts;
    
    if(isset($opts)){
      return;
    }
    
    $opts = _k10n_xhprof_cookie();
    
    if(isset($opts->run)){
      $data = xhprof_disable();
      
      $conf_library_dir = get_cfg_var('xhprof.library_dir');
      $xhprof_lib = $conf_library_dir ?
        $conf_library_dir :
        '/usr/share/php5-xhprof/xhprof_lib';
      
      include_once $xhprof_lib.'/utils/xhprof_lib.php';
      include_once $xhprof_lib.'/utils/xhprof_runs.php';
      
      $runs = new XHProfRuns_Default();
      $runs->save_run($data, $opts->source, $opts->run);
    }
  }
}else{
  function _k10n_xhprof_head($secret_key){}
  function _k10n_xhprof_foot(){}
}
