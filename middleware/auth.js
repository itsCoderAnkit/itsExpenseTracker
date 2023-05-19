const jwt = require('jsonwebtoken')
const User = require('../model/user_signup')

exports.authenticate = async (req,res,next) =>{
try{
const token = req.header("Authorisation")
const listsize = req.header("listSize")
console.log('MIDDLEWARE TOKEN >>>>>>>>>>>>',token)
const user = jwt.verify(token,'secretkey')
//console.log('MIDDLEWARE USER >>>>>>>>>>>>>>>',user)
User.findByPk(user.userId).then(user =>{
    //console.log(user)
    req.user = user
    next()
})
}
catch(err){
    console.log(err)
    return res.status(500).json({message:"User not authenticated using token in middleware"})
}
}

