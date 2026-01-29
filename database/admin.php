<?php
include "db.php";
session_start();
if (!isset($_SESSION['admin'])) die("No access");

if ($_POST) {
    $stmt = $conn->prepare(
        "INSERT INTO books (title, author, category_id) VALUES (?,?,?)"
    );
    $stmt->bind_param("ssi", $_POST['title'], $_POST['author'], $_POST['category']);
    $stmt->execute();
}
?>

<form method="post">
    <input name="title" required placeholder="Title">
    <input name="author" required placeholder="Author">
    <select name="category">
        <?php
        $c = $conn->query("SELECT * FROM categories");
        while ($row = $c->fetch_assoc())
            echo "<option value='{$row['id']}'>{$row['name']}</option>";
        ?>
    </select>
    <button>Add book</button>
</form>

<hr>

<?php
$books = $conn->query("
SELECT books.id, title, author, categories.name
FROM books
JOIN categories ON categories.id = books.category_id
");

while ($b = $books->fetch_assoc()) {
    echo "{$b['title']} - {$b['author']} ({$b['name']})
    <a href='delete.php?id={$b['id']}'>DELETE</a><br>";
}
?>
