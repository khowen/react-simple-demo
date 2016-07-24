'use strict';

const fs = require('fs'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    COMMENTS_File = path.join(__dirname, 'comments.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/comments', (req, res) => {
    fs.readFile(COMMENTS_File, (err, data) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.json(JSON.parse(data));
    });
});

app.post('/api/comments', (req, res) => {
    fs.readFile(COMMENTS_File, (err, data) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        let comments = JSON.parse(data);
        let newComment = {
            id: Date.now(),
            author: req.body.author,
            text: req.body.text
        };
        comments.push(newComment);
        fs.writeFile(COMMENTS_File, JSON.stringify(comments, null, 4), (err) => {
            if (err) {
                console.error(err);
            }

            res.json(comments);
        });
    });
});

app.listen(app.get('port'), () => {
    console.log(`Server started: http://localhost:${app.get('port')}`);
});
