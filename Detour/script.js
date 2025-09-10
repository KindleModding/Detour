var kindle = window.kindle || top.kindle;

//Chromebar
function update() {
  var chromebar = {
    "appId": "com.lab126.store",
    "topNavBar": {
      "template": "title",
      "title": "Detour",
      "buttons": [
        {
          "id": "KPP_MORE",
          "state": "enabled",
          "handling": "system"
        },
        {
          "id": "KPP_CLOSE",
          "state": "enabled",
          "handling": "system"
        }
      ],
    },
    "systemMenu": {
      "clientParams": {
        "profile": {
          "name": "default",
          "items": [
            {
              "id": "DETOUR_HOME",
              "state": "enabled",
              "handling": "notifyApp",
              "label": "Home",
              "position": 0
            },
            {
                "id": "DETOUR_DELETE",
                "state": "enabled",
                "handling": "notifyApp",
                "label": "Uninstall",
                "position": 1
            }
          ],
          "selectionMode": "none",
          "closeOnUse": true
        }
      }
    }
  };
  window.kindle.messaging.sendMessage("com.lab126.chromebar", "configureChrome", chromebar);

  window.kindle.messaging.receiveMessage("systemMenuItemSelected", function(type, id) {
    switch(id) {
      case "DETOUR_HOME":
        window.location = "index.html";
        break;
      case "DETOUR_DELETE":
        var url = kindle.dconfig.getValue("url.website") + "/gp/digital/juno/index.html";

        var payload = '<?xml version="1.0" encoding="UTF-8"?><response><total_count>1</total_count><items><item priority="1" type="SCFG" action="SET" key="DUMMY" is_incremental="false" sequence="0">url.store=' + url + '</item></items></response>';
        kindle.todo.scheduleItems(payload);

        window.location = "assets/uninstall.html";
        break;
    };
  });
};

update(); //Initially
kindle.appmgr.ongo = function() { update(); }; //On Navigation

//WAF Loading Parts
document.addEventListener("DOMContentLoaded", function () {
  var wafsEl = document.getElementById("wafs");
  wafsEl.innerHTML = "";

  getDirectory("file:///mnt/us/detour/apps").then(function (data) {
    for (var d = 0; d < data.length; d++) {
      (function (directory) {
        var configPath = joinPaths(directory.path, "config.xml");

        getFile(configPath).then(function (xml) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(xml, "text/xml");

          var names = doc.getElementsByTagName("name");
          var appName = null;
          for (var i = 0; i < names.length; i++) {
            if (names[i].getAttribute("xml:lang") === "en") {
              appName =
                names[i].textContent ||
                (names[i].firstChild && names[i].firstChild.nodeValue);
              break;
            };
          };

          var contents = doc.getElementsByTagName("content");
          var payload = "index.html";
          if (contents.length > 0) {
            var srcAttr = contents[0].getAttribute("src");
            if (srcAttr) payload = srcAttr;
          };

          var link = document.createElement("button");
          link.innerText = appName || directory.name;
          link.onclick = function () {
            var target = joinPaths(directory.path, payload);
            window.location.href = target;
          };

          wafsEl.appendChild(link);
        }).catch(function () {
          var link = document.createElement("button");
          link.innerText = directory.name;
          link.onclick = function () {
            window.location.href = directory.path;
          };
          wafsEl.appendChild(link);
        });
      })(data[d]);
    }
  });
});
