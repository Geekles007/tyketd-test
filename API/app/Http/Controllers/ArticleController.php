<?php

namespace App\Http\Controllers;

use App\Article;
use App\Http\Resources\ArticleResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\Paginator;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($paginate)
    {
        $articles = Article::where('user_id', '=', Auth::user()->id)->paginate($paginate);
        return count($articles) == 0 ? array('data' => array()) : ArticleResource::collection($articles);
    }

    /**
     * @param $page
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function pagination(Request $request){
        $params = $request->all();

        $currentPage = $params['page']; // You can set this to any page you want to paginate to

        Paginator::currentPageResolver(function () use ($currentPage) {
            return $currentPage;
        });

        $articles = Article::paginate($params['paginate']); // get list of 10 first item of users table
        return ArticleResource::collection($articles);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $article = $request->isMethod("put") ? Article::findOrFail($request->id) : new Article;

        $article->title = $request->input("title");
        $article->description = $request->input("description");
        $article->photo = $request->input("photo");
        $article->user_id = Auth::user()->id;

        if($article->save()){
            return new ArticleResource($article);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return new ArticleResource(Article::findOrFail($id)->first());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $article = Article::findOrFail($id);
        if(count($article)){
            if($article->delete()){
                return array("message" => "article supprimé avec succès", "status" => "success");
            }else{
                return array("message" => "delete error", "status" => "error");
            }
        }else{
            return array("message" => "delete error", "status" => "error");
        }
    }
}
