const fs = require('fs')
const path = require('path')

const chai = require('chai')
const chaiHttp = require('chai-http')
const httpStatus = require('http-status')

const app = require('../src/app')

chai.use(chaiHttp).should()

describe('app', function() {
    describe('POST /api/fileanalyse', function() {
        const dataDir = path.resolve(__dirname + '/../data')

        it('should send an error if no file was provided', function(done) {
            chai.request(app)
                .post('/api/fileanalyse')
                .end(function(err, res) {
                    if(err) {
                        throw new Error(err)
                    }

                    res.should.have.status(httpStatus.BAD_REQUEST)
                    res.should.be.json
                    res.body.should.be.an('object')
                    res.body.should.have.property('error')
                    res.body.error.should.equal('No file was provided')
                    done()
                })
        })

        it('should return a JSON with the file name and size in bytes for a text file', function(done) {
            const filename = 'file1.txt'
            const size = 35 // in bytes
            console.log(`${dataDir}/${filename}`)

            chai.request(app)
                .post('/api/fileanalyse')
                .attach('upfile', `${dataDir}/${filename}`)
                .end(function(err, res) {
                    if(err) {
                        throw new Error(err)
                    }

                    res.should.have.status(httpStatus.OK)
                    res.should.be.json
                    res.body.should.be.an('object')
                    res.body.should.have.property('filename')
                    res.body.should.have.property('size')
                    res.body.filename.should.equal(filename)
                    res.body.size.should.equal(size)
                    done()
                })
        })

        it('should return a JSON with the file name and size in bytes for a jpg file', function(done) {
            const filename = 'angry-no-meme.jpg'
            const size = 20476 // in bytes

            chai.request(app)
                .post('/api/fileanalyse')
                .attach('upfile', `${dataDir}/${filename}`)
                .end(function(err, res) {
                    if(err) {
                        throw new Error(err)
                    }

                    res.should.have.status(httpStatus.OK)
                    res.should.be.json
                    res.body.should.be.an('object')
                    res.body.should.have.property('filename')
                    res.body.should.have.property('size')
                    res.body.filename.should.equal(filename)
                    res.body.size.should.equal(size)
                    done()
                })
        })
    })
})