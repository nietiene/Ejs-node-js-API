const { resolveInclude } = require("ejs");
const express = require("express");
const mysql = require("mysql2");
const { session } = require("passport");
require("dotenv").config();
const router = express.Router();

const connection = mysql.createConnection({
    host: process.env.HOST_NAME,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
});
connection.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log("Connected Successfully");
    }
});

 function isAuthorized (req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
 }

 // IsAdmin logged in 
 function isAdmin(req, res, next) {
    if (req.session.user && req.session.role === 'admin') {
        return next();
    }
    res.status(403).send("Access denied (admin only)");
 }
// login
router.get('/login', (req, res) => {
    res.render("login");
});

// handle login login
router.post('/login', (req, res) => {
    const { name, password } = req.body;
    const sqlLogin = "SELECT * FROM user WHERE name = ? AND password = ?";
    connection.query(sqlLogin, [ name, password ], (err, result) => {
        if (err) return res.status(500).send("Login error");
        if (result.length === 1) {
            const user = result[0];
            req.session.user = {
                id: user.id,
                name: user.name,
                role: user.role,
            };
            res.redirect('/');
        } else {
            res.send("Invalid credentials");
        }
    });

});

// logout 
router.get('/logout', (req, res) => {
    res.session.destroy();
    res.redirect('/login');
})
// Get All users
router.get('/', isAuthorized, (req, res) => {
    const sqlSelect = "SELECT * FROM user";
    connection.query(sqlSelect, (err, result) => {
        
        if (err) {
            res.send("ERROR", err.message);
        } else {
            res.render("user", {user: result, sessionUser: req.session.user });
        }
    });
});

// Add Data

router.get('/add', isAuthorized, (req, res) => {
    res.render("addForm");
});

// Add New User
router.post('/add', isAuthorized ,(req, res) => {
    const {name, password, role} = req.body;
    const sqlInsert = `INSERT INTO user(name, password, role) VALUES(?, ?, ?)`;
    connection.query(sqlInsert, [name, password, role], (err) => {
       
        if (!err) {
            res.redirect("/");
        } else {
            res.status(500).send("data not inserted");
        }
    });
});

// Update user 
router.get('/edit/:id' , isAuthorized, (req, res) => {
      const id = parseInt(req.params.id);
      const user = req.session.user;
      const select= `SELECT * FROM user WHERE id = ?`;
      connection.query(select, id, (err, result) => {
      if (err || result.length === 0) return res.status(404).send("user not found");

      if (user.role !== 'admin' && user.id != id) {
        return res.status(403).send("Access denied");
      }
      res.render("updateForm", {user: result[0] })
      });
    
});

router.post('/edit/:id', isAuthorized,(req, res) => {

    const id = parseInt(req.params.id);
    const {name, password} = req.body;
    const user = req.session.user;
    if (user.role !== 'admin' && user.id !== id) {
        return res.status(403).send("Access denied");
    }
    const UpdateSql = `UPDATE user SET name = ? , password = ? WHERE id = ${id}`;
    connection.query(UpdateSql, [name, password], (err) => {
        if (err) {
            req.status(500).send("Data not updated", err);
        } else {
            res.redirect('/'); // After operation done navigate to home page to view changes
        }
    });
});

router.get('/delete/:id', isAuthorized,(req, res) => {
    const id = parseInt(req.params.id);
    const deleteSql = `DELETE FROM user WHERE id = ?`;
    connection.query(deleteSql, id, (err) => {
       
        if (err) {
            res.status(500).send("User Not Deleted");
        } else {
            res.status(200).redirect('/');
        }
    })
})

module.exports = router;
