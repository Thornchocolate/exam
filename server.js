const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secretkey', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public'))); // public katalogas

// MySQL jungtis
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'library'
});

db.connect(err => {
    if(err) throw err;
    console.log('MySQL connected');
});
function isAuth(req,res,next){
    if(req.session.user) next();
    else res.redirect('/login.html');
}

// Registracija
app.post('/register', async (req,res)=>{
    const {username,password} = req.body;
    const hash = await bcrypt.hash(password,10);
    db.query('INSERT INTO users (username,password,role) VALUES (?,?,?)',[username,hash,'user'], (err,result)=>{
        if(err) return res.status(400).send(err);
        res.send('Registered');
    });
});

// Prisijungimas
app.post('/login', (req,res)=>{
    const {username,password} = req.body;
    db.query('SELECT * FROM users WHERE username=?',[username], async (err,results)=>{
        if(err) return res.status(400).send(err);
        if(results.length === 0) return res.status(400).send('User not found');
        const match = await bcrypt.compare(password, results[0].password);
        if(match){
            req.session.user = {id: results[0].id, role: results[0].role};
            res.redirect('/admin.html');  // nukreipia į public/admin.html
        } else res.status(400).send('Wrong password');
    });
});

// Admin panelis (tik prisijungus)
app.get('/admin', isAuth, (req,res)=>{
    res.sendFile(path.join(__dirname,'public','admin.html'));
});

// Nauja knyga (admin)
app.post('/books', isAuth,(req,res)=>{
    if(req.session.user.role !== 'admin') return res.status(403).send('No access');
    const {title,author,category_id} = req.body;
    db.query('INSERT INTO books (title,author,category_id) VALUES (?,?,?)',
        [title,author,category_id], 
        (err,result)=>{
            if(err) return res.status(400).send(err);
            res.redirect('/admin.html');
    });
});

// Vieša knygų paieška
app.get('/books', (req,res)=>{
    const {category,search} = req.query;
    let sql = 'SELECT books.id,title,author,name as category FROM books LEFT JOIN categories ON books.category_id = categories.id WHERE 1';
    const params = [];
    if(category){ sql += ' AND categories.id=?'; params.push(category); }
    if(search){ sql += ' AND title LIKE ?'; params.push(`%${search}%`); }
    db.query(sql, params, (err,results)=>{ 
        if(err) return res.status(400).send(err); 
        res.json(results); 
    });
});

app.listen(3000,()=>console.log('Server running on http://localhost:3000'));
