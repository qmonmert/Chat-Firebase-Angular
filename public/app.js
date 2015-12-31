// Module
angular.module("ChatFirebaseAngularApp", ["firebase", "ui.router"]);


// Constants
angular.module("ChatFirebaseAngularApp").constant("Constants", {
	"url_firebase": "https://popping-fire-9851.firebaseio.com/data"
});


// Run
angular.module('ChatFirebaseAngularApp').run(Run);

Run.$inject = ['$rootScope', 'Constants', '$state'];

function Run($rootScope, Constants, $state) {

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate && !$rootScope.isAuthenticated){
            // User isn’t authenticated
            $state.go("home");
            event.preventDefault();
        }
    });

    var ref = new Firebase(Constants.url_firebase);
    ref.onAuth(authDataCallback);

    // Create a callback which logs the current auth state
    function authDataCallback(authData) {
        if (authData) {
            $rootScope.isAuthenticated = true;
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
        } else {
            $rootScope.isAuthenticated = false
            console.log("User is logged out");
        }
    }

}


// Factory
angular.module('ChatFirebaseAngularApp').factory('Auth', Auth);

Auth.$inject = ['$firebaseAuth', 'Constants'];

function Auth($firebaseAuth, Constants) {

    var ref = new Firebase(Constants.url_firebase);
    return $firebaseAuth(ref);

}


// Config
angular.module('ChatFirebaseAngularApp').config(Config);

Config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

function Config($stateProvider, $urlRouterProvider, $locationProvider) {

    // Active the html5Mode
    $locationProvider.html5Mode(true).hashPrefix('!')

    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state("home", {
            url: "/",
            templateUrl: "/views/login.html",
            controller: "LoginCtrl",
            authenticate: false
        })
        .state("chat", {
            url: "/chat",
            templateUrl: "/views/chat.html",
            controller: "ChatCtrl",
            authenticate: true
        })
        .state("admin", {
            url: "/admin",
            templateUrl: "/views/admin.html",
            controller: "AdminCtrl",
            authenticate: false
        });

}


// Contoller : Login
angular.module('ChatFirebaseAngularApp').controller('LoginCtrl', LoginCtrl);

LoginCtrl.$inject = ['$scope', '$state', 'Auth'];

function LoginCtrl($scope, $state, Auth) {

    // Function to log the user
    $scope.login = function() {
        Auth.$authWithPassword({
            email    : $scope.email,
            password : $scope.password
        }).then(function(authData) {
            console.log("Login success : " + authData);
            $state.go("chat");
        }, function(error) {
            console.error("Login fail : " + error);
        });
    };

}


// Contoller : Chat
angular.module('ChatFirebaseAngularApp').controller('ChatCtrl', ChatCtrl);

ChatCtrl.$inject = ['$scope', '$firebaseArray', 'Constants'];

function ChatCtrl($scope, $firebaseArray, Constants) {

    // Get all the messages of the chat
    var ref = new Firebase(Constants.url_firebase);
    $scope.messages = $firebaseArray(ref);

    // Get the user connected
    var authData = ref.getAuth();
    $scope.email = authData.password.email;
    getInfosOnTheUserConnected();

    // Function to add a new message in the chat
    $scope.addMessage = function() {
        var timestamp = new Date().getTime();
        $scope.messages.$add({
            user:   $scope.email,
            pseudo: $scope.pseudo,
            text:   $scope.newMessageText,
            img:    $scope.img,
            time:   timestamp
        }).then(function() {
            $scope.scroll();
        });
        $scope.newMessageText = "";
    };

    // Scroll down when the chat is loaded
    setTimeout(function(){
        $scope.scroll();
    }, 2000);

    // Scroll
    $scope.scroll = function() {
        $('.panel-body').scrollTop(1000000);
    };

    // Complete infos according to the user connected
    function getInfosOnTheUserConnected() {
        if ($scope.email === "quentin.monmert@gmail.com") {
            $scope.pseudo = "Quentin";
            $scope.img = "img/quentin.jpg";
        } else if ($scope.email === "thibaudmonmert@gmail.com") {
            $scope.pseudo = "Thibaud";
            $scope.img = "img/thibaud.jpg";
        } else if ($scope.email === "gmonmert@gmail.com") {
            $scope.pseudo = "Gautier";
            $scope.img = "img/gautier.jpg";
        } else {
            $scope.pseudo = "Unknown";
            $scope.img = "http://placehold.it/50/55C1E7/fff&amp;text=U";
        }
    };

}


// Contoller : Admin
angular.module('ChatFirebaseAngularApp').controller('AdminCtrl', AdminCtrl);

AdminCtrl.$inject = ['$scope'];

function AdminCtrl($scope) {

    $scope.users = [
        {email: "quentin.monmert@gmail.com", password: "admin",    pseudo: "Quentin", img: "img/quentin.jpg" },
        {email: "thibaudmonmert@gmail.com",  password: "pass",     pseudo: "Thibaud", img: "img/thibaud.jpg" },
        {email: "gmonmert@gmail.com",        password: "pass",     pseudo: "Gautier", img: "img/gautier.jpg" },
        {email: "user@user.com",             password: "password", pseudo: "Unknown", img: "..."             }
    ];

}

