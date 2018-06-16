app.factory("AuthService", ['$http', 'URL_API', '$localStorage',
    function ($http, URL_API, $localStorage) { // This service connects to our REST API

        var obj = {};

        obj.isConnected = function(){
            return localStorage.getItem('token');
        }

        obj.logout = function(){
            delete $localStorage.currentUser;
            localStorage.removeItem('token');
        }

        return obj;
}]);