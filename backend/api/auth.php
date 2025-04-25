<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON data');
        }
        
        if (!isset($data['action'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing action parameter']);
            exit;
        }

        $database = new Database();
        $db = $database->getConnection();

        switch ($data['action']) {
            case 'login':
                if (!isset($data['email']) || !isset($data['password'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Missing email or password']);
                    exit;
                }

                $query = "SELECT id, username, password FROM users WHERE email = :email";
                $stmt = $db->prepare($query);
                $stmt->bindParam(":email", $data['email']);
                $stmt->execute();

                if ($stmt->rowCount() > 0) {
                    $row = $stmt->fetch(PDO::FETCH_ASSOC);
                    if (password_verify($data['password'], $row['password'])) {
                        echo json_encode([
                            'success' => true,
                            'user' => [
                                'id' => $row['id'],
                                'username' => $row['username']
                            ]
                        ]);
                    } else {
                        http_response_code(401);
                        echo json_encode(['error' => 'Invalid password']);
                    }
                } else {
                    http_response_code(401);
                    echo json_encode(['error' => 'User not found']);
                }
                break;

            case 'register':
                if (!isset($data['username']) || !isset($data['email']) || !isset($data['password'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Missing required fields']);
                    exit;
                }

                $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
                
                $query = "INSERT INTO users (username, email, password) VALUES (:username, :email, :password)";
                $stmt = $db->prepare($query);
                
                $stmt->bindParam(":username", $data['username']);
                $stmt->bindParam(":email", $data['email']);
                $stmt->bindParam(":password", $hashed_password);

                if ($stmt->execute()) {
                    echo json_encode(['success' => true, 'message' => 'User registered successfully']);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Registration failed']);
                }
                break;

            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid action']);
                break;
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?> 