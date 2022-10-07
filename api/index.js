import { db } from '../api/firebaseconfig.js'
//import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { doc, getDoc, setDoc, collection, updateDoc } from "firebase/firestore";


const bodyParser = require('body-parser')
const app = require('express')()
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.json())
async function validate(cuser, cpass) {
  var docRef = doc(db, "nuxt", "userlist");
  var docSnap = await getDoc(docRef);
  if (docSnap.exists()) var data = docSnap.data();
  var datakey = Object.keys(data).map((key) => key);
  if (! datakey.includes(cuser)) return { loginstate: false, err: "Invalid username" }
  else {
    if (data[cuser].password == cpass) { return { loginstate: true, err: "Logged in", data: { [cuser]: data[cuser],user:cuser, cookies: JSON.stringify({ user: cuser, pass: cpass })} }}
    else return { loginstate: false, err: "Invalid password" }
  }
}
app.all('/addtocart', async (req, res) => {
  var cred = JSON.parse(req.cookies.cred);
  var cuser = cred.user; 
  if (validate(cred.user, cred.pass)) {  setDoc(doc(db, "nuxt", "userlist"), { [cuser]: { cart: req.body } }, { merge: true }) }
  res.send('ok')
});


app.all('/products', async (req, res) => {
  var cred = JSON.parse(req.cookies.cred);
  //console.log(1);
  try {
    var states = await validate(cred.user, cred.pass);
  }
  catch (err) {
  }
  if (states.loginstate) {
    var docRef = doc(db, "nuxt", "products");
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) var datas = docSnap.data();
    var data1 = Object.values(datas);
    var data = [];
    data1.forEach(function (x) { x.minicartnoitems = 1; data.push(x) });
    //console.log(data);
    res.send(data);
  }
  else {
    res.send("Something went wrong")
  }
});
app.post('/signup', async (req, res) => {
  try {
    var cuser = req.body.user;
    var cpass = req.body.pass;
    var docRef = doc(db, "nuxt", "userlist");
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) var data = docSnap.data();
    var datakey = Object.keys(data).map((key) => key);
    if (!datakey.includes(cuser)) { await setDoc(doc(db, "nuxt", "userlist"), { [cuser]: { password: cpass, cart: {} } }, { merge: true }); res.send({ loginstate: true, err:"Logged in",data: { [cuser]: { password: cpass }, cookies: JSON.stringify({user:cuser,pass:cpass}) } }) }
  }
  catch (err) { res.send({loginstate:false,err:"Something went wrong"})}
});
 app.all('/auth', async (req, res) => {
   try {
     if (!req.body.user) {
       var cred = JSON.parse(req.cookies.cred);
       var logintype = "cookie";
     }
     else {
       var logintype = "form";
       var cred = req.body;
     }
     var user = cred.user;
     var pass = cred.pass;
     console.log(user,pass)
     var resp = await validate(user, pass);
     if (logintype == "cookie") resp.err = "";
     res.send(resp);
   } catch (err) {
     console.log(err)
     res.send({loginstate: false, err: "Something Went wrong" });
   }
 });

app.post('/cart', async (req, res) => {
  var cred = JSON.parse(req.cookies.cred);
  //console.log(1);
  try {
    var states = await validate(cred.user, cred.pass);
  }
  catch (err) {
  }
  if (states.loginstate) {
    var docRef = doc(db, "nuxt", "products");
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) var datas = docSnap.data();
    var data1 = Object.values(datas);
    var data = [];
    data1.forEach(function (x) { x.minicartnoitems = 1; data.push(x) });
  }
  else {
    res.end({ err: "Something went wrong" });
    return;
  }
  var cred = JSON.parse(req.cookies.cred);
  var loginstate = await validate(cred.user, cred.pass);
  if (loginstate.loginstate) {
    var docRef = doc(db, "nuxt", "userlist");
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var datas = docSnap.data();
      var cartlist = datas[cred.user].cart;
      var data = [];
      var key = [];
      Object.keys(cartlist).forEach((k) => {key.push(k)} );

      data1.forEach((z) => {
        if (key.includes(z.id)) {
          var z1 = z;
          z1.qty = cartlist[z.id];
          data.push(z1);
        }
      });
      console.log(data)
      res.end(JSON.stringify(data));
    }
  }
  else res.send({err:"Something went wrong ! (suspicous attempt)"})
});
app.all('/confirmorder', async (req, res) => {
  var cred = JSON.parse(req.cookies.cred);
  var cuser = cred.user;
  console.log(1)
  if (validate(cred.user, cred.pass)) {
    var docRef = doc(db, "nuxt", "userlist");
    var docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      var datas = docSnap.data();
      var cartlist = datas[cred.user].cart;
      var prevorderids = await getDoc(doc(db, "nuxt", "orders"));

      var orderno = Object.keys(prevorderids.data()).length + 1;
      //console.log(Object.keys(prevorderids),orderno, cartlist)
      if (orderno === undefined || isNaN(orderno)) orderno = 1;
      var orddata = req.body;
      orddata.user = cuser
      orddata.products = cartlist
      await setDoc(doc(db, "nuxt", "orders"), { [orderno]: orddata }, { merge: true })
      await setDoc(doc(db, "nuxt", "userlist"), { [cuser]: { cart: {} } }, { merge: true });
      res.send("Your order has been placed succesfully .\n  Order number :"+orderno )
    }
  }
  else {
    res.send("something went wrong")
  }
  
});



  module.exports = app;
