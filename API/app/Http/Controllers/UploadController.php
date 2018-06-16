<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;

class UploadController extends Controller
{


    /**
     * @param Request $request
     * @return array|string
     */
    public function uploadPhoto(Request $request){

        $file = array('image' => Input::file('file'));

        // setting up rules
        $rules = array('image' => 'required',); //mimes:jpeg,bmp,png and for max size max:10000
        // doing the validation, passing post data, rules and the messages
        $validator = Validator::make($file, $rules);
        if ($validator->fails()) {
            // send back to the page with the input data and errors
            return "validation failed";
        }else {
            // checking file is valid.
            if (Input::file('file')->isValid()) {
                $manager = new ImageManager(array('driver' => 'gd'));
                $destinationPath = 'images\articles'; // upload path
                $extension = Input::file('file')->getClientOriginalExtension(); // getting image extension
                $fileName = rand(11111,99999).'.'.$extension; // renameing image
                \Illuminate\Support\Facades\File::makeDirectory(public_path($destinationPath), 0777, false, true);
                $path = public_path($destinationPath . "\\" . $fileName);
                $manager->make(Input::file('file')->getRealPath())->save($path);
                return array("message" => "upload réussi! :)",
                    "status" => "success",
                    "result" => 'API/public/' . str_replace('\\', '/', $destinationPath) . "/" . $fileName);
            }
            else {
                // sending back with error message.
                return array("message" => "Echec lors de l'upload! :(",
                    "status" => "danger");
            }
        }
    }

    /**
     * @param Request $request
     * @return array|string
     */
    public function uploadAvatar(Request $request){

        $file = array('image' => Input::file('file'));

        // setting up rules
        $rules = array('image' => 'required',); //mimes:jpeg,bmp,png and for max size max:10000
        // doing the validation, passing post data, rules and the messages
        $validator = Validator::make($file, $rules);
        if ($validator->fails()) {
            // send back to the page with the input data and errors
            return "validation failed";
        }else {
            // checking file is valid.
            if (Input::file('file')->isValid()) {
                $manager = new ImageManager(array('driver' => 'gd'));
                $destinationPath = 'images\avatars'; // upload path
                $extension = Input::file('file')->getClientOriginalExtension(); // getting image extension
                $fileName = rand(11111,99999).'.'.$extension; // renameing image
                \Illuminate\Support\Facades\File::makeDirectory(public_path($destinationPath), 0777, false, true);
                $path = public_path($destinationPath . "\\" . $fileName);
                $manager->make(Input::file('file')->getRealPath())->save($path);
                return array("message" => "upload réussi! :)",
                    "status" => "success",
                    "result" => 'API/public/' . str_replace('\\', '/', $destinationPath) . "/" . $fileName);
            }
            else {
                // sending back with error message.
                return array("message" => "Echec lors de l'upload! :(",
                    "status" => "danger");
            }
        }
    }
}
