(function() {
    'use strict';
    
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
    
})();