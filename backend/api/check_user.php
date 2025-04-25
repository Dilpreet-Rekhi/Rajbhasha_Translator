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
        
        if (!isset($data['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email is required']);
            exit;
        }

        $database = new Database();
        $db = $database->getConnection();

        // Check if user exists
        $query = "SELECT id, username, email FROM users WHERE email = :email";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":email", $data['email']);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // If delete parameter is set, delete the user
            if (isset($data['delete']) && $data['delete'] === true) {
                $deleteQuery = "DELETE FROM users WHERE email = :email";
                $deleteStmt = $db->prepare($deleteQuery);
                $deleteStmt->bindParam(":email", $data['email']);
                
                if ($deleteStmt->execute()) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'User deleted successfully',
                        'deleted_user' => $user
                    ]);
                } else {
                    throw new Exception('Failed to delete user');
                }
            } else {
                echo json_encode([
                    'success' => true,
                    'exists' => true,
                    'user' => $user
                ]);
            }
        } else {
            echo json_encode([
                'success' => true,
                'exists' => false,
                'message' => 'User not found'
            ]);
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