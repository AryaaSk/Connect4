app.controller("game", function($scope){
	
	//making player objects (will get from firebase later)
	$scope.players = [{name: "Player 1", id: "213819904", rating: 1000, colour: "red"}, {name: "Player 2", id: "1324914", rating: 1025, colour: "blue"}];
	
	$scope.currentColour = "";
	//we have the colours in the players var
	$scope.colour1 = $scope.players[0].colour;
	$scope.colour2 = $scope.players[1].colour;

	$scope.gameOver = false;
	$scope.inAnimation = false;

	$scope.startGame = function()
	{
		$scope.switchPlayer();	

		$scope.gameOver = false;
		$scope.grid = [];
		i = 0;
		while (i != 6) //6 rows
		{ $scope.grid.push(["white", "white", "white", "white", "white", "white", "white"]); i += 1; }
		
	};
	$scope.switchPlayer = function()
	{
		//check current player (with colour)
		if ($scope.currentColour == $scope.colour1)
		{ $scope.currentColour = JSON.parse(JSON.stringify($scope.colour2)); }
		else if ($scope.currentColour == $scope.colour2)
		{ $scope.currentColour = JSON.parse(JSON.stringify($scope.colour1)); }
		else
		{ $scope.currentColour = JSON.parse(JSON.stringify($scope.colour1)); } //default colour
	};

	$scope.drop = function(column)
	{
		if ($scope.gameOver == true || $scope.inAnimation == true)
		{ return; }

		//keeping looping through rows at column to find where there is a space
		var rowIndex = 0;
		try
		{ while ($scope.grid[rowIndex][column] == "white") {  rowIndex += 1; } }
		catch
		{}
		rowIndex -= 1;

		if (rowIndex < 0) //the column is full
		{
			alert("This column is full");
		}
		else
		{
			//just insert at row index using the animation function
			$scope.inAnimation = true;
			dropAnimation(rowIndex, column); //i would all the rest of the code is in the dropAnimationCompletion, .then isnt working.
		}
	};
	
	function dropAnimation(endRow, column)
	{
		const distance = endRow;
		//add it in the first row
		$scope.grid[0][column] = $scope.currentColour;
		if (endRow == 0) //if it is 0 then it will cause an infinite loop otherwise
		{ $scope.inAnimation = false; dropAnimationCompletion(); return; }

		var i = 0;
		var repeat = setInterval(function() {
			//now remove and add it in the column underneath until the loop breaks
			$scope.grid[i][column] = "white"
			$scope.grid[i + 1][column] = $scope.currentColour;
			$scope.$applyAsync(); //for some reason you need this since it doesnt automatically update

			i += 1;
			if (i == distance)
			{ $scope.inAnimation = false; clearInterval(repeat); dropAnimationCompletion(); }
		}, 50);
	};

	function dropAnimationCompletion() //.then isnt working so i need to chain functions
	{
		if ($scope.checkGrid($scope.currentColour) == true)  //only need to check the colour that has just moved, as only that colour could have been modified
		{ $scope.gameOver = true; }
		else
		{ $scope.switchPlayer(); }
	}

	$scope.checkGrid = function(colour)
	{
		//check the grid for the specified colour (red or blue) (now it is colour1 or colour2)
		//loop through all counters with the same colour, and check in each direction for 4 matching pairs

		var row = 0;
		while (row != $scope.grid.length)
		{
			var column = 0;
			while (column != $scope.grid[row].length)
			{
				//here is where we check every counter and its colour
				if ($scope.grid[row][column] == colour)
				{
					//check which directions are valid, for example if you are in (row: X, column: >3), then it will be impossible for you to have 4 in a row to the right
					//row index starts at index 0 at the top
					//you only need 1 check in a certain direction, you dont need right and left, and you dont need up and down

					var availableDirections = ["right", "down", "diagonal-up-right", "diagonal-up-left"]; //excluding diagonals for now to keep it simple
					if (column > 3) //right not available
					{ availableDirections.splice(availableDirections.indexOf("right"), 1); }
					if (row > 2) //down not available 
					{ availableDirections.splice(availableDirections.indexOf("down"), 1); }

					if (column > 3 || row < 3)
					{ availableDirections.splice(availableDirections.indexOf("diagonal-up-right"), 1); }
					if (column < 3|| row < 3)
					{ availableDirections.splice(availableDirections.indexOf("diagonal-down-right"), 1); }
				
					//now go through the availableDirections, get the counters in a line and check if they are all the same colour
					var i = 0;
					while (i != availableDirections.length)
					{
						const currentDirection = availableDirections[i];
						if (currentDirection == "right")
						{
							//when the current direction is left we just need to get the 3 items to the left of the currentCounter (including the current counter to make it clear)
							const counter1 = $scope.grid[row][column];
							const counter2 = $scope.grid[row][column + 1];
							const counter3 = $scope.grid[row][column + 2];
							const counter4 = $scope.grid[row][column + 3];

							if (counter1 == colour && counter2 == colour && counter3 == colour && counter4 == colour)
							{ return true; }
						}
						else if (currentDirection == "down")
						{
							const counter1 = $scope.grid[row][column];
							const counter2 = $scope.grid[row + 1][column];
							const counter3 = $scope.grid[row + 2][column];
							const counter4 = $scope.grid[row + 3][column];

							if (counter1 == colour && counter2 == colour && counter3 == colour && counter4 == colour)
							{ return true; }
						}
						else if (currentDirection == "diagonal-up-right")
						{
							const counter1 = $scope.grid[row][column];
							const counter2 = $scope.grid[row - 1][column + 1];
							const counter3 = $scope.grid[row - 2][column + 2];
							const counter4 = $scope.grid[row - 3][column + 3];

							if (counter1 == colour && counter2 == colour && counter3 == colour && counter4 == colour)
							{ return true; }
						}
						else if (currentDirection == "diagonal-up-left")
						{
							const counter1 = $scope.grid[row][column];
							const counter2 = $scope.grid[row - 1][column - 1];
							const counter3 = $scope.grid[row - 2][column - 2];
							const counter4 = $scope.grid[row - 3][column - 3];

							if (counter1 == colour && counter2 == colour && counter3 == colour && counter4 == colour)
							{ return true; }
						}

						i += 1;
					}

				}	
				column += 1;
			}
			row += 1;
		}

		return false; //it is hasnt returned true yet then there are no matches so return false
	};

	$scope.capitalise = function(word)
	{ return word.charAt(0).toUpperCase() + word.slice(1); };

});;