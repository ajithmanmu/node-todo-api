var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://127.0.0.1:27017/TodoApp');
//mongoose.connect('mongodb://ajithmanmu:todoapp_ajithmanmu@ds149221.mlab.com:49221/todoapp_ajithmanmu');
mongoose.connect(process.env.MONGODB_URI);
module.exports = {mongoose};
