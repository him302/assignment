<?php

namespace Config;

use CodeIgniter\Config\BaseService;
use CodeIgniter\Router\RouteCollection;

$routes = Services::routes();

// Default setup
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(false);

// CORS for React local testing (Allow Origin Options)
$routes->options('(:any)', 'Home::options'); // Handle preflight

$routes->group('api', function ($routes) {
    // Auth Routes
    $routes->post('register', 'AuthController::register');
    $routes->post('login', 'AuthController::login');
    
    // Protected Routes (requires JWT)
    $routes->group('', ['filter' => 'auth'], function($routes) {
        $routes->post('teacher/combined-insert', 'ApiController::insertTeacherAndUser');
        $routes->get('users', 'ApiController::getUsers');
        $routes->get('teachers', 'ApiController::getTeachers');
    });
});
