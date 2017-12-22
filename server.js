require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT || 3000;

// app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

app.post('/user-info', (req, res) => { 
    let user = new User({
        title: req.body.title,
        name: req.body.name,
        maritalStatus: req.body.maritalStatus
    })
   
    user.save().then((doc) => {
        res.set()
        res.send(doc);
        //if there is an error 
    }, (error) => {
        res.status(400).send(error.message);
    });
});

//HTTP GET request asking for all the todos
app.get('/users', (req, res) => {
    User.find().then((users) => {
        console.log(users);
        res.send(users);
    }, (error) => {
        res.status(400).send(error);
    })
});

//HTTP GET request asking for a particular todo
app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    //check for valid id - ObjectId.isValid() is a mongoose provided method
    if(!ObjectId.isValid(id)) {
        return res.status(400).send('ID is not valid');
    }

    Todo.findById(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((error) => {
        res.status(400).send();
    })
});

//deleting a todo
app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if(!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((error) => {
        res.status(400).send();
    })
});

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectId.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Data().getTime();
    }else {
        body.completed = false;
        body.completedAt = null;
    }


    Todo.findOneAndupdate(id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
            res.status(404).send();
        }
        res.send({todo})
    }).catch((error) => {
        res.status(400).send(error);
    })
});

app.listen(port, () => {
    console.log(`Starting on port ${port}`);
});

module.exports = {app};