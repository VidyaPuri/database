let express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    Database        = require("./models/database"),
    methodOverride  = require("method-override"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user")

let indexRoutes         = require("./routes/index"),
    databaseRoutes      = require("./routes/database")
    
let url = process.env.DATABASEURL || "mongodb://localhost/data_tests";
mongoose.connect(url, { useNewUrlParser: true });


process.env.databaseURL
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); 

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Om guru deep namaha",
    resave: false,
    saveUninitialized: false
}));

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/",indexRoutes);
app.use("/", databaseRoutes);


app.listen(3000, process.env.IP, function(){
    console.log("The Database Server Has Started");
});