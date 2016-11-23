<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">

		
		<title>
			Progressive Pushstate Example 2 - A Responsive Header Nav Using Links 
			and Select Form Widget.
		</title>
		<meta name="description" 
			content="Progressive Pushstate Example 2 - A Responsive Header Nav Using Links and Select Form Widget.">
		<meta name="author" content="Zoltan Hawryluk">

		<meta name="viewport" content="width=device-width; initial-scale=1.0">

		<link href="css/example2.css" type="text/css" rel="stylesheet" />
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
					<li><a class="pp-link" href="?f=robotron">Robotron 2084</a></li>
					<li><a class="pp-link" href="?f=tempest">Tempest</a></li>
				</ul>
				<form class="pp-form" data-pp-events="change">
					<select name="f">
						<option value="home">Home</option>
						<option value="donkey-kong">Donkey Kong</option>
						<option value="pac-man">Pac-Man</option>
						<option value="robotron">Robotron 2048</option>
						<option value="tempest">Tempest</option>
					</select>
				</form>
			</nav>
			<article id="content" >
				<!-- 
					* We are not doing the server render on page load here so we can test
					* whether or not this is detremental to SEO.
				-->
			</article>
		</div>
		
		<script src="../js/progressive-pushstate.js"></script>
		
		<!-- not needed for progressive-pushstate, but used in page code -->
		<script src="js/jquery-3.1.1.min.js"></script>
		<script src="js/example02-no-server-render.js"></script>
	</body>
</html>
