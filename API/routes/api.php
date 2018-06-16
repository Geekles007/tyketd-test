<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
$api = app('Dingo\Api\Routing\Router');

$api->version('v1', function ($api) {

    $api->post('login', 'App\Http\Controllers\Auth\LoginController@login');
    $api->post('token', 'App\Http\Controllers\Auth\LoginController@getToken');
    $api->post('logout', 'App\Http\Controllers\Auth\LoginController@logout');
    $api->post('register', 'App\Http\Controllers\Auth\RegisterController@register');
    $api->post('/upload/avatar', 'App\Http\Controllers\UploadController@uploadAvatar');

    $api->group(['middleware' => ['jwt.auth']], function ($api) {

        $api->get('/articles/{paginate}', 'App\Http\Controllers\ArticleController@index');
        $api->post("/pagination_article", 'App\Http\Controllers\Api\ArticleController@pagination');
        $api->post('/article', 'App\Http\Controllers\ArticleController@store');
        $api->put('/article', 'App\Http\Controllers\ArticleController@store');
        $api->delete('/article/{id}', 'App\Http\Controllers\ArticleController@destroy');
        $api->put('/user/{id}', 'App\Http\Controllers\UserController@update');
        $api->get('/users', 'App\Http\Controllers\UserController@index');
        $api->post('/upload/file', 'App\Http\Controllers\UploadController@uploadPhoto');

    });

});

//Route::middleware('auth:api')->get('/user', function (Request $request) {
//    return $request->user();
//});
