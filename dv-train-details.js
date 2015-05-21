var phantom = require('phantom');
var train = process.argv[2] || "3821";

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
              
          }, function(result){
            
            result.train = train;
            console.log(result);
            ph.exit();
            
          });
          
        }, 10);
      });
    });
  });
}, {
  // necessary workaround for python depency issues?
  dnodeOpts: {weak: false}
});