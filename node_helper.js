/*jshint esversion: 6 */
const NodeHelper = require('node_helper');
const rq = require('request-promise');
const cheerio = require('cheerio');
const base_url = 'http://www.torrent9.biz';

module.exports = NodeHelper.create({
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_TORRENT_LIST') {
            console.log("GET_TORRENT_LIST");
            this.search();
        }
    },

    search: function () {
      var self = this;
      var search_url = base_url + '/top_torrent.php';
      var options = {
        uri: search_url,
        transform: function (body) {
          return cheerio.load(body);
        }
      };

      rq(options).then(function ($) {
          var torrents = [];
          $("table[class^='table table-striped table-bordered cust-table -table']").each(function (index, element) {
            $(this).find('tbody td').each(function (index,element) {
              var torrent = {};
              torrent.title = $(element).children('a').text();
	      if(torrent.title) {
                torrents.push(torrent);
              }
            });
           self.sendSocketNotification('TORRENT_LIST', torrents); 
        });
      });
    }
});
