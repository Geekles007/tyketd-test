<?php

namespace App\Http\Controllers;

use App\User;
use Faker\Provider\zh_CN\DateTime;
use Illuminate\Http\Request;

class UserController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();
        return $users;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($request->id);

        $user->lastname = $request->input("lastname");
        $user->firstname = $request->input("firstname");
        $user->photo = $request->input("photo");
        $user->email = $request->input("email");
        $user->password = $request->input("password");
        $user->birthday = DateTime::date('Y-m-d', $request->input("birthday"));

        if($user->save()){
            return $user;
        }
    }

}
