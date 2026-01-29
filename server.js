const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'secretkey', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));

// DB
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'library'
});
db.connect(err=>{ if(err) throw err; console.log('DB connected'); });

// Auth middleware
function isAuth(req,res,next){
    if(req.session.user) next();
    else res.redirect('/login.html');
}

// LOGIN
app.post('/login', async (req,res)=>{
    const {username,password} = req.body;
    const [users] = await db.promise().query('SELECT * FROM users WHERE username=?',[username]);
    if(users.length===0) return res.send('User not found');
    const match = await bcrypt.compare(password,users[0].password);
    if(!match) return res.send('Wrong password');
    req.session.user = {id: users[0].id, role: users[0].role};
    res.redirect('/admin.html');
});

// LOGOUT
app.post('/logout',(req,res)=>{
    req.session.destroy(()=>res.redirect('/login.html'));
});

// CATEGORIES
app.get('/categories',(req,res)=>{
    db.query('SELECT * FROM categories',(err,rows)=>{ if(err) return res.status(400).send(err); res.json(rows); });
});

app.post('/categories', isAuth, (req,res)=>{
    if(req.session.user.role!=='admin') return res.sendStatus(403);
    const {name} = req.body;
    db.query('INSERT INTO categories (name) VALUES (?)',[name],(err,result)=>{
        if(err) return res.status(400).send(err.message);
        res.send('Category added');
    });
});

// BOOKS
app.get('/books',(req,res)=>{
    db.query(`SELECT books.id, books.title, books.author, categories.name AS category
              FROM books LEFT JOIN categories ON books.category_id = categories.id`,
              (err,rows)=>{ if(err) return res.status(400).send(err); res.json(rows); });
});

app.post('/books', isAuth, (req,res)=>{
    if(req.session.user.role!=='admin') return res.sendStatus(403);
    const {title,author,category_id} = req.body;
    db.query('INSERT INTO books (title,author,category_id) VALUES (?,?,?)',
        [title,author,category_id||null],(err,result)=>{
            if(err) return res.status(400).send(err.message);
            res.send('Book added');
        });
});

// RESERVE
app.post('/reserve', isAuth, (req,res)=>{
    const {book_id} = req.body;
    if(!book_id) return res.status(400).send('Book ID required');
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate()+14);
    db.query('CREATE TABLE IF NOT EXISTS reservations (id INT AUTO_INCREMENT PRIMARY KEY,user_id INT,book_id INT,start_date DATE,end_date DATE,extensions INT DEFAULT 0)',()=>{});
    db.query('INSERT INTO reservations (user_id,book_id,start_date,end_date) VALUES (?,?,?,?)',
        [req.session.user.id, book_id, start, end],(err,result)=>{
            if(err) return res.status(400).send(err.message);
            res.send('Book reserved');
        });
});

app.listen(3000, ()=>console.log('Server running on http://localhost:3000'));
