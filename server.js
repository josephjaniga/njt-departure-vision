/**
 * VERSION 1
 */

//var express = require('express');
//var app = express();
//var http = require('http');
//
//app.get('/', function (req, res) {
//  
//  console.log("hit");
//  
//  var str = '';
//  
//  var options = {
//    host: 'dv.njtransit.com',
//    path: '/mobile/tid-mobile.aspx?sid=MP'
//  };
// 
//  var callback = function(response) {
//
//      //another chunk of data has been recieved, so append it to `str`
//      response.on('data', function (chunk) {
//        setTimeout(function(){
//          str += chunk;
//        }, 200);
//      });
//    
//      //the whole response has been recieved, so we just print it out here
//      response.on('end', function () {
//        setTimeout(function(){
//          res.send(str);
//        }, 400);
//      });
//
//  };
//  
//  http.request(options, callback).end();
//  
//});
//
//var server = app.listen(3000, function () {
//
//  var host = server.address().address;
//  var port = server.address().port;
//
//  console.log('Example app listening at http://%s:%s', host, port);
//
//});

/**
 * VERSION 2
 */

//var request     = require('request'),  
//    cheerio     = require('cheerio');
//
//var params = {
//  uri: 'http://dv.njtransit.com/mobile/tid-mobile.aspx?sid=MP',
//  method: 'GET',
//  headers: {
//    Referer: 'http://m.njtransit.com/mo/mo_servlet.srv?hdnPageAction=DvTo'  
//  },
//  form: {
//    sid: 'MP',
//    dvStationList: 'MP',
//    submit: 'Submit'
//  }
//};
//
//request( params, function (error, response, html) { 
//   
//  if (error && response.statusCode !== 200) {
//    console.log('Error when contacting site')
//  }
//  
////  var $ = cheerio.load(html);
////  
////  $('html').each(function(){
////    console.log($(this).html());
////  });
//
//  console.log(response);
//  console.log(html);
//  
//});
//

/**
 * VERSION 3
 */

//var YQL = require('yql');
//
//var query = "select * from html where url='http://dv.njtransit.com/mobile/tid-mobile.aspx?sid=MP'";
//
//new YQL.exec(query, function(response){
//	
//	console.log(response.query.results);
//	
//});

/**
 * VERSION 4
 */

var phantom = require('phantom');

phantom.create(function(ph) {
  return ph.createPage(function(page) {
    return page.open("http://dv.njtransit.com/mobile/tid-mobile.aspx?sid=MP", function(status) {
      
      console.log("opened departure vision?", status);
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