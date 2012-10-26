<?php

require 'k10n_xhprof.php';

/* Drupal truck: Handle Drupal's drupal_exit() call with hook_exit() */
function system_exit(){
  _k10n_xhprof_foot();
}

_k10n_xhprof_head();
