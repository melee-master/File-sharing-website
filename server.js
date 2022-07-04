const express = require('express');

const multer = require("multer")

const mongoose = require("mongoose")

const dotenv= require('dotenv');

dotenv.config();


const upload = multer({dest: "uploads"})

const app = express();

const PORT = process.env.PORT || 3000;

const bcrypt = require("bcrypt");

const File = require('./models/file');
const file = require('./models/file');

app.set("view engine", "ejs");

mongoose.connect(process.env.DATABASE_URL)

app.get('/', (req, res)=> {
    res.render("index")
})
app.post('/upload', upload.single("file"), async (req, res)=>{
    const fileData = {
        path: req.file.path,
        originalName: req.file.originalname,
       
    }
    if(req.body.password != null && req.body.password !== "" ){
        fileData.password = await bcrypt.hash(req.body.password, 10);
    }
    const file = await File.create(fileData)
    res.send(file.originalName)
})
app.get('/file/:id', (req, res)=> {
    res.render("index", {fileLink: `${req.headers.origin}/file/${file.id}`})
    const file = await File.findById(req.params.id);
    file.downloadCount++;
    await file.save;
    res.download(file.path, file.originalName);
})
app.listen(PORT, (req, res)=> {
    console.log(`Server started on port no. ${PORT}`);
})