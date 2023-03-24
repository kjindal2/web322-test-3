const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const app = express();
const exphbs = require('express-handlebars');

const Sequelize = require('sequelize');



var sequelize = new Sequelize('database', 'user', 'password', {
    host: 'host',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Project = sequelize.define('Student111', {
    name: Sequelize.STRING,
    email: Sequelize.TEXT
});





// Load styles from public folder
app.use(express.static("./public/"));

// Define a custom Handlebars helper function to format dates
const hbs = exphbs.create({
    helpers: {
        formatDate: function (date) {
            return date.toLocaleDateString();
        }
    },
    extname: ".hbs"
});

// Register handlebars as the rendering engine for views
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");


// Use body-parser middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve the HTML form
app.get('/update-user', (req, res) => {

    const id = req.query.id;
    pool.query(`SELECT * FROM users WHERE id = ${id}`, (error, results) => {
        // Handle any errors that occur
        if (error) {
            console.error(error);
            res.status(500).send('Internal server error');
            return;
        }
        // Render the 'index' template with the list of users as a context object
        res.render('edit', { users: results.rows[0], layout: false });
    });

});

// Update user data in database
app.post('/update-user', (req, res) => {
    /*---------------------------------------
    [TODO] Please complete the implementation
    to be able to update users in PostgreSQL.
    Receving three parameters id, name and email

    Using the query:
    "UPDATE users SET name = $1, email = $2 WHERE id = $3"

    If Failed: Return status code 500 and JSON message:
    {message: "Error Updating data into PostgreSQL"}

    If succeed:
    Redirect to root of the website.
    ----------------------------------------*/

    const name = req.body.name;
    const id = req.body.id;
    const email = req.body.email;
    // Update data into PostgreSQL
    pool.query(
        'UPDATE users SET name = $1, email = $2 WHERE id = $3',
        [name, email, id],
        (error, results) => {
            if (error) {
                console.log(error); res.status(500).json({ message: 'Error update data into PostgreSQL' });
            } else {
                res.redirect("/");
            }
        });

});

// Delete user data in database
app.get('/delete-user', (req, res) => {
    /*---------------------------------------
    [TODO] Please complete the implementation
    to be able to delete users in PostgreSQL.
    Receving on paramter id

    Using the query:
    "DELETE FROM users WHERE id = $1"

    If Failed: Return status code 500 and JSON message:
    {message: "Error Delete data from PostgreSQL"}

    If succeed:
    Redirect to root of the website.
    ----------------------------------------*/


    const id = req.query.id;

    // Update data into PostgreSQL
    pool.query(
        'DELETE FROM users WHERE id = $1',
        [id],
        (error, results) => {
            if (error) {
                console.log(error); res.status(500).json({ message: 'Error Delete data from PostgreSQL' });
            } else {
                res.redirect("/");
            }
        });


});

// Handle form submission
app.post('/insert-user', (req, res) => {
    const { name, email } = req.body;
    // Insert data into PostgreSQL
    pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2)',
        [name, email],
        (error, results) => {
            if (error) {
                console.log(error); res.status(500).json({ message: 'Error inserting data into PostgreSQL' });
            } else {
                res.redirect("/");
            }
        });
});


app.get('/', (req, res) => {
    // fetch all of the names and order them by id
    Project.findAll({
        order: ["id"]
    }).then((data) => {
        // render the "viewTable" view with the data
        res.render("index", {
            data: data,
            layout: false // do not use the default Layout (main.hbs)
        });
    });
});


sequelize.sync().then(() => {
    // start the server to listen on HTTP_PORT
    app.listen(HTTP_PORT, onHttpStart);
});

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }
