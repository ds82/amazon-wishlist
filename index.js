'use strict';

var fs     = require('fs');

var jsdom  = require('jsdom');
var $q     = require('q');

var jquery = fs.readFileSync(__dirname + '/node_modules/jquery/dist/jquery.js', 'utf-8');

var URL = {
  de: 'http://www.amazon.de/registry/wishlist/%ID%'
};

module.exports = Wishlist;

function Wishlist() {
  if (!(this instanceof Wishlist)) {
    return new Wishlist();
  }

  var pub = this;
  pub.get = get;

  function get(id, country) {
    country = country || 'de';
    var url = URL[country].replace('%ID%', id);
    return $q.nfcall(request, url);
  }

  function request(url, cb) {
    jsdom.env({
      url: url,
      src: [jquery],
      done: function(errors, window) {
        var $ = window.$;
        var links = $('#item-page-wrapper a.a-link-normal[id^="itemName_"]');

        // map is the jquery.map
        var result = Array.prototype.map.call(links, parseItem);
        cb(null, result);

        function parseItem(item, index) {
          var $item = $(item);
          return {
            href: item.href
          };
        }
      }
    });
  }

}
