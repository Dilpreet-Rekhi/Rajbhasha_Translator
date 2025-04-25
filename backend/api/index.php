<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';
require_once '../models/User.php';
require_once '../controllers/AuthController.php';

$requestMethod = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// API endpoints
if ($uri[2] === 'api') {
    switch ($requestMethod) {
        case 'POST':
            if ($uri[3] === 'register') {
                $auth = new AuthController();
                $data = json_decode(file_get_contents("php://input"));
                echo $auth->register($data);
            } elseif ($uri[3] === 'login') {
                $auth = new AuthController();
                $data = json_decode(file_get_contents("php://input"));
                echo $auth->login($data);
            } elseif ($uri[3] === 'translate') {
                $data = json_decode(file_get_contents("php://input"));
                echo translateText($data);
            }
            break;
        default:
            header("HTTP/1.1 404 Not Found");
            exit();
    }
}

function translateText($data) {
    $text = $data->text;
    $sourceLang = $data->sourceLang;
    $targetLang = $data->targetLang;

    if (!$text || !$sourceLang || !$targetLang) {
        return json_encode([
            'success' => false,
            'error' => 'Missing input fields'
        ]);
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://localhost:5000/translate');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'q' => $text,
        'source' => $sourceLang,
        'target' => $targetLang,
        'format' => 'text'
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($response, true);
    
    if ($result && isset($result['translatedText'])) {
        return json_encode([
            'success' => true,
            'translatedText' => $result['translatedText']
        ]);
    } else {
        return json_encode([
            'success' => false,
            'error' => 'Translation failed. Please try again later.'
        ]);
    }
}
?> 