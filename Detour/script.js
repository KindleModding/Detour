if (!window.kindle || !top.kindle) window.location = "/Detour/Detour/assets/desktop.html"; //Pages Hell...

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
              "id": "DETOUR_RELOAD",
              "state": "enabled",
              "handling": "notifyApp",
              "label": "Reload",
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
};

update(); //Initially
window.kindle.messaging.receiveMessage("systemMenuItemSelected", function(type, id) {
    switch(id) {
      case "DETOUR_RELOAD":
        window.location.reload();
        break;
      case "DETOUR_DELETE":
        var url = kindle.dconfig.getValue("url.website") + "/gp/digital/juno/index.html";

        var payload = '<?xml version="1.0" encoding="UTF-8"?><response><total_count>1</total_count><items><item priority="1" type="SCFG" action="SET" key="DUMMY" is_incremental="false" sequence="0">url.store=' + url + '</item></items></response>';
        kindle.todo.scheduleItems(payload);

        window.location = "/Detour/Detour/assets/uninstall.html";
        break;
    };
});

//Update Each Page Load
window.kindle.appmgr.ongo = function(ctx) {
  update();
  
  window.kindle.messaging.receiveMessage("systemMenuItemSelected", function(type, id) {
    switch(id) {
      case "DETOUR_RELOAD":
        window.location.reload();
        break;
      case "DETOUR_DELETE":
        var url = kindle.dconfig.getValue("url.website") + "/gp/digital/juno/index.html";

        var payload = '<?xml version="1.0" encoding="UTF-8"?><response><total_count>1</total_count><items><item priority="1" type="SCFG" action="SET" key="DUMMY" is_incremental="false" sequence="0">url.store=' + url + '</item></items></response>';
        kindle.todo.scheduleItems(payload);

        window.location = "/Detour/Detour/assets/uninstall.html";
        break;
    };
  });
};

//WAF Loading Parts
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("wafs").innerHTML = "";
    window.detour.getDirectory("file:///mnt/us/Apps").then(function (data) {
      //Grab Apps
      for (var d = 0; d < data.length; d++) {
        (function (directory) {
          window.detour.getFile(window.detour.joinPaths(directory.path, "config.xml")).then(function (xml) {
            //Parse XML
            var parser = new DOMParser();
            var doc = parser.parseFromString(xml, "text/xml");

            //Get WAF Name
            var names = doc.getElementsByTagName("name");
            var appName = null;
            for (var i = 0; i < names.length; i++) {
              if (names[i].getAttribute("xml:lang") === "en") {
                appName =
                  names[i].textContent ||
                  names[i].firstChild.nodeValue;
                break;
              }
            }

            //Get WAF Entrypoint
            var contents = doc.getElementsByTagName("content");
            var payload = "index.html"; //Fallback
            if (contents.length > 0) {
              var srcAttr = contents[0].getAttribute("src");
              if (srcAttr) {
                payload = srcAttr;
              }
            }

            //Make Button
            var link = document.createElement("button");
            link.innerText = appName || directory.name;
            link.onclick = function () {
              //Redirect
              window.location.href = window.detour.joinPaths(directory.path, payload);
            };

            //Append
            document.getElementById("wafs").appendChild(link);
          });
        })(data[d]);
      }
    });
});
