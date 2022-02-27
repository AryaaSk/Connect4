var app = angular.module("connect4", []);

app.controller("dashboard", function($scope)
{
    $scope.displayName = "";
    $scope.emailAddress = "";
    $scope.password = "";

    $scope.login = function()
    {
        console.log(`Sign in with ${$scope.emailAddress}, will write code later (wasn't working so need to do some testing, could be because 127.0.0.1 isnt an authorised domain)`);
    }

    $scope.signupClicked = function()
    {
        console.log(`Create account for ${$scope.displayName}, with email: ${$scope.emailAddress} (will have to create code later, after some testing)`);
    };

    $scope.loginSignup = function() //just show the login signup popup
    { document.getElementById("loginSignupWrapper").style.display = "block"; };
    $scope.hideLoginSignup = function() //close the popup
    { document.getElementById("loginSignupWrapper").style.display = "none"; };
    $scope.showLogin = function()
    {
        document.getElementById("loginContent").style.display = "block";
        document.getElementById("signupContent").style.display = "none";
    };
    $scope.showSignup = function()
    {
        document.getElementById("loginContent").style.display = "none";
        document.getElementById("signupContent").style.display = "block";
    };


    $scope.findGame = function()
    {
        //pass in both players id (will have to create a queue system in firebase, after I manage to get it working)

        location.href = "game.html"
    }
});