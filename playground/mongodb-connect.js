//const MongoClient = require('mongodb').MongoClient;

//ES6 destructuring
const {MongoClient, ObjectID} = require('mongodb');
// var user = {name:'Ajith',age:10};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log('Unable to connect mongodb server');
  }
  console.log('Connected to mongodb server');
  // db.collection('Todos').insertOne({
  //   text: 'My First Note',
  //   completed: false
  // },(err,result)=>{
  //   if(err){
  //     return console.log('Unable to insert todo',err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops,undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Ajith',
  //   age: 10,
  //   location: 'Fountain Valley'
  // }, (err, result)=>{
  //   if(err){
  //     return console.log('Unable to insert User', err);
  //   }
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  // })

  db.close();
});
