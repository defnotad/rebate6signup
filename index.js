const express = require("express");
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const signups = db.collection("signups");


app.listen(process.env.PORT, function () {
    console.log("Server started");
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", async function (req, res) {
    email = req.body.email;
    mobile = '+91' + req.body.mobile;
    if (email == '' && mobile == '+91') {
        res.sendFile(__dirname + '/failure.html');
        return;
    }
    const check = await signups.where('mobile', '==', mobile).get();
    if (check.empty) {
        await signups.add({
            mobile: mobile,
            email: email,
            date: Date(),
        }).then(function () {
            res.sendFile(__dirname + '/success.html');
        });
    } else {
        res.sendFile(__dirname + '/failure.html');
    }
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});