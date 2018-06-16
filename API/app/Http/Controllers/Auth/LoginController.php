<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use PHPUnit\Runner\Exception;
use Dingo\Api\Routing\Helpers;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Tymon\JWTAuth\Facades\JWTAuth;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;
    use Helpers;

    private $currentToken;

    /**
     * Login function
     * @param Request $request
     * @throws UnauthorizedHttpException
     */
    public function login(Request $request){

        $user = User::where('email', $request->email)->first();

        if($user && Hash::check($request->get('password'), $user->password)){
            $token = JWTAuth::fromUser($user);
            $this->currentToken = $token;
            return $this->sendLoginResponse($request, $user, $token);
        }

        return $this->sendFailedLoginResponse($request);
    }

    /**
     * @param Request $request
     * @param User $user
     * @param $token
     * @return mixed
     */
    public function sendLoginResponse(Request $request, User $user, $token){
        $this->clearLoginAttempts($request);

        return $this->authenticated($token, $user);
    }

    /**
     * @param $token
     * @param User $user
     * @return mixed
     */
    public function authenticated($token, User $user){
        return $this->response->array([
            'token' => $token,
            'status_code' => 200,
            'firstname' => $user->firstname,
            'id' => $user->id,
            'photo' => $user->photo,
            'birthday' => $user->birthday,
            'password' => $user->password,
            'lastname' => $user->lastname,
            'email' => $user->email,
            'message' => 'User Authenticated'
        ]);
    }

    /**
     * @throws UnauthorizedHttpException
     */
    public function sendFailedLoginResponse(){
        throw new UnauthorizedHttpException("Bad Credentials");
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|mixed
     */
    public function getToken(Request $request){
        try {
            $user = JWTAuth::toUser($request->token);
        } catch (Exception $e) {
            if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException){
                return response()->json(['error'=>'Token is Invalid']);
            }else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException){
                return response()->json(['error'=>'Token is Expired']);
            }else{
                return response()->json(['error'=>'Something is wrong']);
            }
        }
        return $this->authenticated($request->input('token'), $user);
    }

    public function logout(Request $request){
        JWTAuth::invalidate($request->token);
        $this->guard()->logout();
    }
}
