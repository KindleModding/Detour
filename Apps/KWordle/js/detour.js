/*
    DetourJS
    Detour WAF Helper Script
*/

var kindle = window.kindle || top.kindle;

//Chromebar Shenanigans
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
        window.location = "file:///mnt/us/detour/index.html";
        break;
    };
  });
};

setInterval(function() { update() }, 500) //Initially
kindle.appmgr.ongo = function() { update(); }; //On Navigation
