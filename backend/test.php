<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Display PHP information
phpinfo();

// Test basic PHP functionality
echo "<h2>Basic PHP Test</h2>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "<br>";
echo "Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "<br>";
echo "Script Filename: " . $_SERVER['SCRIPT_FILENAME'] . "<br>";

// Test file permissions
echo "<h2>File Permissions Test</h2>";
$test_file = __FILE__;
echo "Current file: " . $test_file . "<br>";
echo "Is readable: " . (is_readable($test_file) ? "Yes" : "No") . "<br>";
echo "Is writable: " . (is_writable($test_file) ? "Yes" : "No") . "<br>";

// Test database connection file
echo "<h2>Database Configuration Test</h2>";
$db_config_file = __DIR__ . '/config/database.php';
echo "Database config file: " . $db_config_file . "<br>";
echo "Config file exists: " . (file_exists($db_config_file) ? "Yes" : "No") . "<br>";
echo "Config file is readable: " . (is_readable($db_config_file) ? "Yes" : "No") . "<br>";
?> 