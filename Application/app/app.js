var app = angular.module('APPART', ['ngRoute', 'ngMessages', 'ngStorage']);

/** CONTANT of application */
app.constant('URL_API', 'http://localhost:8000/api/');
app.constant('EVENTS', {
    loginSuccess: 'Connecté avec succès',
    failedSuccess: 'Echec de connexion',
    isConnected: 'Utilisateur connecté',
    notConnected: 'Utilisateur non connecté'
})

.directive('ngFiles', ['$parse', function ($parse) {

    function file_links(scope, element, attrs) {
        var onChange = $parse(attrs.ngFiles);
        element.on('change', function (event) {
            onChange(scope, {$files: event.target.files});
        });
    }

    return {
        link: file_links
    }
}])

/** Interceptors for all requests */
app.config(function($httpProvider){
    $httpProvider.interceptors.push(['$q', function ($q) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                //$httpProvider.defaults.headers.post['X-CSRF-TOKEN'] = $('meta[name=csrf-token]').attr('content');
                if (localStorage.getItem('token')) {
                    config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    window.location = '#/sign-in';
                }
                return $q.reject(response);
            }
        };
    }]);
})

/** Routes of application */
app.config(function($routeProvider) {

    $routeProvider
    .when('/sign-in', {
        templateUrl: 'views/sign-in.html',
        data: {
            pageTitle: 'CONNEXION'
        },
        controller: 'SigninCtrl'
    })
    .when('/articles', {
        templateUrl: 'views/article.html',
        data: {
            pageTitle: 'Gestion d\'articles'
        },
        controller: 'ArticleCtrl'
    })
    .otherwise('/sign-in')

});

/** Launch of application */
app.run(['$rootScope', 'AuthService', 'EVENTS', '$location', '$localStorage', 'Data', function($rootScope, AuthService, EVENTS, $location, $localStorage, Data){

    $rootScope.currentUser = '';

    $rootScope.setCurrentUser = function(user){
        $localStorage.currentUser = user;
        localStorage.setItem('token', user.token);
        $rootScope.currentUser = $localStorage.currentUser;
    }

    $rootScope.$on('$routeChangeStart', function (event, next) {
        console.log(AuthService.isConnected())
        if (AuthService.isConnected()) {
            $rootScope.$broadcast(EVENTS.isConnected);
            Data.post('token', {token: localStorage.getItem('token')})
            .then(function(results){
                $rootScope.currentUser = results;
                $rootScope.setCurrentUser(results);
            })
            .catch(function(e){
                console.log(e);
            })
            $location.path('/articles');
        } else {
            console.log(AuthService.isConnected())
            $location.path('/sign-in');
            $rootScope.$broadcast(EVENTS.notConnected);
        }
    });

}])