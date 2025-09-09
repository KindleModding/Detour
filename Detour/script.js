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
      case "DETOUR_DELETE":
        var url = kindle.dconfig.getValue("url.website") + "/gp/digital/juno/index.html";

        var payload = '<?xml version="1.0" encoding="UTF-8"?><response><total_count>1</total_count><items><item priority="1" type="SCFG" action="SET" key="DUMMY" is_incremental="false" sequence="0">url.store=' + url + '</item></items></response>';
        kindle.todo.scheduleItems(payload);

        window.location = "/Detour/Detour/assets/uninstall.html";
        break;
    };
});

// WAF Loading Parts
function log(msg) {
  var wafsEl = document.getElementById("wafs");
  var div = document.createElement("div");
  div.textContent = msg;
  wafsEl.appendChild(div);
}

document.addEventListener("DOMContentLoaded", function () {
  var wafsEl = document.getElementById("wafs");
  wafsEl.innerHTML = "";

  log("Detour: Starting scan of /mnt/us/Apps");

  window.detour.getDirectory("file:///mnt/us/Apps").then(function (data) {
    log("Directories found:\n" + JSON.stringify(data, null, 2));

    for (var d = 0; d < data.length; d++) {
      (function (directory) {
        log("Checking directory: " + JSON.stringify(directory));

        var configPath = window.detour.joinPaths(directory.path, "config.xml");
        log("Looking for config.xml at: " + configPath);

        window.detour.getFile(configPath).then(function (xml) {
          log("Got config.xml for " + directory.name + ":\n" + xml.substring(0, 200) + "...");

          // Parse XML
          var parser = new DOMParser();
          var doc = parser.parseFromString(xml, "text/xml");

          // Check for parse errors
          if (doc.getElementsByTagName("parsererror").length > 0) {
            log("XML parse error in " + configPath);
          }

          // Get WAF Name
          var names = doc.getElementsByTagName("name");
          var appName = null;
          for (var i = 0; i < names.length; i++) {
            log("Found <name>: " + names[i].textContent);
            if (names[i].getAttribute("xml:lang") === "en") {
              appName =
                names[i].textContent ||
                (names[i].firstChild && names[i].firstChild.nodeValue);
              break;
            }
          }
          log("Final appName: " + appName);

          // Get WAF Entrypoint
          var contents = doc.getElementsByTagName("content");
          var payload = "index.html"; // Fallback
          if (contents.length > 0) {
            var srcAttr = contents[0].getAttribute("src");
            log("Found content src: " + srcAttr);
            if (srcAttr) {
              payload = srcAttr;
            }
          }
          log("Payload for " + (appName || directory.name) + ": " + payload);

          // Make Button
          var link = document.createElement("button");
          link.innerText = appName || directory.name;
          link.onclick = function () {
            var target = window.detour.joinPaths(directory.path, payload);
            log("Redirecting to: " + target);
            window.location.href = target;
          };

          // Append
          wafsEl.appendChild(link);
          log("Button appended for " + (appName || directory.name));
        }).catch(function (err) {
          log("Error reading config.xml in " + directory.path + ": " + err);
        });
      })(data[d]);
    }
  }).catch(function (err) {
    log("Error getting directory listing: " + err);
  });
});
