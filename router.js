const { resolveInclude } = require("ejs");
const express = require("express");
const mysql = require("mysql2");
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

// Get All users
router.get('/', (req, res) => {
    const sqlSelect = "SELECT * FROM user";
    connection.query(sqlSelect, (err, result) => {
        
        if (err) {
            res.send("ERROR", err.message);
        } else {
            res.render("user", {user: result});
        }
    });
});

// Add Data

router.get('/add', (req, res) => {
    res.render("addForm");
});

// Add New User
router.post('/add', (req, res) => {
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
router.get('/edit/:id' , (req, res) => {
      const id = parseInt(req.params.id);
      const select= `SELECT * FROM user WHERE id = ?`;
      connection.query(select, id, (err, user) => {
        if (!err) {
            res.render("updateForm", {user: user[0]});    
          }  else {
            res.status(404).json("User not found",)
          }
      });
    
    
});

router.post('/edit/:id', (req, res) => {

    const id = parseInt(req.params.id);
    const {name, password} = req.body;
    const UpdateSql = `UPDATE user SET name = ? , password = ? WHERE id = ${id}`;
    
    connection.query(UpdateSql, [name, password], (err) => {
        if (err) {
            req.status(500).send("Data not updated", err);
        } else {
            res.redirect('/'); // After operation done navigate to home page to view changes
        }
    });
});

router.get('/delete/:id', (req, res) => {
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
