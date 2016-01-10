(function() {
    'use strict';
    
    // Factory : Firebase
    angular.module('ChatFirebaseAngularApp').factory('AuthService', AuthService);

    AuthService.$inject = ['$firebaseAuth', 'Constants'];

    /* @ngInject */
    function AuthService($firebaseAuth, Constants) {

        var ref = new Firebase(Constants.url_firebase);
        return $firebaseAuth(ref);

    }
    
})();