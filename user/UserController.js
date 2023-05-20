
const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs');
const adminAuth = require("../middlewares/adminAuth");
const jwt  = require ("jsonwebtoken"); 
const { secretjwt, refreshjwt } = require('../user/passwords.json');
const { createTransport, createMessage, resetMessage } = require('./configMailer.js');

const crypto = require('crypto');
const moment = require('moment-timezone');
const transport = createTransport();

router.get("/users/losepassword", (req, res) => {
    const resetagain = req.query.resetagain === 'true';
    res.render("users/losepassword", { resetagain })
});

router.get("/users/create", (req, res) => {
    const expired = req.query.expired === 'true';
    res.render("users/create", { expired });
});

router.get("/login", (req, res) => {
    const reviewcreate = req.query.reviewcreate === 'true';
    const reset = req.query.reset === 'true';
    const userexist = req.query.userexist === 'true';
    res.render("users/login", { reset, reviewcreate, userexist })
});

router.get("/users/resetpassword", (req, res) => {
    res.render("users/resetpassword")
});

router.post("/users/create", async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.redirect("/login?userexist=true");
        }

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        const user = await User.create({ 
            email: email,
            password: hash,
            isadmin: 'user'
        });
        const confirmationToken = crypto.randomBytes(20).toString("hex");
        let now = moment().tz('America/Sao_Paulo').add(1, 'minutes').toDate();
        user.userconfirmToken = confirmationToken;
        user.userconfirmExpires = now;
        await user.save();
        
        const confirmLink = `http://localhost:8086/confirm?confirmationToken=${confirmationToken}&email=${email}`;
        transport.sendMail(createMessage(user, confirmLink), (err) => {
            if (err) {
              console.error(err);
              return res.status(500).send({ error: 'Failed to send email' });
            }
          });
        return res.redirect("/login?reviewcreate=true");
    } catch (err) {
        console.error(err);
        res.redirect("/users/create");
    }
});

router.get('/confirm', async (req, res) => {
    const userconfirmToken = req.query.confirmationToken;
    const email  = req.query.email;
    try {
        const user = await User.findOne({ where: { userconfirmToken, email } });
        if (!user || !user.userconfirmToken){
            return res.redirect("/users/create?expired=true"); 
        }

        let now = moment().tz('America/Sao_Paulo').toDate();
        if (now > user.userconfirmExpires) {
            await user.destroy();
            return res.redirect("/users/create?expired=true");
        }

        user.userconfirmToken = null;
        user.userconfirmExpires = null;
        await user.save();
        res.redirect("/login");
    } catch (err) {
        console.error(err);
        res.redirect("/users/create");
    }
});

router.post("/forgotpassword", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).send({ error: 'User not found 5' });
        }
         
        if (user.userconfirmToken !== null) {
            return res.redirect("/login?reviewcreate=true");
        }

        const now = moment().tz('America/Sao_Paulo').toDate();
        if (user.resetPasswordExpires && user.resetPasswordExpires > now) {
            return res.redirect("/login?reviewcreate=true"); 
        }

        const resetToken = crypto.randomBytes(20).toString("hex"); 
        const expirationDate = moment().tz('America/Sao_Paulo').add(60, 'seconds').toDate();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = expirationDate;
        await user.save();
  
        const resetLink = `http://localhost:8086/resetpassword?resetToken=${resetToken}&email=${email}`;
        transport.sendMail(resetMessage(user, resetLink), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: 'Failed to send email' });
            }
            return res.redirect("/login?reviewcreate=true");
        });
    } catch (err) {
      console.error(err);
      res.redirect("/login");
    }
});
  
router.get('/resetpassword', async (req, res) => {
    const { resetToken, email } = req.query;
    try {
        const user = await User.findOne({ where: { resetPasswordToken: resetToken, email } });
        if (!user) {
        return res.status(400).send({ error: 'Invalid or expired token' });
        }

        let now = moment().tz('America/Sao_Paulo').toDate();
        if (now > user.resetPasswordExpires) {
            return res.redirect("/users/losepassword?resetagain=true"); 
        }

        res.render('users/resetpassword', { resetToken, email });
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
});

router.post('/resetpassword', async (req, res) => {
    const {email, resetToken, password} = req.body;
    try {
        const user = await User.findOne({ where: { email, resetPasswordToken: resetToken } });
        if (!user) {
            return res.status(400).send({ error: 'User not found 9' });
        }

        let now = moment().tz('America/Sao_Paulo').toDate();
        if (now > user.resetPasswordExpires) {
            return res.status(400).send({ error: 'Token expired' });
        }
       
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        res.redirect("/login");
    } catch (err) {
        console.error(err);
        res.redirect("/login");
    }
})

router.get("/users", adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render("users/index", {users: users});
    });
});

router.post("/authenticate", (req, res) => {
    const {email, password} = req.body;
    if((!email || email === "") || (!password || password === "")){
        console.log("Use a valid user.")
        res.redirect("/login");
    }else{
        User.findOne({where: {email: email}}).then((user) => {
            if (user) {
                if (user.userconfirmToken !== null) {
                    return res.redirect("/login?reviewcreate=true");
                }

                if (bcrypt.compareSync(password, user. password)){
                    req.session.user = { id: user.id, email: user.email}
                    const acesstoken = jwt.sign({ email: user.email }, secretjwt, {expiresIn: "60s",});
                    const refreshtoken = jwt.sign({ email: user.email }, refreshjwt, {expiresIn: "1d",});
                    req.token = acesstoken;
                    res.cookie("auth", acesstoken);
                    res.cookie("refreshToken", refreshtoken);
                    res.redirect("/users");
                    console.log("Authenticated");
                } else {
                    res.redirect("/login");
                    console.log("Authentication failed")
                }
            } else {
                res.redirect("/login");
                console.log("User not found");
            }
        }).catch((error) => {
            res.redirect("/login");
            console.log("Error retrieving user:", error);
        });
    }
});

router.post("/user/delete", async (req, res) => {
    const id = req.body.id;
    if (!id) {
      return res.redirect("/users");
    }
    try {
        const user = await User.findByPk(id);
        await user.destroy({ where: { id } });
        res.redirect("/users");
        console.log("User deleted!")
      } catch (err) {
        console.error(err);
        res.redirect("/users");
      }
});

router.get("/logout", (req, res) => {
    res
    .status(200)
    .clearCookie('auth')
    req.session.user = undefined;
    res.redirect("/login");
})

module.exports = router;


