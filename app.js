const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const app = express();
const Msg = require('./models/msg');
const Contact = require('./models/contact');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const url1 = 'mongodb://127.0.0.1/users';


//connecting to server
app.listen(3000, () => {
    console.log("listening to port 3000");
});

//connecting to database
mongoose.connect(url1)
    .then(result => {
        console.log('connected to users database...');
    })
    .catch(err => {
        console.log(err);
    })


//middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/signup', signupRouter);
app.use('/login', loginRouter);


app.set('view engine', 'ejs');


//routes
app.get('/', (req, res) => {
    res.redirect('/signup');
})

app.get('/:my_id', (req, res) => {
    mongoose.disconnect();
    mongoose.connect(url1)
        .then(result => {
            console.log('connected to Users database');
            User.find({ userid: req.params.my_id })
                .then(result => {
                    if (result.length == 0) {
                        res.status(404).render('404');
                    }
                    else {
                        mongoose.disconnect();
                        mongoose.connect('mongodb://127.0.0.1/' + req.params.my_id)
                            .then(result => {
                                Contact.find()
                                    .then(result => {
                                        res.render('index', { all_contacts: result, myid: req.params.my_id});
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })

})

app.get('/:my_id/:contact_id', (req, res) => {
    mongoose.disconnect();
    mongoose.connect('mongodb://127.0.0.1/' + req.params.my_id)
        .then(result => {
            Contact.find()
                .then(result => {
                    const contacts = result;
                    Msg.find({ id: req.params.contact_id })
                        .then(result => {
                            const msgs = result;
                            Contact.find({userid: req.params.contact_id})
                                .then(result => {
                                    const activecontact = result;
                                    res.render('chat', { all_contacts: contacts, active_contact_id: req.params.contact_id, messages: msgs, active_contact: activecontact, myid: req.params.my_id});
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
})

app.post('/:my_id/:contact_id', (req, res) => {
    const msg1 = new Msg(req.body);
    const msg2 = new Msg(req.body);
    msg1.id = req.params.contact_id;
    msg1.save()
        .then(result => {
            mongoose.disconnect();
            mongoose.connect('mongodb://127.0.0.1/'+req.params.contact_id)
                .then(result => {
                    msg2.id = req.params.my_id;
                    msg2.sent = false;
                    msg2.save()
                        .then(result => {
                            mongoose.disconnect();
                            mongoose.connect('mongodb://127.0.0.1/'+req.params.my_id)
                                .then(result => {
                                    res.redirect('/' + req.params.my_id + '/' + req.params.contact_id);
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
})

app.use((req, res) => {
    res.status(404).render('404');
})

