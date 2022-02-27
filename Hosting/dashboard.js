var app = angular.module("connect4", []);

const firebaseConfig = {
    apiKey: "AIzaSyB5H7LsqptV5ycqWXu1fz6qqTmMGsCoA5Q",
    authDomain: "connect4-863d1.firebaseapp.com",
    projectId: "connect4-863d1",
    databaseURL: "https://connect4-863d1-default-rtdb.europe-west1.firebasedatabase.app/",
    storageBucket: "connect4-863d1.appspot.com",
    messagingSenderId: "920653652903",
    appId: "1:920653652903:web:97fe317ef24bcbcc7a4c82"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

app.controller("dashboard", function($scope)
{
    $scope.displayName = "";
    $scope.emailAddress = "";
    $scope.password = "";

    $scope.loginClicked = function() //THIS IS NOT WORKING, BUT IT IS WORKING PERFECTLY IN PLANTRACKER SO I MUST BE MISSING SOMETHING
    {
        const email = JSON.parse(JSON.stringify($scope.emailAddress))
        const password = JSON.parse(JSON.stringify($scope.password))

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log(user);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
        });

    };

    $scope.signupClicked = function()
    {

    };

    $scope.loginSignup = function() //just show the login signup popup
    { document.getElementById("loginSignupWrapper").style.display = "block"; };
    $scope.hideLoginSignup = function() //close the popup
    { document.getElementById("loginSignupWrapper").style.display = "none"; };
    $scope.showLogin = function()
    {
        $scope.displayName = "Aryaa Sk";
        $scope.emailAddress = "aryaa_saravana@outlook.com";
        $scope.password = "nothing123";
        document.getElementById("loginContent").style.display = "block";
        document.getElementById("signupContent").style.display = "none";
    };
    $scope.showSignup = function()
    {
        $scope.displayName = "Aryaa Sk";
        $scope.emailAddress = "aryaa_saravana@outlook.com";
        $scope.password = "nothing123";
        document.getElementById("loginContent").style.display = "none";
        document.getElementById("signupContent").style.display = "block";
    };

    


    $scope.findGame = function()
    {
        //pass in both players id

        location.href = "game.html"
    }
});