const router = require('express').Router();
const verify = require('./verifyToken')

router.get('/', verify, (req, res) => {
    // res.json({
    //     post: {
    //         title: 'My 1st post',
    //         description: '12221'
    //     }
    // });
    res.send(req.user)
});

module.exports = router