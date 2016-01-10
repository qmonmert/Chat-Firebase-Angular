(function() {
    'use strict';
    
    // Config
    angular.module('ChatFirebaseAngularApp').config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

    /* @ngInject */
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
    
})();