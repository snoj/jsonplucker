const commander = require('commander'),
      _ = require('lodash'),
      fs = require('fs');

_.mixin(require('lodash-flatkeystree'));

const opts = commander.version('0.3.0')
  .option('-i, --input <jsonfile>', 'JSON file input')
  .option('-p', 'Don\'t print json keys', false)
  .parse(process.argv);

function tryjson(teststring) {
  try {
    return JSON.parse(teststring);
  } catch(ex) {
    return false;
  }
};

function parse(json, paths) {
  if(!!!json) {
    console.error(json);
    throw "Invalid json";
  }

  let rg = /^\/(.+)\/([gi]*|)$/;

  let keys = [];
  let rkeys = [];

  _.each(paths, function(p) {
    if(rg.test(p)) {
      let breakdown = p.match(rg);
      let r = new RegExp(breakdown[1], breakdown[2]);
      rkeys.push(r);
    } else {
      keys.push(p);
    }
  });

  let values = _.at(json, keys);
  _.each(values, function(v, index) {
    console.log.apply(null, [paths[index], v].slice(!!opts.P));
  });
  let keytree = _.keysDeep(json);
  _.each(rkeys, function(rk) {
    _.each(keytree, function(k) {
      if(rk.test(k)) {
        console.log.apply(null, [k, _.get(json, k)].slice(!!opts.P));
      }
    });
  });
}

(async function() {
  if(opts.input) {
    parse(JSON.parse(fs.readFileSync(opts.input)), opts.args);
    return;
  } else {
    let stdinBuffer = fs.readFileSync(0);
    parse(JSON.parse(stdinBuffer.toString()), opts.args);
  }
})();
