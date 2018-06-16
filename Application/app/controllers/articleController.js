app.controller('ArticleCtrl', ['$scope', '$rootScope', 'Data', '$localStorage',
function($scope, $rootScope, Data, $localStorage){

    $scope.users = [];
    $scope.articles = [];
    $scope.pageChoice = 10;
    $scope.currentPage = [];
    $scope.selected = false;
    $scope.article = {
        id: '',
        title: '',
        description: '',
        photo: ''
    }
    var formData = new FormData();

    $scope.setTheFiles = function ($files) {
        angular.forEach($files, function (value, key) {
            $scope.article.photo = value;
        });
        formData.append('file', $scope.article.photo);
    }

    $scope.init = function(){
        $scope.getArticles();
        $scope.getUsers();
        $scope.article = {
            id: '',
            title: '',
            description: '',
            photo: ''
        }
    }

    $scope.showModal = function(id){
        $(id).modal('show');
    }

    $scope.getTabs = function(a){
        $scope.tabs = [];
        for(var i = 0; i < a; i++){
            $scope.tabs.push(i+1);
        }
    }

    $scope.getUsers = function(){
        Data.get('users')
        .then(function(results){
            $scope.users = results;
        })
    }

    $scope.selectCurrentPageArticle = function(currentPage){
        Data.post('pagination_article', {page: currentPage, paginate: $scope.pageChoice})
        .then(function(results){
            $scope.pageChoice = results.meta.per_page;
            $scope.currentPage = results.meta.current_page;
            console.log(results);
            $scope.getTabs(results.meta.last_page);
            $scope.articles = results;
        }).catch(function(e){
            console.log(e);
        })
    }

    $scope.getArticles = function(){
        Data.get('articles/'+$scope.pageChoice)
        .then(function(results){
            if(results.data.length > 0){
                $scope.pageChoice = results.meta.per_page;
                $scope.currentPage = results.meta.current_page;
                $scope.getTabs(results.meta.last_page);
                $scope.articles = results;
            }else{
                $scope.articles = [];
            }
        })
        .catch(function(e){
            console.log(e);
        })
    }

    $scope.editArticle = function(article){
        console.log(article)
        $scope.article.id = article.id;
        $scope.article.title = article.title;
        $scope.article.description = article.description;
        $scope.article.photo = article.photo;
    }

    $scope.saveArticle = function(article){
        console.log(article)
        if(article.id != ''){
            if(article.photo != ""){
                Data.upload("upload/file", formData)
                .then(function(response) {
                    //Data.toast(response.data);
                    article.photo = response.result;
                    console.log(article.photo);
                    Data.put('article', article)
                    .then(function(results){
                        console.log(results);
                        $('#articleModal').modal('hide');
                        Data.toast({status: 'success', message: 'Article modifié avec succès'});
                        $scope.init();
                    })
                    .catch(function(e){
                        console.log(e)
                    })

                }).catch(function(e){
                    console.log(e);
                });
            }else{
                Data.put('article', article)
                .then(function(results){
                    console.log(results);
                    $('#articleModal').modal('hide');
                    Data.toast({status: 'success', message: 'Article modifié avec succès'});
                    $scope.init();
                })
                .catch(function(e){
                    console.log(e)
                })
            }
        }else{
            if (article.photo != "") {
                Data.upload("upload/file", formData)
                .then(function(response) {
                    //Data.toast(response.data);
                    article.photo = response.result;
                    console.log(article.photo);
                    Data.post('article', article)
                    .then(function (results) {
                        console.log(results);
                        $('#articleModal').modal('hide');
                        Data.toast({status: 'success', message: 'Article enregistré avec succès'});
                        $scope.init();
                    })
                    .catch(function (e) {
                        console.log(e);
                    })

                }).catch(function(e){
                    console.log(e);
                });
            } else {
                Data.post('article', article)
                .then(function (results) {
                    console.log(results);
                    $('#articleModal').modal('hide');
                    Data.toast({status: 'success', message: 'Article ajouté avec succès'});
                    $scope.init();
                })
                .catch(function (e) {
                    console.log(e);
                })
            }
        }
    }

    $scope.selectedArticle = function(id){
        $scope.selected = id;
    }

    $scope.deleteArticle = function(){
        Data.delete('article/'+$scope.selected)
        .then(function(results){
            console.log(results);
            $('#deleteDialog').modal('hide');
            Data.toast({status: 'success', message: 'Article supprimé avec succès'});
            $scope.init();
        })
        .catch(function(e){
            console.log(e);
        })
        $scope.selected = false;
    }

    $scope.init();

}])

.filter('realFormatDate', function(){
    return function(a){
        return moment(new Date(a)).format('YYYY-MM-DD');
    }
})
  