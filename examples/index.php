<!DOCTYPE html>
<html>
	<head>
		<title>Directory Listing</title>
	</head>
	<body>
		<h1>My Files</h1>
<?php
$dir    = '.';
$files1 = scandir($dir);
$fileToListRE = '/\.(php|html)$/';

for ($i=0; $i < count($files1); $i++) {
	$file = $files1[$i];
	if (preg_match($fileToListRE, $file)) {
		printf('<li><a href="%s">%s</a></li>', $file, $file);
	}
	
}
?>
	</body>
</html>

