app.controller('appCtrl', ['$scope', '$rootScope', 'AuthService', '$location', 'Data',
function($scope, $rootScope, AuthService, $location, Data){

    $rootScope.logout = function(){
        AuthService.logout();
        $rootScope.currentUser = '';
        $location.path('/sign-in');
    }

    $scope.user = {
        id: '',
        firstname: '',
        lastname: '',
        birthday: '',
        email: '',
        password: '',
        confpassword: '',
        photo: ''
    }
    var formData = new FormData();

    $scope.setTheFiles = function ($files) {
        angular.forEach($files, function (value, key) {
            $scope.user.photo = value;
        });
        formData.append('file', $scope.user.photo);
    }

    $scope.initInfos = function(){
        $scope.user = {
            id: '',
            firstname: '',
            lastname: '',
            birthday: '',
            email: '',
            password: '',
            confpassword: '',
            photo: ''
        }
    }

    $scope.getCurrentUser = function(){
        Data.post('token', {token: localStorage.getItem('token')})
        .then(function(results){
            $rootScope.currentUser = results;
        })
    }

    $scope.saveUser = function(user, isValid){
        console.log(user)
        if(isValid){
            if(user.id != ''){
                if(user.photo != ""){
                    Data.upload("upload/avatar", formData)
                    .then(function(response) {
                        //Data.toast(response.data);
                        user.photo = response.result;
                        console.log(user.photo);
                        Data.put('user/'+user.id, user)
                        .then(function(results){
                            console.log(results);
                            $('#userModal').modal('hide');
                            Data.toast({status: 'success', message: 'Utilisateur modifié avec succès'});
                            $scope.initInfos();
                        })
                        .catch(function(e){
                            console.log(e)
                        })
    
                    }).catch(function(e){
                        console.log(e);
                    });
                }else{
                    Data.put('user/'+user.id, user)
                    .then(function(results){
                        console.log(results);
                        $('#userModal').modal('hide');
                        Data.toast({status: 'success', message: 'Utilisateur modifié avec succès'});
                        $scope.initInfos();
                    })
                    .catch(function(e){
                        console.log(e)
                    })
                }
                $scope.getCurrentUser();
            }else{
                if (user.photo != "") {
                    Data.upload("upload/avatar", formData)
                    .then(function(response) {
                        //Data.toast(response.data);
                        user.photo = response.result;
                        console.log(user.photo);
                        Data.post('register', user)
                        .then(function (results) {
                            console.log(results);
                            $('#userModal').modal('hide');
                            Data.toast({status: 'success', message: 'Utilisateur enregistré avec succès'});
                            $scope.initInfos();
                        })
                        .catch(function (e) {
                            console.log(e);
                        })
    
                    }).catch(function(e){
                        console.log(e);
                    });
                } else {
                    Data.post('register', user)
                    .then(function (results) {
                        console.log(results);
                        $('#userModal').modal('hide');
                        Data.toast({status: 'success', message: 'Utilisateur ajouté avec succès'});
                        $scope.initInfos();
                    })
                    .catch(function (e) {
                        console.log(e);
                    })
                }
            }
        }else{
            Data.toast({status: 'error', message: 'Formulaire non valide'});
        }
    }

    $rootScope.editAccount = function(user){
        $scope.user = user;
        $scope.user.password = user.password;
        $scope.user.confpassword = user.password;
        $scope.user.birthday = new Date(user.birthday)
        console.log($scope.user)
    }

}])

.directive('confirmPwd', function($interpolate, $parse) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ngModelCtrl) {

            var pwdToMatch = $parse(attr.confirmPwd);
            var pwdFn = $interpolate(attr.confirmPwd)(scope);

            scope.$watch(pwdFn, function(newVal) {
                ngModelCtrl.$setValidity('password', ngModelCtrl.$viewValue == newVal);
            })

            ngModelCtrl.$validators.password = function(modelValue, viewValue) {
                var value = modelValue || viewValue;
                return value == pwdToMatch(scope);
            };

        }
    }
})