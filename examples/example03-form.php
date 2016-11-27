<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">

		
		<title>
			Progressive Pushstate Example 3 - A Search Example With History
		</title>
		<meta property="og:title" content="Progressive Pushstate Example 3 - A Search Example With History" />
		<meta property="og:description" content="An example of how to use progressive-pushstate.js to create client side search pages that implement browser history." />
		<meta property="og:image" content="http://useragentman.com/examples/progressive-pushstate/examples/previews/example03.jpg" />
		
		<meta name="twitter:card" content="photo">
		<meta name="twitter:title" content="Progressive Pushstate Example 3 - A Search Example With History">
		<meta name="twitter:image" content="http://useragentman.com/examples/progressive-pushstate/examples/previews/example03.jpg">
		<meta name="author" content="Zoltan Hawryluk">

		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		
		<link href="css/example3.css" type="text/css" rel="stylesheet" />
	</head>

	<body>
		
		<?php
			$country = isset($_GET['country']) ? $_GET['country'] : "";
		?>
		
		<form class="pp-form" data-pp-events="keypress submit">
			<label for="country">Country: <input autofocus type="text" id="country" name="country" placeholder="Please enter in a country." autocomplete="off" value="<?php echo $country ?>"/></label>
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
