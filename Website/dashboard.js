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
                resolve(user.uid);
            } else {
                reject(null);
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
                        addData("users/" + uid + "/currentGame", "Null").then(() => {
                            // once you have signed in and added all the data we need to reload the screen
                            location.reload();
                        });
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

        //when the user clicks find match, the game checks if there is anyone in the queue, if there is then just create a new game, with gameID of your uid, then set that person's currentGame to the gameID, and your own gameID to your uid

        document.getElementById("findMatchButton").disabled = true;

        const queueRef = firebase.database().ref("queue");
        queueRef.once('value').then((queueJSON) => {
            const uid = $scope.player.id;

            //parse the JSON
            var queue = JSON.parse(queueJSON.val());

            //check if the queue is empty
            if (queue.length == 0)
            {
                //if it is empty add yourself to the queue, then start listening for a change in your currentGame
                queue.push(uid);
                const queueReturnJSON = JSON.stringify(queue);
                addData("queue", queueReturnJSON).then(() => {

                    changed = 0;
                    const gameRef = firebase.database().ref("users/" + uid + "/currentGame");
                    gameRef.on('value', (snapshot) => {
                        console.log("Waiting in queue");
                        changed += 1; //the first time it is just getting the data, the second time is when it actually changes

                        if (changed == 2)
                        {
                            //when there is a change, go to the game.html, and you will can read the currentGam from there
                            location.href = "game.html";
                            console.log("changed")
                        }
                    });
                });
            }
            else
            {
                //if there is someone else in the queue, then create a new game, and set both of your currentGames to the gameID (which is your uid)
                const gameID = uid;
                const player1UID = uid;
                const player2UID = queue[0];

                const jsonData = JSON.stringify({ //just adding data underneath the game
                    player1: player1UID,
                    player2: player2UID
                });

                //create new game
                addData("games/" + gameID, jsonData).then(() => {

                    //set the currentGame of both users
                    addData("users/" + player1UID + "/currentGame", gameID).then(() => {
                        addData("users/" + player2UID + "/currentGame", gameID).then(() => {
                            //once you have added both we can delete the 2 players from the queue
                            const p1Index = queue.indexOf(player1UID);
                            queue.splice(p1Index, 1);
                            const p2Index = queue.indexOf(player2UID);
                            queue.splice(p2Index, 1);

                            const queueReturnJSON = JSON.stringify(queue);
                            //upload the new queue back to firebase
                            addData("queue", queueReturnJSON).then(() => {
                                //then go to game.html (the gameID is stored in your user data in firebase)
                                location.href = "game.html";
                            });
                        })
                    })

                })
            }

        });
    }
});