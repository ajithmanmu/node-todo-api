const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log('Unable to connect mongodb server');
  }
  console.log('Connected to mongodb server');

  //deleteMany
  db.collection('Todos').deleteMany({text:'Clean House'}).then((result)=>{
    console.log(result);
  },(err)=>{
    console.log('Unable to delete todos', err);
  })

  //deleteOne
  db.collection('Todos').deleteOne({text:'Clean House'}).then((result)=>{
    console.log(result);
  },(err)=>{
    console.log('Unable to delete todos', err);
  })

  //findOneAndDelete
  db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
    console.log(result);
  })

  //db.close();
});
