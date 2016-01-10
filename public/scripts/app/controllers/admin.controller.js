(function() {
    'use strict';
    
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