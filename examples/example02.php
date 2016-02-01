<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">

		
		<title>Progressive Pushstate Example 2 - progressive enhanced AJAX</title>
		<meta name="description" content="">
		<meta name="author" content="Zoltan Hawryluk">

		<meta name="viewport" content="width=device-width; initial-scale=1.0">

		<link href="css/example2.css" type="text/css" rel="stylesheet" />
	</head>

	<body>
		<header>
			<h1>Video Games of the 1980s</h1>
		</header>
		<nav>
			<ul>
				<li><a class="pp-link" href="?f=donkey-kong">Donkey Kong</a></li>
				<li><a class="pp-link" href="?f=pac-man">Pac-Man</a></li>
				<li><a class="pp-link" href="?f=robotron">Robotron 2084</a></li>
				<li><a class="pp-link" href="?f=tempest">Tempest</a></li>
			</ul>
		</nav>
		
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
		
		<script src="../js/progressive-pushstate.js"></script>
		
		<!-- not needed for progressive-pushstate, but used in page code -->
		<script src="//code.jquery.com/jquery-1.12.0.min.js"></script>
		<script src="js/example02.js"></script>
	</body>
</html>
