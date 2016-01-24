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
			<h1>Video Games for the 1980s</h1>
		</header>
		<nav>
			<ul>
				<li><a href="?f=donkey-kong">Donkey Kong</a></li>
				<li><a href="?f=pac-man">Pac-Man</a></li>
				<li><a href="?f=robotron">Robotron 2084</a></li>
				<li><a href="?f=tempest">Tempest</a></li>
			</ul>
		</nav>
		
		<article>
		<?php
			$fragment = $_GET["f"];
			
			if ($fragment == "") {
				$fragment = "home";
			}
			include "includes/" . $fragment . ".html";
		?>
		</article>
		
		<script src="../js/progressive-pushstate.js"></script>
		<script src="js/example02.js"></script>
	</body>
</html>
