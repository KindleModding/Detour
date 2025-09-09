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