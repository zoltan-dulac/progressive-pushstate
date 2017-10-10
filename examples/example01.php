<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">

		
		<title>
			Progressive Pushstate Example 1 - A Responsive Header Nav Using Links and a Select Form Widget.
		</title>
		<meta property="og:title" content="Progressive Pushstate Example 2 - A Responsive Header Nav Using Links and a Select Form Widget." />
		<meta property="og:description" content="An example of how to use progressive-pushstate.js to create simply coded responsive navigation bars." />
		<meta property="og:image" content="http://useragentman.com/examples/progressive-pushstate/examples/images/previews/example01.jpg" />
		
		<meta name="twitter:card" content="photo">
		<meta name="twitter:title" content="Progressive Pushstate Example 2 - A Responsive Header Nav Using Links and a Select Form Widget.">
		<meta name="twitter:image" content="http://useragentman.com/examples/progressive-pushstate/examples/images/previews/example01.jpg">
		<meta name="author" content="Zoltan Hawryluk">

		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />

		<link href="css/example01.css" type="text/css" rel="stylesheet" />
	</head>

	<body>
		<div class="parallax">
			<header>
				<h1>Video Games of the <small>1980s</small></h1>
			</header>
			<nav class="fixedsticky">
				<ul>
					<li><a class="pp-link" href="?f=home">Home</a></li>
					<li><a class="pp-link" href="?f=donkey-kong">Donkey Kong</a></li>
					<li><a class="pp-link" href="?f=pac-man">Pac-Man</a></li>
					<li><a class="pp-link" href="?f=robotron">Robotron</a></li>
					<li><a class="pp-link" href="?f=tempest">Tempest</a></li>
				</ul>
				<form class="pp-form" data-pp-events="change">
					<select name="f">
						<option value="home" selected>Home</option>
						<option value="donkey-kong">Donkey Kong</option>
						<option value="pac-man">Pac-Man</option>
						<option value="robotron">Robotron</option>
						<option value="tempest">Tempest</option>
					</select>
					
					<input class="pp-no-support-button" type="submit" aria-label="Go to page selected" value="Go" />
					
				</form>
			</nav>
			<div id="screen-reader-alert"
				class="visually-hidden"
				role="alert"
				aria-live="assertive"
			><p>Now displaying the <?php echo $_GET["f"]; ?> page.</p></div>
			<article id="content">
				<?php
					if (isset($_GET["f"])) {
						$fragment = $_GET["f"];
					} else {
						$fragment = "home";
					}
					include "includes/" . $fragment . ".html";
				?>
			</article>
		</div>
		
		<script src="../js/progressive-pushstate.js"></script>
		
		<!-- not needed for progressive-pushstate, but used in page code -->
		<script src="js/jquery-3.1.1.min.js"></script>
		<script src="js/example01.js"></script>
	</body>
</html>
