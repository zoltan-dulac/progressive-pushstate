
<?php
	if (isset($_GET["country"])) {
		$country = "/" . $_GET["country"] . "/i";
?>
		<h1>Countries that contain the string <em><?php echo $_GET["country"]; ?></em></h1>
		

<?php
		
		
		$stream = new SplFileObject("data/countries.dat"); 
		$grepped = new RegexIterator($stream, $country); 
		
		if (count($grepped) > 0) {
			echo "<ul>";
				
			foreach ($grepped as $line) {
			    echo "<li>" . $line . "</li>";
			}
			
			echo "</ul>";
		}
?>		
		</div>
<?php

	} else {
?>
		<h1>progressive-pushstate.js demo #3 &mdash; Forms</h1>

		<p>Please enter in a country.  The search results will appear here.</p>
<?php
	}
	
?>