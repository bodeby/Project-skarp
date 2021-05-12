var express = require("express");
var router = express.Router();

let UserProfile = require("../models/user_profile");
let device_controller = require("../controllers/devicecontroller");
let settings_controller = require("../controllers/settingscontroller");
let register_controller = require("../controllers/registercontroller");
let login_controller = require("../controllers/logincontroller");
let auth = require("../controllers/authcontroller");
let graph_data = require("../models/cache_graph_data");
let Device = require("../models/device");
let AdviceCard = require("../models/advice_card");

/* ======= HOMEPAGE ======= */
// GET request for homepage
router.get("/", function (req, res, next) {
  // checking if user is logged in
  if (auth.isAuthenticated(req, res))
    UserProfile.findOne({ user: req.cookies["auth"] }).populate("advices").exec(function (err, profile_data) {
      if (err) { return next(err); }

      for (advice of profile_data.advices) {
        let constructed_time = advice.created.getHours() + 2;

        console.log(advice);
        console.log(`Created: ${advice.created}\nNow: ${constructed_time}`);
      }


      //Count the number of devices
      Device.find({ user_profile: profile_data })
        .countDocuments(function (err, counted_devices) {
          if (err) { return next(err); }
          // render data to settings page
          res.render("index", {
            title: "Homepage",
            route: "/",
            profile_data: profile_data,
            counted_devices: counted_devices,
            advices: profile_data.advices,
            carbon_data: process.env.WEB_HOST + "data/carbondata",
            forecast_data: process.env.WEB_HOST + "data/forecastdata",
            green_energy: process.env.WEB_HOST + "data/greenenergy"
          });
        });
    });
});


router.get("/cards", function (req, res, next) {
  if (auth.isAuthenticated(req, res))

    UserProfile.findOne({ user: req.cookies["auth"] }).populate("advices").exec(function (err, user_profile) {
      let advices = user_profile.advices;

      console.log(advices);

      res.json(advices);
    });
})

//GET navbar
router.get("/navbar", function (req, res, next) {
  // checking if user is logged in
  if (auth.isAuthenticated(req, res))
    UserProfile.findOne({ user: req.cookies["auth"] }).exec(function (
      err,
      profile_data
    ) {
      if (err) {
        return next(err);
      }
      // render data to navbar
      res.render("navbar", {
        title: "navbar",
        route: "/navbar",
        profile_data: profile_data,
      });
    });
});

/* ======= DEVICE ======= */

// GET request for device page
router.get("/devices", device_controller.device_list);

// GET request for device detail
router.get("/devices/device_detail/:id", device_controller.device_detail);

// POST request to add a new Device
router.post("/devices", device_controller.device_create_post);

// GET request to edit a device
router.get("/devices/edit/:id", device_controller.device_edit_get);

// POST request to edit a device
router.post("/devices/edit/:id", device_controller.device_edit_post);

// GET request to delete a device
router.get("/devices/delete/:id", device_controller.device_delete_get);

/* ======= SETTINGS ======== */

// GET request for settings page
router.get("/settings", settings_controller.settings_get);

// POST request to make changes in user settings
router.post("/user_settings", settings_controller.user_settings_post);

// POST request to make changes in sustianable settings
router.post("/sustain_settings", settings_controller.sustain_settings_post);

/* ======= USER REGISTER ======= */

// GET request for registration page
router.get("/register", register_controller.register_get);

// POST request to create new user
router.post("/register", register_controller.register_post);

/* ======= USER REGISTER ======= */

// GET request for authentication page
router.get("/login", login_controller.auth_get);

// POST request for authentication page
router.post("/login", login_controller.auth_post);

// GET request for loguout
router.get("/logout", login_controller.auth_logout);

//GET for welcome message
router.get("/welcome", login_controller.welcome_get);

module.exports = router;