<?php
session_start();
include 'db.php'; // Include database connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $role = $_POST['role'];
    $userId = $_POST['userId'];
    $password = $_POST['password'];

    // Determine the table based on the role
    if ($role == "student") {
        $table = "students";
    } elseif ($role == "faculty") {
        $table = "faculty";
    } elseif ($role == "admin") {
        $table = "admin";
    } else {
        die("Invalid role selected.");
    }

    // Check login credentials
    $sql = "SELECT * FROM $table WHERE id = ? AND password = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $userId, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $_SESSION['userId'] = $userId;
        $_SESSION['role'] = $role;
        if ($role === "admin") {
            header("Location: admin.php");
        } elseif ($role === "faculty") {
            header("Location: faculty.php");
        } else {
            header("Location: student.php");
        }
                exit();
    } else {
        echo "<script>alert('Invalid credentials!'); window.location.href='login.php';</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .login-container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            width: 300px;
            text-align: center;
        }
        .login-container h2 {
            margin-bottom: 20px;
        }
        .input-group {
            margin-bottom: 15px;
            text-align: left;
        }
        .input-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .input-group input, .input-group select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .login-btn {
            width: 100%;
            padding: 10px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .login-btn:hover {
            background: #218838;
        }
    </style>
</head>
<body>

    <div class="login-container">
        <h2>Login</h2>
        <form method="POST" action="">
            <div class="input-group">
                <label for="role">Login As</label>
                <select id="role" name="role" required>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div class="input-group">
                <label for="userId">User ID</label>
                <input type="text" id="userId" name="userId" required>
            </div>
            <div class="input-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="login-btn">Login</button>
        </form>
    </div>

</body>
</html>
