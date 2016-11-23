<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">

		
		<title>
			Progressive Pushstate Example 3 - A Search Example With History
		</title>
		<meta name="description" 
			content="Progressive Pushstate Example 3 - A Search Example With History">
		<meta name="author" content="Zoltan Hawryluk">

		<meta name="viewport" content="width=device-width; initial-scale=1.0">
		
		<link href="css/example3.css" type="text/css" rel="stylesheet" />
	</head>

	<body>
		
		
		
		<form class="pp-form" data-pp-events="keypress submit">
			<label for="country">Country: <input autofocus type="text" id="country" name="country" placeholder="Please enter in a country." autocomplete="off" value="<?php echo $_GET['country'] ?>"/></label>
		</form>
		
		<main>
			<article id="content">
			<?php
				include "showCountries.php";
			?>
			</article>
		</main>
		<script src="../js/progressive-pushstate.js"></script>
		
		<!-- not needed for progressive-pushstate, but used in page code -->
		<script src="js/jquery-3.1.1.min.js"></script>
		<script src="js/example03.js"></script>
	</body>
</html>
