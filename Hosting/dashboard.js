var app = angular.module("connect4", []);

const firebaseConfig = {
    apiKey: "AIzaSyB5H7LsqptV5ycqWXu1fz6qqTmMGsCoA5Q",
    authDomain: "connect4-863d1.firebaseapp.com",
    databaseURL: "https://connect4-863d1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "connect4-863d1",
    storageBucket: "connect4-863d1.appspot.com",
    messagingSenderId: "920653652903",
    appId: "1:920653652903:web:97fe317ef24bcbcc7a4c82"
  };

firebase.initializeApp(firebaseConfig);

async function checkUser()
{
    let promise = new Promise(function(resolve, reject) {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                resolve(user.uid)
            } else {
                reject(null)
            }
        });
    });
    return promise;
};

async function addData(key, data)
{
    let promise = new Promise(function(resolve, reject) {
        firebase.database().ref(key).set(data).then(function onSuccess(res) {
            console.log(`Added ${data} at key: ${key}`);
            resolve("Done")
          });
    });
    return promise;
};

async function getData(key)
{
    let promise = new Promise(function(resolve, reject) {
        const reference = firebase.database().ref(key);
        reference.on('value', (snapshot) => {
            resolve(snapshot.val())
        });
    });
    return promise;
}

app.controller("dashboard", function($scope)
{
    $scope.displayName = "";
    $scope.emailAddress = "";
    $scope.password = "";

    $scope.authenticate = async function()
    {
        checkUser().then((uid) => {
            //now that we have this uid we can use it to access the data from the database
            $scope.getPlayer(uid);

        }, (rejected) => {
            $scope.getPlayer(rejected);
        })
    }

    $scope.player = {name: "", id: "", rating: 0, colour: "#000000"};
    $scope.getPlayer = function(uid)
    {
        if (uid == null)
        {
            $scope.player = null;
            $scope.$applyAsync();
            return
        } 

        //use this after you have checked the player is logged in
        $scope.player.id = uid;
        
        //get all the data from firebase

        const nameRef = firebase.database().ref("users/" + uid + "/name");
        const ratingRef = firebase.database().ref("users/" + uid + "/rating");
        const colourRef = firebase.database().ref("users/" + uid + "/colour");

        nameRef.once('value').then((name) => { 
            $scope.player.name = name.val();
            ratingRef.once('value').then((rating) => { 
                $scope.player.rating = rating.val();
                colourRef.once('value').then((colour) => { 
                    $scope.player.colour = colour.val();
                    $scope.$applyAsync();
                });  
            });  
        });
    };

    $scope.login = function(email, password)
    {
        console.log(`Sign in with ${$scope.emailAddress}`);

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            // once you have signed in we need to reload the screen
            location.reload();
        })
        .catch((error) => {
            var errorMessage = error.message;
            alert(errorMessage);
        });
    };
    $scope.logout = function()
    {
        firebase.auth().signOut().then(() => {
            location.reload();
        }).catch((error) => {
            alert(error.message)
        });
    };

    $scope.signupClicked = function(displayName, email, password)
    {
        console.log(`Create account for ${$scope.displayName}, with email: ${$scope.emailAddress}`);

        firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {

            const uid = userCredential.user.uid;
            //when we sign up we need to add some data in firebase
            addData("users/" + uid + "/name", displayName).then(() => {
                addData("users/" + uid + "/rating", 0).then(() => {
                    addData("users/" + uid + "/colour", "#ff0000").then(() => {
                        // once you have signed in and added all the data we need to reload the screen
                        location.reload();
                    });                    
                });
            });
            
        }).catch((error) => {
            alert(error.message)
        });;
    };

    $scope.loginSignup = function() //just show the login signup popup
    { document.getElementById("loginSignupWrapper").style.display = "block"; };
    $scope.hideLoginSignup = function() //close the popup
    { document.getElementById("loginSignupWrapper").style.display = "none"; };
    $scope.showLogin = function()
    {
        $scope.displayName = "";
        $scope.emailAddress = "";
        $scope.password = "";
        document.getElementById("loginContent").style.display = "block";
        document.getElementById("signupContent").style.display = "none";
    };
    $scope.showSignup = function()
    {
        $scope.displayName = "";
        $scope.emailAddress = "";
        $scope.password = "";
        document.getElementById("loginContent").style.display = "none";
        document.getElementById("signupContent").style.display = "block";
    };

    $scope.findGame = function()
    {
        //make a queue system in firebase

        //when the user clicks find match, it adds them to the queue in firebase, then just keep monitoring until that queue changes
        //when the queue changes the firebase listener will trigger, then you look in in the first 2 elements of that list, if you the player's uid is not there is means there is still space for another person
        //then always make the first person delete the items, otherwise you could cause double deletion

        document.getElementById("findMatchButton").disabled = true;

        $scope.$applyAsync();

        const queueRef = firebase.database().ref("queue");
        queueRef.once('value').then((queueJSON) => {
            //parse the JSON
            var queue = JSON.parse(queueJSON.val());
            //now we have a queue list, we just add our UID to the end
            const uid = $scope.player.id;
            queue.push(uid);

            //create queue json
            const queueReturnJSON = JSON.stringify(queue);

            //now just send it back
            addData("queue", queueReturnJSON).then(() => {
                console.log("Waiting in queue");

                //now refresh every 15 seconds, and wait until you are position 1 in the queue, if you are position 2 then the player in pos 1 will take you into a game.
                

                
                //location.href = "game.html"
            });

        });
    }
});