<?php

namespace App\Controllers;

use App\Models\UserModel;
use App\Models\TeacherModel;
use CodeIgniter\RESTful\ResourceController;
use Exception;

class ApiController extends ResourceController
{
    protected $format = 'json';

    public function insertTeacherAndUser()
    {
        $rules = [
            // User rules
            'email'           => 'required|valid_email|is_unique[auth_user.email]',
            'first_name'      => 'required|min_length[2]|max_length[100]',
            'last_name'       => 'required|min_length[2]|max_length[100]',
            'password'        => 'required|min_length[6]',
            // Teacher rules
            'university_name' => 'required|min_length[2]|max_length[255]',
            'gender'          => 'required|in_list[Male,Female,Other]',
            'year_joined'     => 'required|exact_length[4]|numeric',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $db = \Config\Database::connect();
        $db->transStart();

        try {
            $userModel = new UserModel();
            $teacherModel = new TeacherModel();

            // Insert User
            $userData = [
                'email'      => $this->request->getVar('email'),
                'first_name' => $this->request->getVar('first_name'),
                'last_name'  => $this->request->getVar('last_name'),
                'password'   => password_hash($this->request->getVar('password'), PASSWORD_BCRYPT),
            ];
            
            $userModel->insert($userData);
            $userId = $userModel->insertID();

            // Insert Teacher
            $teacherData = [
                'user_id'         => $userId,
                'university_name' => $this->request->getVar('university_name'),
                'gender'          => $this->request->getVar('gender'),
                'year_joined'     => $this->request->getVar('year_joined'),
            ];

            $teacherModel->insert($teacherData);

            $db->transComplete();

            if ($db->transStatus() === false) {
                return $this->failServerError('Transaction failed. Could not save user and teacher data.');
            }

            return $this->respondCreated([
                'status'  => true,
                'message' => 'User and Teacher added successfully.',
                'user_id' => $userId
            ]);

        } catch (Exception $e) {
            $db->transRollback();
            return $this->failServerError('An error occurred: ' . $e->getMessage());
        }
    }

    public function getUsers()
    {
        $userModel = new UserModel();
        // Don't return passwords
        $userModel->select('id, email, first_name, last_name, created_at');
        $users = $userModel->findAll();

        return $this->respond([
            'status' => true,
            'data'   => $users
        ]);
    }

    public function getTeachers()
    {
        $teacherModel = new TeacherModel();
        
        // Use Query Builder to join with user table to get names
        $db      = \Config\Database::connect();
        $builder = $db->table('teachers');
        $builder->select('teachers.*, auth_user.first_name, auth_user.last_name, auth_user.email');
        $builder->join('auth_user', 'auth_user.id = teachers.user_id');
        $query   = $builder->get();
        $teachers = $query->getResultArray();

        return $this->respond([
            'status' => true,
            'data'   => $teachers
        ]);
    }
}
