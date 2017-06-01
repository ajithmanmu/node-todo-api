const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneID = new ObjectID();
const usertwoID = new ObjectID();
const users = [{
  _id: userOneID,
  email: 'ajith@testing.com',
  password:'test123',
  tokens:[{
    access:'auth',
    token: jwt.sign({_id:userOneID,access:'auth'},'secret').toString()
  }]
},
  {
  _id:usertwoID,
  email:'ajith2@testing.com',
  password:'test456',
  tokens:[{
    access:'auth',
    token: jwt.sign({_id:usertwoID,access:'auth'},'secret').toString()
  }]
  }
]

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo',
  _creator: userOneID
},{
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 3333,
  _creator:usertwoID
}
]

//Wipes out the Mongo collection before the test is run and adds the dummy data above
const populateTodos = (done) =>{
  Todo.remove({}).then(()=> {
    return Todo.insertMany(todos);
  }).then(()=>done());
}

const populateUsers = (done) =>{
  User.remove({}).then(()=>{
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne,userTwo]);
  }).then(()=>done());
}

module.exports = {todos, populateTodos, users, populateUsers};
