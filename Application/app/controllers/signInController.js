app.controller('SigninCtrl', ['$scope', '$rootScope', 'Data', 'EVENTS', '$localStorage',
function($scope, $rootScope, Data, EVENTS, $localStorage){

    $scope.user = {
        email: '',
        password: ''
    }

    $scope.login = function (credentials) {
        Data.post('login', credentials)
        .then(function (user) {
            $rootScope.$broadcast(EVENTS.loginSuccess);
            $scope.setCurrentUser(user);
            window.location = '#/articles'
        }).catch(function (e) {
            Data.toast({status: 'error', message: 'Identifiant incorrect'});
            $rootScope.$broadcast(EVENTS.loginFailed);
        });
    };

}])