
var phantom = require('phantom');

var station = process.argv[2] || "MP";

phantom.create(function(ph) {
  return ph.createPage(function(page) {
    return page.open("http://dv.njtransit.com/mobile/tid-mobile.aspx?sid="+station, function(status) {
      
      //console.log("opened departure vision?", status);
      page.includeJs('http://code.jquery.com/jquery-1.11.3.min.js', function(err) {
        
        setTimeout(function(){
          return page.evaluate(function(){
              
              /**
               * Evaluate this javascript from within the target page
               */
              var out = [];
  
              $('tr[onclick]').each(function(){

                var tds = $(this).children('td');
                
                var json = {
                  departs:  $(tds[0]).text().replace('\n ', '').replace(' \n', ''),
                  to:       $(tds[1]).text(),
                  trk:      $(tds[2]).text(),
                  line:     $(tds[3]).text(),
                  train:    $(tds[4]).text(),
                  status:   $(tds[5]).text()
                };
            
                out.push(json);
                
              });
              
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