(function() {
    'use strict';


    // Module
    angular.module('ChatFirebaseAngularApp', ['firebase', 'ui.router']);


    // Constants
    angular.module('ChatFirebaseAngularApp').constant('Constants', {
        'json_path': 'json/',
        'url_firebase': 'https://popping-fire-9851.firebaseio.com/data'
    });


    // Run
    angular.module('ChatFirebaseAngularApp').run(Run);

    Run.$inject = ['$rootScope', 'Constants', '$state'];

    function Run($rootScope, Constants, $state) {

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate && !$rootScope.isAuthenticated){
                // User isn’t authenticated
                $state.go('home');
                event.preventDefault();
            }
        });

        var ref = new Firebase(Constants.url_firebase);
        ref.onAuth(authDataCallback);

        // Create a callback which logs the current auth state
        function authDataCallback(authData) {
            if (authData) {
                $rootScope.isAuthenticated = true;
                console.log('User ' + authData.uid + ' is logged in with ' + authData.provider);
            } else {
                $rootScope.isAuthenticated = false;
                console.log('User is logged out');
            }
        }

    }


    // Factory : Firebase
    angular.module('ChatFirebaseAngularApp').factory('AuthService', AuthService);

    AuthService.$inject = ['$firebaseAuth', 'Constants'];

    /* @ngInject */
    function AuthService($firebaseAuth, Constants) {

        var ref = new Firebase(Constants.url_firebase);
        return $firebaseAuth(ref);

    }


    // Factory : Strava
    angular.module('ChatFirebaseAngularApp').factory('StravaService', StravaService);

    StravaService.$inject = ['$http', 'Constants'];

    /* @ngInject */
    function StravaService($http, Constants) {

        return {
            getActivities: getActivities,
            getAthlete: getAthlete
        };

        function getActivities() {
            return $http.get(Constants.json_path + 'activities.json')
                .then(getActivitiesSuccess)
                .catch(getActivitiesFailed);
            function getActivitiesSuccess(response) {
                return response.data;
            }
            function getActivitiesFailed(error) {
                console.error('XHR Failed for getActivities.' + error.data);
            }
        }

        function getAthlete() {
            return $http.get(Constants.json_path + 'athlete.json')
                .then(getAthleteSuccess)
                .catch(getAthleteFailed);
            function getAthleteSuccess(response) {
                return response.data;
            }
            function getAthleteFailed(error) {
                console.error('XHR Failed for getAthlete.' + error.data);
            }
        }

    }


    // Config
    angular.module('ChatFirebaseAngularApp').config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

    function Config($stateProvider, $urlRouterProvider, $locationProvider) {

        // Active the html5Mode
        $locationProvider.html5Mode(true).hashPrefix('!');

        // For any unmatched url, redirect to /
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/views/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'loginCtrl',
                authenticate: false
            })
            .state('chat', {
                url: '/chat',
                templateUrl: '/views/chat.html',
                controller: 'ChatCtrl',
                controllerAs: 'chatCtrl',
                authenticate: true
            })
            .state('admin', {
                url: '/admin',
                templateUrl: '/views/admin.html',
                controller: 'AdminCtrl',
                controllerAs: 'adminCtrl',
                resolve: { /* @ngInject */
                    ActivitiesPrepService: function(StravaService) {
                        return StravaService.getActivities();
                    }
                },
                authenticate: false
            });

    }


    // Contoller : Login
    angular.module('ChatFirebaseAngularApp').controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$state', 'AuthService'];

    /* @ngInject */
    function LoginCtrl($state, AuthService) {

        var _self = this;

        _self.login = login;

        // Function to log the user
        function login() {
            AuthService.$authWithPassword({
                email    : _self.email,
                password : _self.password
            }).then(function(authData) {
                console.log('Login success : ' + authData);
                $state.go('chat');
            }, function(error) {
                console.error('Login fail : ' + error);
            });
        }

    }


    // Contoller : Chat
    angular.module('ChatFirebaseAngularApp').controller('ChatCtrl', ChatCtrl);

    ChatCtrl.$inject = ['$firebaseArray', '$timeout', 'Constants'];

    /* @ngInject */
    function ChatCtrl($firebaseArray, $timeout, Constants) {

        var _self = this;

        var ref = new Firebase(Constants.url_firebase);
        var authData = ref.getAuth(); // get the user connected

        _self.scroll = scroll;
        _self.messages = $firebaseArray(ref);
        _self.email = authData.password.email;
        _self.pseudo = '';
        _self.img = '';
        _self.addMessage = addMessage;

        getInfosOnTheUserConnected();

        // Function to add a new message in the chat
        function addMessage() {
            var timestamp = new Date().getTime();
            _self.messages.$add({
                user:   _self.email,
                pseudo: _self.pseudo,
                text:   _self.newMessageText,
                img:    _self.img,
                time:   timestamp
            }).then(function() {
                _self.scroll();
            });
            _self.newMessageText = '';
        }

        // Scroll
        function scroll() {
            $('.panel-body').scrollTop(1000000);
        }

        // Complete infos according to the user connected
        function getInfosOnTheUserConnected() {
            if (_self.email === 'quentin.monmert@gmail.com') {
                _self.pseudo = 'Quentin';
                _self.img = 'img/quentin.jpg';
            } else if (_self.email === 'thibaudmonmert@gmail.com') {
                _self.pseudo = 'Thibaud';
                _self.img = 'img/thibaud.jpg';
            } else if (_self.email === 'gmonmert@gmail.com') {
                _self.pseudo = 'Gautier';
                _self.img = 'img/gautier.jpg';
            } else {
                _self.pseudo = 'Unknown';
                _self.img = 'http://placehold.it/50/55C1E7/fff&amp;text=U';
            }
        }

        // Scroll down when the chat is loaded
        $timeout(function(){
            _self.scroll();
        }, 2000);

    }


    // Contoller : Admin
    angular.module('ChatFirebaseAngularApp').controller('AdminCtrl', AdminCtrl);

    AdminCtrl.$inject = ['StravaService', 'ActivitiesPrepService'];

    /* @ngInject */
    function AdminCtrl(StravaService, ActivitiesPrepService) {

        var _self = this;

        _self.users = getUsers();
        _self.activities = ActivitiesPrepService;
        _self.athlete = {};

        formatDistance();
        getAthlete();

        function getUsers() {
            return [
                {email: 'quentin.monmert@gmail.com', password: 'admin',    pseudo: 'Quentin', img: 'img/quentin.jpg'},
                {email: 'thibaudmonmert@gmail.com',  password: 'pass',     pseudo: 'Thibaud', img: 'img/thibaud.jpg'},
                {email: 'gmonmert@gmail.com',        password: 'pass',     pseudo: 'Gautier', img: 'img/gautier.jpg'},
                {email: 'user@user.com',             password: 'password', pseudo: 'Unknown', img: '...'}
            ];
        }

        function formatDistance() {
            angular.forEach( _self.activities, function(value, key) {
                value.distance = value.distance / 1000;
            });
        }

        function getAthlete() {
            return StravaService.getAthlete()
                .then(function(data) {
                    _self.athlete = data;
                    angular.forEach( _self.athlete.shoes, function(value, key) {
                        value.distance = value.distance / 1000;
                    });
                    return _self.athlete;
                });
        }

    }

})();