<?php
$servername = "sql102.infinityfree.com";
$username = "if0_38671668";
$password = "WSatvJv2MIkv";
$dbname = "if0_38671668_xzorbit";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    echo "✅ Database connected successfully!";
}
?>
