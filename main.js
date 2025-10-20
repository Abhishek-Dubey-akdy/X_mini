// importing the modelues which are needed for web app
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { UserDataset } from "./model/user.js";
import {Tweets} from "./model/PostSchema.js"
import session from "express-session";


// connecting to the database
(async () => {
    let mongoDB_url = "mongodb://localhost:27017/post_timePass";
    try {
        await mongoose.connect(mongoDB_url);
        console.log("connected to DB")
    } catch (err) {
        console.log(err);
    }
})()


// setting up the express app
const app = express();
const port = 3000;

// setting view engine and using the method needed for this web app like public, sessions, urlencoded, json
app.set("view engine", "ejs");
app.use(express.static("public")); // begin able to use the files in public (publically)
app.use(session({
    secret: "tweetIsPostedInThisApp",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day session
    }
}));
app.use(express.urlencoded({ extended: false })); // use to read the name from 'form'
app.use(express.json()); // to pass the json as response


// a function to format date when the user post the tweet!
function Formated_date() {
    let now = new Date();
    
    let date = String(now.getDate()).padStart(2, "0");
    let month = String(now.getMonth() + 1).padStart(2, "0");
    let year = String(now.getFullYear())
    
    return `${date}-${month}-${year}`;
}


// this is a function use to check that if the person has loggedIn before accessing any content eg-(dash) or not
function IsAuthenticated(req, res, next) {
    if (req.session.UserId) {
        next();
    } else {
        res.redirect("/login");;
    }
}


// setting up all the rotues which can be access by GET Method: /, /login, /signup, /dashboard, /profile
app.get("/", async (req, res) => {
    console.log("/ route hit");
    res.render("index");
})

app.get("/login", (req, res) => {
    res.render("index");
});

app.get("/signup", async (req, res) => {
    res.render("signup");
});

app.get("/dashboard", IsAuthenticated, async (req, res) => {
    let data = await Tweets.find().sort({createdAt: -1});
    let Usersname_current = await UserDataset.findById(req.session.UserId);

    res.render("dash", {array_post: data, username: Usersname_current.username});
});

app.get("/profile", IsAuthenticated, async (req, res) => {
    let Username = await UserDataset.findById(req.session.UserId);
    let UsersOnlyPost = await Tweets.find({username: Username.username}).sort({createdAt: -1});

    res.render("profile", {Posts: UsersOnlyPost, user: Username.username});
})


// creating the signup route with error handling 
app.post("/signup", async (req, res) => {
    try {
        let { username, pass } = req.body;

        // checking that if the user had provded the username or the password
        if ((!username) || (!pass)) {
            res.render("logResponse", { msg: "please enter username or password" });
            return;
        }

        // checking that is there any exixsting user with same username
        const exsistingUser = await UserDataset.findOne({ username });
        if (exsistingUser) {
            res.render("logResponse", { msg: "username already taken" });
            return;
        }

        // hashing the password
        const hashPass = await bcrypt.hash(pass, 10);

        // create user & saving it
        const user = new UserDataset({ username: username, password: hashPass });
        await user.save();

        res.redirect("/login");
    } catch (err) {
        console.log(err);
    }
})


// creating the login route with error handling 
app.post("/login", async (req, res) => {
    try {
        let { username, pass } = req.body;

        // checking that if the user had provded the username or the password
        if ((!username) || (!pass)) {
            res.render("logResponse", { msg: "please enter username or password" });
            return;
        }

        // checking the username even exist
        const ExistUser = await UserDataset.findOne({ username });
        if (!ExistUser) {
            res.render("logResponse", { msg: "user not exists" });
            return;
        }

        // comparing the passwords
        const Ismatch = await bcrypt.compare(pass, ExistUser.password);
        if (!Ismatch) {
            res.render("logResponse", { msg: "invailed password" });
            return;
        }

        // creating session for authentication
        req.session.UserId = ExistUser._id.toString();
        res.redirect("/dashboard");
    } catch (err) {
        console.log(err)
    }
})


// creating the logout route and destroying the session before logging out
app.post("/logout", (req, res) => {
    // destroying the session so that the new user will not be having any issue
    req.session.destroy(err => {
        if (err) {
            console.log(err)
        }
    
    // connect.sid is the default name of the connection 
    res.clearCookie("connect.sid"); // clearing the cookie for the browser side so it can't use it anymore
    res.redirect("/login");
    })
})


// getting tweet from front-end and saving it to the database
app.post("/data", async (req, res) => {
    const Username = await UserDataset.findById(req.session.UserId)
    
    await Tweets.create({username: Username.username, 
                         post: req.body.tweet, 
                         date: Formated_date(),
                         createdAt: Date.now()});

    res.send("Tweet Posted!");
})


// checking if there is any new post posted in the X mini (web app)
app.post("/anyNewData", async (req, res) => {
    let newTweet = await Tweets.findOne().sort({createdAt: -1 });

    if (newTweet._id.toString() !== req.body.Post_id) {
        res.json({condition: false});
    } else {
        res.json({condition: true});
    }
})


// running the app on a specific port
app.listen(port, () => {
    console.log(`your app is running in port ${port}`);
})