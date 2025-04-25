<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$response = [
    'status' => 'success',
    'message' => 'API is working correctly',
    'request' => [
        'method' => $_SERVER['REQUEST_METHOD'],
        'uri' => $_SERVER['REQUEST_URI'],
        'query' => $_GET,
        'body' => file_get_contents('php://input')
    ],
    'server' => [
        'document_root' => $_SERVER['DOCUMENT_ROOT'],
        'script_filename' => $_SERVER['SCRIPT_FILENAME']
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT);
?> 