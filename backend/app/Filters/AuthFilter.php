<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $header = $request->getServer('HTTP_AUTHORIZATION');
        
        if (!$header) {
            return Services::response()
                ->setJSON(['status' => false, 'message' => 'Token Required'])
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
        }

        // Check if token conforms to standard format "Bearer <token>"
        $token = null;
        if (preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            $token = $matches[1];
        } else {
            return Services::response()
                ->setJSON(['status' => false, 'message' => 'Invalid Token Format'])
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
        }

        helper('jwt');
        $secretKey = getenv('JWT_SECRET_KEY') ?: 'your_super_secret_jwt_key_here';
        
        $decoded = jwt_decode($token, $secretKey);
        
        if (!$decoded) {
            return Services::response()
                ->setJSON(['status' => false, 'message' => 'Invalid or Expired Token'])
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED);
        }
        
        // Pass the user id forward as an attribute (CI4 trick: set it via service or context)
        // Though passing data from before() filter in CI4 directly into controller is tricky, 
        // usually we just validate and decode safely in filter.
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Do nothing
    }
}
