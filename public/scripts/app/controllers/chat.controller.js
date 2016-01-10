(function() {
    'use strict';
    
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
    
})();