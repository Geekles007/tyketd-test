app.factory("Data", ['$http', 'URL_API',
    function ($http, URL_API) { // This service connects to our REST API

        var serviceBase = URL_API;

        var obj = {};
        obj.toast = function (data) {
            alert(data.status + " : " + data.message)
        };
        obj.get = function (q) {
            return $http.get(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        obj.post = function (q, object) {
            return $http.post(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.put = function (q, object) {
            return $http.put(serviceBase + q, object).then(function (results) {
                return results.data;
            });
        };
        obj.delete = function (q) {
            return $http.delete(serviceBase + q).then(function (results) {
                return results.data;
            });
        };
        obj.upload = function (q, object) {
            return $http.post(serviceBase + q, object, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(function (results) {
                return results.data;
            });
        };

        return obj;
}]);