<?php

function _k10n_xhprof_flags(){
  static $bits;
  if(isset($bits)){
    return $bits;
  }
  $bits = 0;
  if(isset($_COOKIE['xhprof:flags'])){
    $FLAGS = array(
      'cpu' => XHPROF_FLAGS_CPU,
      'mem' => XHPROF_FLAGS_MEMORY
    );
    $flags = explode('+', $_COOKIE['xhprof:flags']);
    foreach($flags as $key){
      if(isset($FLAGS[$flags[$key]])){
        $bits += $FLAGS[$flags[$key]];
      }
    }
  }
  return $bits;
}

function _k10n_xprof_source(){
  if(isset($_COOKIE['xhprof:source'])){
    return $_COOKIE['xhprof:source'];
  }
  return $_SERVER['HTTP_HOST'];
}

function _k10n_xhprof_head(){
  $flags = _k10n_xhprof_flags();
  if($flags){
    xhprof_enable($flags);
  }
}

function _k10n_xhperf_foot(){
  if(_k10n_xhprof_flags()){
    $data = xhprof_disable();

    $xhprof_lib = '/usr/share/php5-xhprof/xhprof_lib/';
    include_once $xhprof_lib.'utils/xhprof_lib.php';
    include_once $xhprof_lib.'utils/xhprof_runs.php';

    $runs = new XHProfRuns_Default();
    $source = _k10n_xprof_source();
    $run = $runs->save_run($data, $source);

    //'http://xhprof.'.$_SERVER['HTTP_HOST'].'/index.php?run='.$run.'&source='.$source;
  }
}
