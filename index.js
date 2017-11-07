var _ = require('lodash');
_.mixin(require('lodash-flatkeystree'));

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
    var rg = /^\/(.+)\/([gi]*|)$/;

    var keys = [];
    var rkeys = [];

    _.each(paths, function(p) {
      if(rg.test(p)) {
        var breakdown = p.match(rg);
        var r = new RegExp(breakdown[1], breakdown[2]);
        rkeys.push(r);
      } else {
        keys.push(p);
      }
    });
    var values = _.at(obj, keys);
    _.each(values, function(v, index) {
      console.log(paths[index], v);
    });
    var keytree = _.keysDeep(obj);
    _.each(rkeys, function(rk) {
      _.each(keytree, function(k) {
        if(rk.test(k)) {
          console.log(k, _.get(obj, k));
        }
      });
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
