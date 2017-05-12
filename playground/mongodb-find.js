const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log('Unable to connect mongodb server');
  }
  console.log('Connected to mongodb server');

  // db.collection('Todos').find({_id: new ObjectID('59162a94f9d8432eb6787056')}).toArray().then((docs)=>{
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs,undefined,2));
  // }, (err)=>{
  //   console.log('Unable to fetch todos', err);
  // });

  // db.collection('Todos').find().count().then((count)=>{
  //   console.log('Count');
  //   //console.log(JSON.stringify(docs,undefined,2));
  //   console.log(count);
  // }, (err)=>{
  //   console.log('Unable to count todos', err);
  // });

  // db.collection('Users').find({name:'Omky'}).count().then((count)=>{
  //   console.log(`Count is ${count}`);
  // },(err)=>{
  //   console.log('Unable to count users',err);
  // })

  db.collection('Users').find({name:'Omky'}).toArray().then((docs)=>{
    console.log(JSON.stringify(docs,undefined,2));
  },(err)=>{
    console.log('Unable to fetch users',err);
  })

  //db.close();
});
