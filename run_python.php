<?php
$python3 = '/usr/bin/python3';
$python_scrpt = '/var/www/html/pythonRun/test.py';

$device_ip = trim($_REQUEST['ip']);
$device_int = trim($_REQUEST['int']);
$int_descr = trim($_REQUEST['desc']);


$code_result = 0;
$answer = '';

if (filter_var($device_ip, FILTER_VALIDATE_IP) && strlen($device_int) >= 5) {
	$full_command_str = runScript($device_ip, $device_int, $int_descr);
	$code_result = 1;
	$answer = $full_command_str;
}

$return_args = [
		'ip' => $device_ip,
		'int' => $device_int,
		'desc' => $int_descr,
	];

header('Content-type: application/json');
echo json_encode([
	'code' => $code_result,
	'answer' => $answer,
	'args' => $return_args,
]);

function runScript($device_ip, $device_int, $int_descr)
{
	global $python3, $python_scrpt;
	$tmpfname = tempnam(sys_get_temp_dir(), "py_scrpt");
	$scrpt_args = escapeshellcmd('--ip '.$device_ip.' --int '.$device_int.' --desc '.$int_descr);
	$full_command_str = $python3.' '.$python_scrpt.' '.$scrpt_args.' >'.$tmpfname;
	$result = exec($full_command_str);
	unlink($tmpfname);
	// uncomment here to write the log to Apache
	// error_log($full_command_str);
	return $full_command_str;
}
?>
