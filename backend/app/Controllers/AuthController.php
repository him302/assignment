<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;
use Exception;

class AuthController extends ResourceController
{
    protected $modelName = UserModel::class;
    protected $format    = 'json';

    public function register()
    {
        $rules = [
            'email'      => 'required|valid_email|is_unique[auth_user.email]',
            'first_name' => 'required|min_length[2]|max_length[100]',
            'last_name'  => 'required|min_length[2]|max_length[100]',
            'password'   => 'required|min_length[6]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [
            'email'      => $this->request->getVar('email'),
            'first_name' => $this->request->getVar('first_name'),
            'last_name'  => $this->request->getVar('last_name'),
            'password'   => password_hash($this->request->getVar('password'), PASSWORD_BCRYPT),
        ];

        try {
            $this->model->insert($data);
            return $this->respondCreated([
                'status'  => true,
                'message' => 'User registered successfully',
                'user_id' => $this->model->insertID()
            ]);
        } catch (Exception $e) {
            return $this->failServerError('Failed to register user.');
        }
    }

    public function login()
    {
        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $email    = $this->request->getVar('email');
        $password = $this->request->getVar('password');

        $user = $this->model->where('email', $email)->first();

        if (is_null($user) || !password_verify($password, $user['password'])) {
            return $this->failUnauthorized('Invalid email or password');
        }

        helper('jwt');
        $key = getenv('JWT_SECRET_KEY') ?: 'your_super_secret_jwt_key_here';
        
        $payload = [
            'iat'  => time(),
            'exp'  => time() + 3600, // 1 hour token
            'uid'  => $user['id'],
            'email'=> $user['email']
        ];
        
        $token = jwt_encode($payload, $key);

        return $this->respond([
            'status'  => true,
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => [
                'id'         => $user['id'],
                'email'      => $user['email'],
                'first_name' => $user['first_name'],
                'last_name'  => $user['last_name']
            ]
        ]);
    }
}
