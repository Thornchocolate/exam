<?php
include "db.php";
$conn->query("DELETE FROM books WHERE id=".(int)$_GET['id']);
header("Location: admin.php");
