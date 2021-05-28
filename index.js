const express = require("express");
const dotenv = require("dotenv");
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const otpSchema = new mongoose.Schema({ phoneNo: String, otp: String }, 
           { collection : 'otp-collection' }); 
const Otp = mongoose.model('otp-collection', otpSchema);

app.use(express.json());

app.get("/", async (req,res) => {
    let otp = await Otp.find({});
    console.log(otp);
    res.send("JSON.parse(otp)")
})
app.post("/update-or-create", async (req,res) => {
    let otp = await Otp.findOne({ phoneNo: req.body.phoneNo });
    if(!otp){
        otp = new Otp({
            phoneNo: req.body.phoneNo,
            otp: req.body.otp
        });
    }else{
        otp["otp"] = req.body.otp;
        otp["phoneNo"] = req.body.phoneNo;
    }
    otp.save().then(() => {
        res.send("success");
    });
    console.log(req.body);
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})