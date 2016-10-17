<?php

	// If the query string 'country' paramater is set 
	if (isset($_GET["country"])) {
		
		$searchString = $_GET["country"];
		$countryRe = "/" . $searchString . "/i";
?>

<?php
		
		// This is a text file containing all the countries in the world, one per line.
		$stream = new SplFileObject("data/countries.dat");
		$error = FALSE;
		$count = 0;
		$isValidInput = preg_match("/^[a-z\s]*$/i", $searchString);
		
		// If the search string only contains letters and spaces, search for it.
		if ($isValidInput) {
			$grepped = new RegexIterator($stream, $countryRe);
			
			/*
			 * For each country found, put it in a HTML list. 
			 */
			foreach ($grepped as $line) {
				$count++;
				
				/* 
				 * If this is the first country, print a heading explaining that what
				 * follows is the search results. 
				 */
				if ($count == 1) {
					echo "<h1>Countries that contain the string <em>“" . $searchString . "”</em></h1>
					<ul>";
				}
				
				echo "<li>" . $line . "</li>";
				
			}
		} 
		
		if ($count > 0) {
			echo "</ul>";
		} else if (! $isValidInput){
			echo "<p>Error: The search string should only contain letters of the alphabet. Try again.</p>";
		} else {
			echo "<p>There are no country names that contain the substring <em>“" . $searchString . "”</em>";
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