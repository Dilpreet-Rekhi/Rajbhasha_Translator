<?php
require_once '../config/database.php';
require_once '../models/User.php';

class AuthController {
    private $db;
    private $user;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
    }

    public function register($data) {
        if (!isset($data->username) || !isset($data->email) || !isset($data->password)) {
            return json_encode([
                'success' => false,
                'message' => 'Missing required fields'
            ]);
        }

        $this->user->username = $data->username;
        $this->user->email = $data->email;
        $this->user->password = $data->password;

        if ($this->user->emailExists()) {
            return json_encode([
                'success' => false,
                'message' => 'Email already exists'
            ]);
        }

        if ($this->user->create()) {
            return json_encode([
                'success' => true,
                'message' => 'User registered successfully'
            ]);
        }

        return json_encode([
            'success' => false,
            'message' => 'Registration failed'
        ]);
    }

    public function login($data) {
        if (!isset($data->email) || !isset($data->password)) {
            return json_encode([
                'success' => false,
                'message' => 'Missing email or password'
            ]);
        }

        $this->user->email = $data->email;

        if ($this->user->emailExists() && password_verify($data->password, $this->user->password)) {
            $token = $this->generateJWT();
            return json_encode([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'id' => $this->user->id,
                    'username' => $this->user->username,
                    'email' => $this->user->email
                ]
            ]);
        }

        return json_encode([
            'success' => false,
            'message' => 'Invalid email or password'
        ]);
    }

    private function generateJWT() {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'user_id' => $this->user->id,
            'username' => $this->user->username,
            'exp' => time() + (60 * 60 * 24) // 24 hours
        ]);

        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, 'your-secret-key', true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }
}
?> 