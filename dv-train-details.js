
//

var phantom = require('phantom');

var train = process.argv[3] || "3821";

phantom.create(function(ph) {
  return ph.createPage(function(page) {
    return page.open("http://dv.njtransit.com/mobile/train_stops.aspx?train="+train, function(status) {
      
      //console.log("opened departure vision?", status);
      page.includeJs('http://code.jquery.com/jquery-1.11.3.min.js', function(err) {
        
        setTimeout(function(){
          return page.evaluate(function(){
  
              var rows = $('#table_stops tr');

              var out = {
                departsMetroPark: $(rows[8]).text()
              };

              return out;

          }, function(result){
            
            console.log(result);
            ph.exit();
            
          });
        }, 10);
        
      });
      
    });
  });
}, {
  dnodeOpts: {weak: false}
});