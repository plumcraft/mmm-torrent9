Module.register("mmm-torrent9",{
    defaults: {
        fontSize: 9,
	header: true,
        dimmed: true,
        loadingText: 'Loading...',
        topMax: 10,
        ignoreString: ["DVDRIP","2016","FRENCH","DVDSCR","720p"],
        site: "Torrent 9",

    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.torrents = [];
        this.sendSocketNotification('GET_TORRENT_LIST', {});
        var self = this;
        setInterval(function() {
            self.sendSocketNotification('GET_TORRENT_LIST', {});
        }, this.getRandomInt(50000,100000));
    },

    getDom: function() {
        var wrapper = document.createElement("div");
	if (this.config.header) {
          var header = document.createElement("header");
          header.innerHTML =  "Top " + this.config.topMax + " torrents from " + this.config.site; 
          wrapper.appendChild(header);
        }

        if (!this.torrents || this.torrents.length === 0) {
            var text = document.createElement("div");
            text.classList.add('loading');
            text.innerHTML = this.translate(this.config.loadingText);
            text.classList.add("dimmed", "light");
            wrapper.appendChild(text);
        } else if(null !== this.torrents) {
            var table = document.createElement("table");
            table.classList.add("small","table");
            var max = this.torrents.length < this.config.topMax ? this.torrents.length : this.config.topMax;
            table.appendChild(this.createLabelRow());
            for(var i = 0; i < max; i++) {
               if(this.torrents[i] != "undefined") {
                 table.appendChild(this.createDataRow(this.torrents[i],i));
               }
            }
            wrapper.appendChild(table);
        }
        return wrapper;
    },

    getStyles: function() {
        return ["font-awesome.css", "mmm-torrent9.css"];
    },

    createLabelRow: function () {
        var labelRow = document.createElement("tr");

        var nameLabel = document.createElement("th");
        nameLabel.innerHTML = "Name";
        labelRow.appendChild(nameLabel);

        return labelRow;
    },

    createDataRow: function (data,i) {
        var row = document.createElement("tr");
        
	for (var p in data) {
          var name = document.createElement("td");
          name.innerHTML = this.removeString(data[p]);
          row.style.opacity = 1.2 - (1 / this.config.topMax * i);
          row.appendChild(name);
        }
        return row;
    },

    removeString: function (data) {
        if (data % 1 !== 0) {
          for (var i = 0; i < this.config.ignoreString.length; i++) {
              data = data.replace(this.config.ignoreString[i],"");
          }
        }
        return data;
    },

    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "TORRENT_LIST"){
            this.torrents = payload;
            this.updateDom();
        }
    }
});
