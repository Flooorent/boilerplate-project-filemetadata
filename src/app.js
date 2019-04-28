'use strict';

const path = require('path')

const express = require('express')
const cors = require('cors')
const multer = require('multer')
const httpStatus = require('http-status')

const app = express()
const upload = multer({ dest: '/tmp' })

app.use(cors())
app.use('/public', express.static(__dirname + '/../public'))

app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../views/index.html'))
})

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"})
})

app.post('/api/fileanalyse', upload.single('upfile'), function(req, res, next) {
    if(!req.file) {
        return res.status(httpStatus.BAD_REQUEST).json({ error: 'No file was provided' })
    }
    
    return res.status(httpStatus.OK).json({
        filename: req.file.originalname,
        size: req.file.size
    })
})

app.use((err, req, res, next) => {
    console.log(err)

    return res
        .status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR)
        .json(err)
})

module.exports = app
