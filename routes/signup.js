const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const User = require('../models/user');
const url1 = 'mongodb://127.0.0.1/users';

router.get('/', async(req, res) => {
    try {
        mongoose.disconnect();
        mongoose.connect(url1)
        .then(result => {
            console.log('connected to users database...');
        })
        .catch(err => {
            console.log(err);
        })
        res.render('signup');
    }catch(err) {
        console.log(err);
    }
});

router.post('/', async(req, res) => {
    try {
        const user = new User(req.body);

        User.find({userid: user.userid})
            .then(result => {
                if(result.length == 0)
                {
                    user.save()
                        .then(result => {
                            mongoose.disconnect();
                            const userid = user.userid;
                            const url2 = 'mongodb://127.0.0.1/'+userid;
                
                            mongoose.connect(url2)
                                .then(result => {
                                    console.log('connected to chats database...');
                                    res.redirect('/'+userid);
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        })
                        .catch(err => {
                            console.log(''+err);
                        })
                }
                else
                {
                    res.render('signup_fail');
                }
            })
            .catch(err => {
                console.log(err);                
            })
    }catch(err) {
        console.log(err);
    }
})


module.exports = router;