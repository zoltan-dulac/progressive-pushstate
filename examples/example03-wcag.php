<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">

		<title> Progressive Pushstate Example 3 - Filtering Data</title>
		<meta property="og:title" content="Progressive Pushstate Example 4 - A Table Filter With History" />
		<meta property="og:description" content="An example of how to use progressive-pushstate.js to filter items in a table with history." />
		<meta property="og:image" content="http://useragentman.com/examples/progressive-pushstate/examples/previews/example04.jpg" />
		
		<meta name="twitter:card" content="photo">
		<meta name="twitter:title" content="Progressive Pushstate Example 4 - A Table Filter With History">
		<meta name="twitter:image" content="http://useragentman.com/examples/progressive-pushstate/examples/previews/example04.jpg">
		<meta name="author" content="Zoltan Hawryluk">

		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		<link href="css/example03.css" type="text/css" rel="stylesheet" />
		
		<?php
			$currentLevels = isset($_GET["level"]) ? $_GET["level"] : null;
				
			//$currentLevels = $levelParam ? explode(",", $levelParam) : array();
			$currentSection = isset($_GET["section"]) ? $_GET["section"] : null;
			
			$captionSection = ($currentSection == null) ? 'all sections' : str_replace("-", " ", $currentSection);
			
			$wcagLevels = array('level-a', 'level-aa', 'level-aaa');
			$checkedState = array(
				'level-A' => '',
				'level-AA' => '',
				'level-AAA' => ''
			);
			
			if ($currentLevels != null) {
				foreach ($wcagLevels as &$level) {
					if(in_array($level, $currentLevels)){
					  ${"checkedState[" . $level ."]"} = 'checked';
					}
				}
			}
			
			
			if ($currentLevels == null || sizeof($currentLevels) == 3) {
				$captionLevel = 'of WCAG A, AA and AAA';
			} else {
				switch (sizeof($currentLevels)) {
					case 1:
						$captionLevel = 'of WCAG Level ' . str_replace("level-", " ", $currentLevels[0]);
						break;
					case 2:
						$captionLevel = 'of WCAG Levels ' . str_replace("level-", " ", $currentLevels[0]) . ' and ' . str_replace("level-", " ", $currentLevels[1]);
						break;
				}
			}
		?>
	</head>

	<body>
		
		<form class="pp-form" autocomplete="off">
			
			<fieldset>
				<legend>Filters</legend>
				
				<div class="field-group-container">
					<label for="section">Section: 
						<select id="section" name="section">
							<option value="">All</option>
							<option value="section-1">Perceivable</option>
							<option value="section-2">Operable</option>
							<option value="section-3">Understandable</option>
							<option value="section-4">Robust</option>
						</select>
					</label>
				</div>
			
				<div class="field-group-container">
					<label for="level-a">
						<input 
							id="level-a"
							name="level[]"
							value="level-A"
							type="checkbox"
							<?php echo $checkedState["level-A"]; ?>
						/>Level A</label>
					<label for="level-aa">
						<input 
							id="level-aa"
							name="level[]"
							value="level-AA"
							type="checkbox" />Level AA</label>
							<?php echo $checkedState["level-AA"]; ?>
					<label for="level-aaa">
						<input 
							id="level-aaa"
							name="level[]"
							value="level-AAA"
							type="checkbox"
							<?php echo $checkedState["level-AAA"]; ?>
						/>Level AAA</label>
				</div>
			</fieldset>
		</form>

		<table id="wcag-requirements">
			<caption role="alert" aria-live="assertive">
				<?php echo "This is a table that contains $captionSection $captionLevel."; ?>
			</caption>
			<thead>
				<tr>
					<th class="sortable" data-href="?this=that" scope="col">Section</th>
					<th class="sortable" scope="col">Guideline</th>
					<th class="sortable" scope="col">Summary</th>
					<th class="sortable" scope="col">Level</th>
				</tr>
			</thead>
			<tbody>
				<?php
				/*
				 * Go through each line in the data file and place them in a table row.
				 */
				$handle = fopen("data/wcag.dat", "r");
				$visibleRowCount = 0;
				if ($handle) {
				    while (($line = fgets($handle)) !== false) {
				    	list($wcagItem, $url, $name, $desc, $level) = array_map('trim', explode("\t", $line));
							list($section) = explode(".", $wcagItem);
							$levelData = "level-$level";
							$sectionClass = "section-$section";
							
							
							if (
								(sizeof($currentLevels) == 0 || in_array($levelData, $currentLevels)) && 
								(!$currentSection || $currentSection == $sectionClass)
							) {
								$visibilityClass = 'show';
								if ($visibleRowCount % 2 === 0) {
									$visibilityClass .= ' even';
								} 
								$visibleRowCount++;
							} else {
								$visibilityClass = 'hide';
							}
				
							echo "<tr class=\"$levelData section-$section all $visibilityClass\" data-level=\"$levelData\">
									<td><div>$wcagItem</div></td><td><div><a href=\"$url\">$name</a></div></td>
									<td><div>$desc</div></td>
									<td><div>$level</div></td>
								</tr>";
				    }
				    fclose($handle);
				} else {
				    echo '<p class="no-data">Sorry -- I can\'t find the data for this page.</p>';
				} 
				?>
			</tbody>
		</table>

		
		<script src="../js/progressive-pushstate.js"></script>
		<script src="js/example03.js"></script>
	</body>
</html>
