app.controller("dashboard", function($scope)
{
	$scope.loginSignup = function()
    {
        //just show the login signup popup
        document.getElementById("loginSignupWrapper").style.visibility = "visible";
    }

    $scope.findGame = function()
    {
        //pass in both players id

        location.href = "game.html"
    }
});