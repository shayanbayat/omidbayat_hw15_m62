const express = require('express');
const router = express.Router();
const {validateRegisterField, saveRegisterForm, checkUserLogin, checkAuth, userInfo, userUpdate}= require("../controller/auth");
const {DeviceAdd, DeviceInfo, checkAccess, DeleteDevice} = require('../controller/device')
const DeviceModel = require("../models/Device");
const User = require("../models/User");
router.route('/')
    .get(function (req,res){res.redirect('/home')})
    .post(function (req,res){res.redirect('/home')})

router.route('/home')
    .get(function (req,res){
        res.render('home')})

router.route('/login')
        .get(function (req,res){res.render('login')})
        .post(checkUserLogin)


router.route('/register')
    .get(function (req,res){res.render('register')})
    .post(validateRegisterField, saveRegisterForm)

router.route('/dashboard')
    .get(checkAuth,userInfo,function (req,res){
        let info = req.session.userInfo
        let user = res.locals
        console.log(info)
            res.render('user',{info,user, layout:'../views/layouts/base.ejs'})})
    .post(userUpdate)

router.route('/logout')
    .get((req, res)=>{res.redirect('/')})
    .post((req,res)=>{req.session.destroy()
        res.redirect('/')
    })

router.route('/Device-add')

    .get(checkAuth,(req,res)=>{
        let info = req.session.userInfo
        res.render('DeviceAdd',{info, layout:'../views/layouts/base.ejs'}
        )})
    .post(checkAuth,DeviceAdd)

router.route('/devices')
    .get(checkAuth, DeviceInfo, (req,res)=>{
        let info = req.session.userInfo
        let device = res.locals
        if(req.session.err !== ''){
            let errors = req.session.err
            req.session.err = ''
            res.render('devices',{info,device,errors, layout:'../views/layouts/base.ejs'})
        }
        else if(req.session.succ !== '')
        {
            let msg = req.session.succ
            req.session.succ = ''
            res.render('devices',{info,device, msg, layout:'../views/layouts/base.ejs'})
        }
        else {
            res.render('devices',{info,device, layout:'../views/layouts/base.ejs'})
        }

    })


router.route('/delete')
    .post(checkAuth,checkAccess,DeleteDevice)

router.route('/ff/ss/')
    .get((req,res)=>{
        res.render('kol',{layout:'../views/layouts/base.ejs'})
    })

router.route('/deleteUser')
    .post(checkAuth,async (req,res)=>{

        if(req.body.username === req.session.userInfo.username){
            let data = await User.deleteOne({ username: req.body.username })
            if(data){
                req.session.destroy()
                let msg = "با موفقیت حذف شد"
                res.render('login', {msg})
            }}
        else {
            req.session.destroy()
            let msg = "شما مجاز به انجام این عملیات نیستید"
            res.render('login', {msg})
        }

    })

module.exports = router