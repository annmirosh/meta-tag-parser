var express = require('express'),
    app = express(),
    cheerio = require('cheerio'),
    request = require('request'),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    router = express.Router();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

router.route('/urls')
      .post(function (req, res) {
          var pageInfo = {},
              url = req.body.url;

          request(url, function (error, response, html) {
              if (!error && response.statusCode == 200) {
                  var $ = cheerio.load(html),
                      $head = $('head');

                  pageInfo.title = $head.find('meta[name="og:title"]').attr('content');
                  if (!pageInfo.title) {
                      pageInfo.title = $head.find('title').text();
                  }

                  pageInfo.description = $head.find('meta[name="og:description"]').attr('content');
                  if (!pageInfo.description) {
                      pageInfo.description = $head.find('meta[name="description"]').attr('content');
                  }

                  pageInfo.favicon = $head.find('link[rel="shortcut icon"]').attr('href');
                  pageInfo.image = $head.find('meta[property="og:image"]').attr('content');

                  console.log(pageInfo);
                  res.json({pageInfo: pageInfo});
              } else {
                  res.json({error: 'Can not get info about page'});
              }
          });
      });

app.use('/api', router);

app.listen(port, function () {
    console.log('Running on PORT: ' + port);
});