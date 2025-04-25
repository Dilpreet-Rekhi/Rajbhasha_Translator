<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config/database.php';

try {
    // First, try to connect without specifying the database
    $pdo = new PDO("mysql:host=localhost", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Select the database
    $pdo->exec("USE rajbhasa_translator");
    
    // Check if users table exists
    $result = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($result->rowCount() == 0) {
        // Create users table
        $pdo->exec("CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        echo "Table 'users' created successfully.<br>";
    } else {
        echo "Table 'users' already exists.<br>";
    }
    
    // Now test the connection using the Database class
    $database = new Database();
    $db = $database->getConnection();
    
    if($db) {
        echo "<br>Database connection successful!<br>";
        echo "Connection details:<br>";
        echo "- Host: localhost<br>";
        echo "- Database: rajbhasa_translator<br>";
        echo "- Username: root<br>";
        
        // Test a simple query
        $stmt = $db->query("SELECT COUNT(*) as count FROM users");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "- Number of users in database: " . $result['count'] . "<br>";
    } else {
        echo "Database connection failed!";
    }
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "<br>";
    echo "Error code: " . $e->getCode() . "<br>";
    echo "File: " . $e->getFile() . "<br>";
    echo "Line: " . $e->getLine() . "<br>";
}
?> 