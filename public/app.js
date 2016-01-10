(function() {
    'use strict';

    // Module
    angular.module('ChatFirebaseAngularApp', ['firebase', 'ui.router']);

    // Run
    angular.module('ChatFirebaseAngularApp').run(Run);

    Run.$inject = ['$rootScope', 'Constants', '$state'];

    /* @ngInject */
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

})();