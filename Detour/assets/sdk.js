/*
    Illusion (Detour) SDK
*/

var kindle = window.kindle || top.kindle;

window.detour = {
    version: 1,
    alert(text) {
        kindle.messaging.sendMessage("com.lab126.pillow", "pillowAlert", { "clientParams": { "alertId": text, "show": true } });
    },
    getFile() {

    },
    getDirectory() {

    },
    joinPath() {

    }
};