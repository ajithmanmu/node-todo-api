require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

//middleware - Get the body that is sent from client and convert to JSON
app.use(bodyParser.json());

app.post('/todos', authenticate, async (req, res)=>{
  try{
    const todo = new Todo({
      text: req.body.text,
      _creator:req.user._id
    });
    const doc = await todo.save();
    res.send(doc);
  } catch(e){
    res.status(400).send(e);
  }
  // todo.save().then((doc)=>{
  //   //console.log('Todo saved', doc);
  //   res.send(doc);
  // }, (e)=>{
  //   //console.log('Unable to save Todo', e);
  //   res.status(400).send(e);
  // });
});

app.get('/todos',authenticate, async (req, res)=>{
  try{
    const todos = await Todo.find({
      _creator: req.user._id
    });
    res.send({todos});
  }catch(e){
    res.status(400).send(e);
  }
  // Todo.find({
  //   _creator: req.user._id
  // }).then((todos)=>{
  //   res.send({todos});
  // },(e)=>{
  //   res.status(400).send(e);
  // });
});

app.get('/todos/:id',authenticate, async (req, res)=>{
  try{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }
    const todo = await Todo.findOne({
      _id: id,
      _creator:req.user._id
    });
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  } catch(e){
    res.status(400).send();
  }

  // Todo.findOne({
  //   _id: id,
  //   _creator:req.user._id
  // }).then((todo)=>{
  //   if(!todo){
  //     return res.status(404).send();
  //   }
  //   res.send({todo});
  // },(e)=>{
  //   res.status(400).send();
  // });

});

app.delete('/todos/:id',authenticate,async (req,res) =>{
  try{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }
    const todo = await Todo.findOneAndRemove({
      _id:id,
      _creator:req.user._id
    });
    if(!todo){
      return res.status(404).send();
    }
    res.status(200).send({todo});
  } catch(e){
    res.status(400).send();
  }


  // Todo.findOneAndRemove({
  //   _id:id,
  //   _creator:req.user._id
  // }).then((todo)=>{
  //   if(!todo){
  //     return res.status(404).send();
  //   }
  //    res.status(200).send({todo});
  // }, (e)=>{
  //   res.status(400).send();
  // });
});

app.patch('/todos/:id', authenticate, async (req, res)=>{
  try{
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
    const todo = await Todo.findOneAndUpdate({
      _id:id,
      _creator:req.user._id
    }, {$set: body}, {new: true});
    if(!todo){
      return res.status(404).send();
    }
    res.send(todo);
  }catch(e){
    res.status(400).send();
  }

// Todo.findOneAndUpdate({
//   _id:id,
//   _creator:req.user._id
// }, {$set: body}, {new: true}).then((todo)=>{
//   if(!todo){
//     return res.status(404).send();
//   }
//   res.send(todo);
//   }).catch((e)=>{
//     res.status(400).send();
//   });
});


app.post('/users', async (req, res)=>{

  try{
    const body = _.pick(req.body, ['email','password']);
    const user = new User(body);
    await user.save();
    var token  = await user.generateAuthToken();
    res.header('x-auth',token).send(user);
  } catch(e){
    res.status(400).send(e);
  }
  // user.save().then(()=>{
  //   return user.generateAuthToken();
  //   //res.status(200).send(doc);
  // }).then((token)=>{
  //   res.header('x-auth',token).send(user);
  // })
  // .catch((e)=>{
  //   res.status(400).send(e);
  // });

});

app.get('/users/me', authenticate, (req, res)=>{
  res.send(req.user);
})

app.post('/users/login', async (req, res)=>{
  const body = _.pick(req.body, ['email','password']);
  try{
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth',token).send(user);
  }catch(e){
    res.status(400).send();
  }
  //old code
  // User.findByCredentials(body.email, body.password).then((user)=>{
  //   return user.generateAuthToken().then((token)=>{
  //     res.header('x-auth',token).send(user);
  //   });
  // }).catch((e)=>{
  //   res.status(400).send();
  // });
});

app.delete('/users/me/token', authenticate, async (req, res)=>{
  try{
    await req.user.removeToken(req.token);
    res.status(200).send();
  }catch(e){
    res.status(400).send();
  }
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
