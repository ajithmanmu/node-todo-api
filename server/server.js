var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

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

app.listen(3000, ()=>{
  console.log('Started on port 3000');
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
