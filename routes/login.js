const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const User = require('../models/user');
const url1 = 'mongodb://127.0.0.1/users';




router.get('/', (req, res) => {
    mongoose.disconnect();
    mongoose.connect(url1)
    .then(result => {
        console.log('connected to users database...');
    })
    .catch(err => {
        console.log(err);
    })
    res.render('login');
});

router.post('/', (req, res) => {
    const user = new User(req.body);

    User.find({userid: user.userid, password: user.password})
        .then(result => {
            if(result.length == 0)
            {
                res.render('login_fail');
            }
            else
            {
                
                mongoose.disconnect();
                const userid = result[0].userid;
                const url2 = 'mongodb://127.0.0.1/'+userid;

                mongoose.connect(url2)
                    .then(result => {
                        console.log('connected to chats database...');
                        res.redirect('/'+userid);
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

module.exports = router;