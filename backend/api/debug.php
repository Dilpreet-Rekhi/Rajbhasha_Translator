<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$debug_info = [
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'Not set',
    'request_uri' => $_SERVER['REQUEST_URI'],
    'query_string' => $_SERVER['QUERY_STRING'],
    'raw_input' => file_get_contents('php://input'),
    'headers' => getallheaders(),
    'post_data' => $_POST,
    'get_data' => $_GET,
    'json_data' => json_decode(file_get_contents('php://input'), true)
];

echo json_encode($debug_info, JSON_PRETTY_PRINT);
?> 