const express = require('express');
const exphbs = require('express-handlebars');

const app = express();


var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// connect to Your MongoDB Atlas Database
mongoose.connect("mongodb+srv://database:Password123@web322.3nonkvg.mongodb.net/web322?retryWrites=true&w=majority");


var todoSchema = new Schema({
  "id":  Number,
  "todo": String,
  "completed": Boolean
});


// register the Company model using the companySchema
// use the web322_companies collection in the db to store documents
var Todo = mongoose.model("web322_todos", todoSchema);



app.engine('.hbs', exphbs.engine({ extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static('public'));



// Routes
app.get('/', async (req, res) => {
  Todo.find()
  .exec()
  .then((todos) => {
    // todos = todos.map(value => value.toObject());
    todos = todos.map(value => {
      return {
        id : value._id,
        task: value.todo,
        completed : value.completed
      }
    });
    console.log(todos);
    res.render('index', { todos, layout:false });
  });

  
});


app.post('/add', async (req, res) => {
  const task = req.body.task;

  if (task) {
    try {
      var todo = new Todo({
        todo: task,
        completed: false
      });

      await todo.save();
    } catch (err) {
      console.error(err);
    }
  }

  res.redirect('/');
});

app.post('/complete/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);
  if (id) {
    Todo.updateOne(
      {_id: id},
      { $set: { completed: true } }
    ).exec();
  }

  res.redirect('/');
});


app.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
  
    if (id) {
      Todo.findOne({_id : id})
      .exec()
      .then((value) => {
        const todo = {
          id: value._id,
          task: value.todo,
          completed: value.completed
        };

        res.render('edit', { todo, layout:false });
      });
  
      
    } else {
      res.redirect('/');
    }
  });
  
  app.post('/update/:id', async (req, res) => {
    const id = req.params.id;
    const task = req.body.task;
    
    if (id && task) {
      Todo.updateOne(
        {_id: id},
        { $set: { todo: task } }
      ).exec();
    }
  
    res.redirect('/');
  });

  // Add this route after the existing routes
app.post('/delete/:id', async (req, res) => {
    const id = req.params.id;
  
    if (id) {
      try {
        await Todo.deleteOne({ _id: id });
      } catch (err) {
        console.error(err);
      }
    }
  
  res.redirect('/');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});