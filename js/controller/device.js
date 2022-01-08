const DeviceModel = require("../models/Device")
const User = require("../models/User")

async function DeviceAdd(req, res, next){
    const {name , token} = req.body
    let user = req.session.userInfo.username
    user = await User.find({username:user})

    user= user[0]
    let device =new DeviceModel({
        user,
        name,
        token,
    })
    await device.save((err, data)=>{
        if(err){
        let errors = "توکن ایجاد شده تکراری است "
            res.render('DeviceAdd',{errors,name,token,layout:'../views/layouts/base.ejs'})
        }
        else {
            let msg = "دستگاه با موفقیت ایجاد شد"
            res.render('DeviceAdd',{msg,layout:'../views/layouts/base.ejs'})
        }
    })
    // DeviceModel.
    // findOne({
    //     token: '222'
    // }).
    // populate('user').
    // exec(function(err, story) {
    //     if (err) console.log( err);
    //     console.log('The author is %s', story.user[0].username);
    //     // prints "The author is Ian Fleming"
    // });

}

async function DeviceInfo(req, res, next){
    let user = req.session.userInfo.username
    user = await User.findOne({username:user})
    let device =await DeviceModel.find({user:user},{_id:0,user:0})
    res.locals = device
    if(next){next()}

}

async function DeleteDevice(req,res,next){
    const info = req.session.userInfo
    let data = await DeviceModel.deleteOne({ token: req.body.token })
    console.log(data)
    await DeviceInfo(req,res)
    let device = res.locals
            if (!data){
                let errors ="خطا در حذف"
                req.session.err = errors
                res.redirect('/devices')
                // res.render('devices',{info,errors,device, layout:'../views/layouts/base.ejs'})
                }
            else {
                let msg = "حذف با موفقیت انجام شد"
                req.session.succ = msg
                res.redirect('/devices')
                // res.render('devices',{info,msg,device, layout:'../views/layouts/base.ejs'})
            }



}

async function checkAccess(req, res, next){
    let user = req.session.userInfo.username
    user = await User.findOne({username:user})
    DeviceModel.findOne({token:req.body.token})
        .populate('user').
         exec(function(err, device) {
             if (err){console.log(err)}
            else {
                 if(device != null && device.user[0].id == user.id ){
                     next()
                 }
                 else {
                     let msg = "صاحب دستگاه انتخابی شما نبوده اید"
                     res.render('login',{msg})
                 }
             }
         });

}


module.exports = {DeviceAdd, DeviceInfo, checkAccess, DeleteDevice}