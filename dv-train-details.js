var phantom = require('phantom'),
    express = require('express'),
    app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/train/*', function(req, res){
  
  var path = req.originalUrl,
      a = path.indexOf("/train/"),
      e = path.substring(a+7),
      train = e || "3821",
      result = {};
      
      train = train.replace("/", "");
      
  phantom.create(function(ph) {
    return ph.createPage(function(page) {
      return page.open("http://dv.njtransit.com/mobile/train_stops.aspx?train="+train, function(status) {
        
        page.includeJs('http://code.jquery.com/jquery-1.11.3.min.js', function(err) {
          setTimeout(function(){
            
            return page.evaluate(function(){
              
                var towards = $('span#label_description b:nth-of-type(2)').text(),
                    rows = $('table#table_stops tbody tr'),
                    route = [];
                $(rows).each(function(){
                  
                  if ( $(this).text() !== '' ){
                    
                    var d = $(this).find('i').text(),
                        s = $(this).clone().find('i').remove().end().text().trim(),
                        pos = s.indexOf('  at   ');
                        
                    // if theres a time "  at   "
                    if ( pos !== -1 ){
                      d = s.substring(pos+7);
                      s = s.substring(0, pos);
                    }
                        
                    var kvp = {
                        	 	status: d,
                            station: s.trim()
                        	};
                          
      	            route.push(kvp);
                  }
                });
                
                var trainInfo = {
                  toward: towards,
                  route: route
                };
                
                return trainInfo;
                
            }, function(results){
              
              result = results;
              result.train = train;
              console.log("hit: " + train);
              res.json(result);
              ph.exit();
              
            });
            
          }, 10);
        });
      });
    });
  },  // end phantom
  { dnodeOpts: {weak: false} }); // necessary workaround for python depency issues?
  
}); // end server route

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Train Information http://%s:%s', host, port);
});