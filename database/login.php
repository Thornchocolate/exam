<?php
include "db.php";
session_start();

if ($_POST) {
    $email = $_POST['email'];
    $pass = $_POST['password'];

    $res = $conn->query("SELECT * FROM users WHERE email='$email'");
    $user = $res->fetch_assoc();

    if ($user && password_verify($pass, $user['password'])) {
        $_SESSION['admin'] = true;
        header("Location: admin.php");
    } else {
        echo "Wrong login";
    }
}
?>

<form method="post">
    <input name="email">
    <input type="password" name="password">
    <button>Login</button>
</form>
