const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos',()=>{
  it('should create a new todo',(done)=>{
    var text = 'Test todo app';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err, res)=>{
        if(err){
          return done(err);
        }
        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

it('should not create todo with invalid body data',(done)=>{
  request(app)
  .post('/todos')
  .send({})
  .expect(400)
  .end((err,res)=>{
    if(err){
      return done(err);
    }
    Todo.find().then((todos)=>{
      expect(todos.length).toBe(2);
      done();
    }).catch((e) => done(e));
  });
});

});

describe('GET /todos', ()=>{
  it('should get all todos',(done)=>{
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /todos/:id', ()=>{
  it('should get TODO by ID', (done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should return 404 if todo not found', (done)=>{
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids', (done)=>{
    request(app)
    .get('/todos/123')
    .expect(404)
    .end(done);
  });
});

describe('DELETE /todos/:id', ()=>{
  it('should delete todo by ID', (done)=>{
    var hexID = todos[0]._id.toHexString();
    request(app)
    .delete(`/todos/${hexID}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo._id).toBe(hexID);
    })
    .end((err, res)=>{
      if(err){
        return done(err);
      }
      Todo.findById(hexID).then((doc)=>{
        expect(doc).toNotExist();
        done();
      }).catch((e)=>done(e));


    });
  });

  it('should return 404 if todo not found', (done)=>{
    request(app)
    .delete(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 if objectID is invalid', (done)=>{
    request(app)
    .delete('/todos/123')
    .expect(404)
    .end(done);
  });

});

describe('PATCH /todos/:id', ()=>{
  it('should update the todo', (done)=>{
    var hexID = todos[0]._id.toHexString();
    var text = "Updated Text from Test 1";
    request(app)
    .patch(`/todos/${hexID}`)
    .send({
      completed: true
      ,text:text
    })
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);
      expect(res.body.completed).toBe(true);
      expect(res.body.completedAt).toBeA('number');
    })
    .end(done);
  });

it('should clear completedAt when todo is not completed', (done)=>{
  var hexID = todos[1]._id.toHexString();
  var text = "Updated Text from Test 2";

  request(app)
  .patch(`/todos/${hexID}`)
  .send({
    completed: false,
    text
  })
  .expect(200)
  .expect((res)=>{
    expect(res.body.text).toBe(text);
    expect(res.body.completed).toBe(false);
    expect(res.body.completedAt).toNotExist();
  })
  .end(done);
});

});

describe('GET /users/me', ()=>{
  it('should return a user if authenticated', (done)=>{
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not authenticated', (done)=>{
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', ()=>{
  it('should create a user', (done)=>{
    var email = 'testaj@123.com';
    var password = 'test232';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    }).end((err)=>{
      if(err){
        return done(err);
      }
      User.findOne({email}).then((user)=>{
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      });
    });

  });

  it('should return validation errors if request invalid', (done)=>{
    var email = 'invalidemail';
    var password='12';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .expect((res)=>{
      expect(res.headers['x-auth']).toNotExist();
    }).end(done);
  });

  it('should not create user if email in use', (done)=>{
    var email = users[0].email;
    var password = 'test234';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .expect((res)=>{
      expect(res.headers['x-auth']).toNotExist();
    }).end(done);

  });
})
