(function() {
    'use strict';
    
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
    
})();