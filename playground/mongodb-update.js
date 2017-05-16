const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log('Unable to connect mongodb server');
  }
  console.log('Connected to mongodb server');

  // db.collection('Todos').findOneAndUpdate({
  //   _id : new ObjectID('59163613f9d8432eb678705b')
  // },{
  //   $set:{
  //     completed:true
  //   }
  // },{
  //   returnOriginal: false
  // }).then((result)=>{
  //   console.log(result);
  // });

db.collection('Users').findOneAndUpdate({
  _id: new ObjectID('5916278f19fa393602928603')
},{
  $set:{
    name:'Omkaar'
  },
  $inc:{
    age:1
  }
},{
  returnOriginal: false
}).then((result)=>{
  console.log(result);
});


  //db.close();
});
