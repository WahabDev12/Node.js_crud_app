const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer')

const app = express();

//CONECTING DB// APP CONFI
mongoose.connect('mongodb://127.0.0.1:27017/mylib', {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useFindAndModify: false
  });

//APP USE
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set('view engine', 'ejs');
app.use('/static', express.static('static'))
app.use(methodOverride('_method'))


//SCHEMA
let TodoSchema = mongoose.Schema({
    title: String,
    
});

//MODEL
let Todo = mongoose.model('Todo', TodoSchema)

//MAIN PAGE ROUTES
app.get('/', (req, res) => {
    res.redirect('/todos')
})

//INDEX ROUTES

app.get('/todos', (req, res) => {
    //RETRIEVING ALL TODOS
    Todo.find({}, (error, todos) => {
      if(error){
          console.log(error);
      }else{
        res.render('index', {todos: todos})
      }
    })
    
})

//CREATE
app.post('/create_todos', (req, res) => {
    //create todo
    Todo.create(req.body.todo, (error, newTodo) => {
      if(error){
          console.log("There was an error creating todo!!!")
      }else{
           //redirect to index page
           res.redirect("/todos")
      }
    })
   
})

//SHOW ROUTE
app.get('/todos/:id', (req, res) => {
    Todo.findById(req.params.id, (error, foundTodo) => {
      if(error){
        res.redirect('/todos')
      }else{
        res.render('index', {todo:foundTodo})
      }
    })
});

//EDIT
app.get('/todos/:id/edit', (req, res) => {
  Todo.findById(req.params.id, (error, foundTodo)=>{
    if(error){
      res.redirect('/todos')
    }else {
      res.render('update', {todo:foundTodo})
    }
  })
});

//UPDATE ROUTE
app.put('/todos/:id', (req, res) => {
  Todo.findByIdAndUpdate(req.params.id, req.body.todo, (error, updatedTodo)=> {
    if(error) {
      console.log("There was an error updating")
    }else{
      res.redirect("/")
    }
  })
});

app.get('/delete/:id', function(req, res) {
  var id = req.params.id
  Todo.findByIdAndRemove({_id:id}, function (err,deletedTodo) {
    if (err) {
    
    console.log("There was an error deleting")
    } else {
      res.redirect("/todos")
    }
    
  });
});


app.listen(3000, (req, res) => {
  console.log('The server is up and running on port 3000')
});