<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">

		
		<title>HTML</title>
		<meta name="description" content="">
		<meta name="author" content="Zoltan Hawryluk">

		<meta name="viewport" content="width=device-width; initial-scale=1.0">
		
		<link href="css/example3.css" type="text/css" rel="stylesheet" />
	</head>

	<body>
		
		<h1>Test 3</h1>
		
		
		<form class="pp-form">
			<label for="country">Country: <input type="text" id="country" name="country" placeholder="Please enter in a country."/></label>
			<input type="submit" value="Submit My Country" />
		</form>
		
		<article>
		<?php
			include "showCountries.php";
		?>
		</article>
		
		
	</body>
</html>
