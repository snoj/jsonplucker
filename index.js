var _ = require('lodash');

(function() {
  var tryjson = function(teststring) {
    try {
      return JSON.parse(teststring);
    } catch(ex) {
      return false;
    }
  };
  var finished = false;
  var finish = function(obj) {
    if(!!finished) return;

    finished = true;

    if(!!!obj) {
      throw "Invalid json string, cannot be parsed.";
    }
    var paths = _.slice(process.argv, 2);
    var values = _.at(obj, paths);
    _.each(values, function(v, index) {
      console.log(paths[index], v);
    });
  };
  var raw_string = "";
  process.stdin.setEncoding('utf8');
  process.stdin.on("readable", function() {
    var tmpchunk = process.stdin.read();
    var attempt = tryjson(tmpchunk);
    if(!!attempt)
      finish(attempt);
    else
      raw_string += tmpchunk;
  });

  process.stdin.on('end', function() {
    finish(tryjson(raw_string));
  });

})();