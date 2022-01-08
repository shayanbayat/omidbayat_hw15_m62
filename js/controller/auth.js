const validator = require("email-validator");
const userModel = require("../models/User")
function validateRegisterField(req, res, next){
const{firstName, lastName, email, phoneNumber, username, firstPassword, secondPassword} = req.body
   let errors = []
    if(firstName.length<4){errors.push("طول نام کم است")}
    if(lastName.length<4){errors.push("طول نام خانوادگی کم است")}
    if(!validator.validate(email)){errors.push("ایمیل معتبر نمی باشد")}
    if(!phoneNumber.match(/(0|\\+98)?([ ]|-|[()]){0,2}9[1|2|3|4]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}/g)){
        errors.push("شماره تماس معتبر نمی باشد")
    }
    if (username.length < 6){errors.push("نام کاربری باید بیش از شش حرف باشد")}
    if(firstPassword !== '*'){
     if (!firstPassword.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g)){errors.push("گذرواژه باید شامل حروف بزرگ و کوچک و اعداد و نماد باشد")}
     if(firstPassword !== secondPassword){errors.push("گذروازه های وارد شده یکسان نیست")}
    }
    if (errors.length){
     res.render('register',{errors,
     firstName,lastName,email,phoneNumber,username})
    }
    else {
     next()
    }

}
function saveRegisterForm(req, res, next){
 const{firstName, lastName, email, phoneNumber, username, firstPassword, secondPassword} = req.body
const user = new userModel({
 firstName,
 lastName,
 username,
 phoneNumber,
 email,
 firstPassword
})
user.save((err)=>{
 if(err) {
  var errors = []
  if (err.code === 11000) {
   console.log(err.code)
   if ((Object.keys(err.keyValue)) == 'phoneNumber') {
    errors.push("شماره تماس قبلا ثبت شده است")
   }
   else if ((Object.keys(err.keyValue)) == 'username') {
    errors.push("نام کاربری قبلا انتخاب شده است")
   }
   else if ((Object.keys(err.keyValue)) == 'email') {
    errors.push("ایمیل وارد شده قبلا انتخاب شده است")
   }
   res.render('register', {
    errors,
    firstName, lastName, email, phoneNumber, username
   })
  }
 }
 else {
  let msg = "کاربری با موفقیت ساخته شد لطفا وارد شوید"
  res.render('login',{msg})
 }
})
}
async function checkUserLogin(req, res, next){
 const {username, password} = req.body
 let user =await userModel.find({username:username, password:password})
 if(user.length>0){
  let userInfo = {}
  req.session.isAuth = true
  userInfo.username = user[0].username
  userInfo.firstName = user[0].firstName
  userInfo.lastName = user[0].lastName
  req.session.userInfo = userInfo
  res.redirect('/dashboard')
 }
 else {
  let msg = "نام کاربری یا گذرواژه نادرست است"
  res.render('login',{msg})
 }

}
function checkAuth(req, res, next){
 if(req.session.isAuth){
  next()
 }
 else{
  let msg = "ابتدا باید در سایت وارد شوید"
  res.render('login',{msg})
 }
}
async function userInfo(req,res,next){
 let user = await userModel.find({username:req.session.userInfo.username})
 res.locals = user[0]
 next()
}
async function userUpdate(req, res, next){
 let user =await userModel.findOne({username:req.session.userInfo.username})
 const{firstName, lastName, email, phoneNumber, username, firstPassword, secondPassword} = req.body
 let errors = []
 if(firstName.length<4){errors.push("طول نام کم است")}
 if(lastName.length<4){errors.push("طول نام خانوادگی کم است")}
 if(firstPassword !== '*'){
  if (!firstPassword.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/g)){errors.push("گذرواژه باید شامل حروف بزرگ و کوچک و اعداد و نماد باشد")}
  if(firstPassword !== secondPassword){errors.push("گذروازه های وارد شده یکسان نیست")}
 }
 if (errors.length>0){
  let info = req.session.userInfo
  res.render('user',{info,errors,user, layout:'../views/layouts/base.ejs'})
 }
 else {
  user.firstName = firstName
  user.lastName = lastName
  if (firstPassword !== '*'){
   user.password = firstPassword
  }
  user.save()
  req.session.destroy()
  let msg = "اطلاعات با موفقیت ویرایش شد"
res.render('login',{msg})

 }
}

module.exports ={validateRegisterField,saveRegisterForm, checkUserLogin, checkAuth, userInfo, userUpdate}