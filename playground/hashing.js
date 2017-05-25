const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'testAj';
bcrypt.genSalt(10, (err, salt)=>{
  console.log('salt',salt);
  bcrypt.hash(password, salt, (err, hash)=>{
    console.log(hash);
  });
})

var hashedPassword = '$2a$10$w.GgzBr5wzyFXdgh7ppxcu9aQ0te.EPUIwSPNnil9lvF4O9rWjM.O';
bcrypt.compare(password,hashedPassword, (err, res)=>{
  console.log(res);
});
// var data = {
//   id: 10
// };
// var token = jwt.sign(data,'mysecret');
// console.log(token);
// var decoded = jwt.verify(token,'mysecret');
// console.log(decoded);


//Concepts - Begin
// var message = 'This a test message';
// var hash = SHA256(message).toString();
// console.log(message);
// console.log(hash);
//
// var data = {
//   id: 4
// };
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesalt').toString()
// }
//JWT - Jason Web token
//Middle man manipulation
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesalt').toString();
// if(resultHash === token.hash){
//   console.log('Data was not changed');
// }else{
//   console.log('Data was changed');
// }
//Concepts - End
