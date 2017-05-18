const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '591b7f24da5a326299130223';
if(!ObjectID.isValid(id)){
  console.log('ID is not valid');
}

// Todo.find({
//   _id: id
// }).then((todos)=>{
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo)=>{
//   console.log('Todo', todo);
// });

Todo.findById(id).then((todo)=>{
  if(!todo){
    return console.log('ID not found');
  }
  console.log('Todo By Id', todo);
}).catch((e)=>console.log(e));

User.findById(id).then((user)=>{
  if(!user){
    return console.log('User not found');
  }
  console.log('User', user);
}).catch((e)=>console.log(e));
