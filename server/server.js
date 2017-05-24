require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');

var app = express();
const port = process.env.PORT;

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

app.delete('/todos/:id',(req,res) =>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
     res.status(200).send({todo});
  }, (e)=>{
    res.status(400).send();
  });
});

app.patch('/todos/:id', (req, res)=>{
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else{
    body.completed = false;
    body.completedAt = null;
  }

Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo)=>{
  if(!todo){
    return res.status(404).send();
  }
  res.send(todo);
  }).catch((e)=>{
    res.status(400).send();
  });
});


app.post('/users', (req, res)=>{
  var body = _.pick(req.body, ['email','password']);
  var user = new User(body);
  user.save().then(()=>{
    return user.generateAuthToken();
    //res.status(200).send(doc);
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  })
  .catch((e)=>{
    res.status(400).send(e);
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
