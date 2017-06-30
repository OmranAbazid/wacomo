<?php
header('Access-Control-Allow-Origin: *');
$json = file_get_contents('http://wacomo2.azurewebsites.net/api/wacomo2');
echo $json;?>
