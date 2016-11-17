var express = require('express'),
    app = express(),
    MetaInspector = require('node-metainspector'),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    router = express.Router();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

router.route('/urls')
      .post(function (req, res) {
          var response,
              url = req.body.url,
              client = new MetaInspector(url, {timeout: 5000});

          client.on("fetch", function () {
              console.log(client.title);
              console.log(client.ogTitle);
              console.log(client.description);
              console.log(client.ogDescription);
              console.log(client.image);
              console.log(client.links);


              res.json({reg: 'post ' + new Date()});
          });

          client.on("error", function (err) {
              res.json({error: 'Can not get info about page', detail: err});
          });
          client.fetch();
      });

app.use('/api', router);

app.listen(port, function () {
    console.log('Running on PORT: ' + port);
});