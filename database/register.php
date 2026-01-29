<?php
include "db.php";

if ($_POST) {
    $email = $_POST['email'];
    $pass = password_hash($_POST['password'], PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?,?)");
    $stmt->bind_param("ss", $email, $pass);
    $stmt->execute();

    echo "Registered";
}
?>

<form method="post">
    <input name="email" required>
    <input type="password" name="password" required>
    <button>Register</button>
</form>
