<?php
include "db.php";

$cat = $_GET['category'];

$res = $conn->query("
SELECT title, author FROM books
JOIN categories ON categories.id = books.category_id
WHERE categories.name='$cat'
");

$data = [];
while ($r = $res->fetch_assoc()) $data[] = $r;

header("Content-Type: application/json");
echo json_encode($data);
