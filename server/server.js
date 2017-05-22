var express = require('express');
var bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');

var app = express();
const port = process.env.PORT || 3000;

//middleware - Get the body that is sent from client and convert to JSON
app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc)=>{
    //console.log('Todo saved', doc);
    res.send(doc);
  }, (e)=>{
    //console.log('Unable to save Todo', e);
    res.status(400).send(e);
  });
});

app.get('/todos',(req, res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  },(e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos/:id',(req, res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findById(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  },(e)=>{
    res.status(400).send();
  });

});

app.listen(port, ()=>{
  console.log(`Started on port ${port}`);
});

module.exports = {app};

// var newTodo = new Todo({
//   text: 'Testing Note'
// });
// var newTodo = new Todo({
//   text: 'Cook Breakfast',
//   completed: false,
//   completedAt: 12345
// });

// newTodo.save().then((doc)=>{
//   console.log('Saved todo',doc);
// }, (e)=>{
//   console.log('Unable to save doc',e);
// });
// var newUser = new User({
// email: 'ajithmanmu@gmail.com'
// });
//
// newUser.save().then((doc)=>{
//   console.log('User saved', doc);
// },(e)=>{
//   console.log('Unable to save User',e);
// })
