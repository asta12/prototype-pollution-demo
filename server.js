const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()
const port = 8080

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(setColors({}))
})

app.post('/', (req, res) => {
    let json = {};
    try {
        json = JSON.parse(req.body.thetext)
    } catch (err) {
        res.send("<b>Bad input!</b>")
        return
    }
    let start = Object.create({})
    start.token = "1234"
    let config = merge(json, start)
    if (config.isAdmin) {
        delete config.isAdmin
    }
    isAdmin(config)
    if (config.isAdmin) {
        try {
            let flag = fs.readFileSync('flag', 'utf8')
            res.send(flag)
        } catch (err) {
            res.send("Error: contact admin")
        }
    } else {
        res.send(setColors(config))
    }
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

function merge(source, target) {
    Object.keys(source).forEach(prop => {
        if (typeof source[prop] === "object") {
            target[prop] = merge(source[prop], Object.create({})) 
        } else {
            target[prop] = source[prop]
        }
    })
    return target
}

function isAdmin(config) {
    try {
        let adminToken = fs.readFileSync('adminToken', 'utf8')
        if (config.token === adminToken) {
            config.isAdmin = true
        }
    } catch (err) { }
}

function setColors(cfg) {
    let data = fs.readFileSync('site.html', 'utf8')
    if (isColor(cfg.square) && isColor(cfg.circle) && isColor(cfg.triangle)) {
        data = data.replace("square_color", cfg.square)
        data = data.replace("circle_color", cfg.circle)
        data = data.replace("triangle_color", cfg.triangle)
    } else {
        data = data.replace("square_color", "#00FFFF")
        data = data.replace("circle_color", "#0000FF")
        data = data.replace("triangle_color", "#FF7F50")
    }
    return data
}

function isColor(color) {
    if (typeof color !== "string") {
        return false
    }
    return /^#[A-Fa-f0-9]{6}$/.test(color);
}
