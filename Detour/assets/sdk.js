/*
    Simple Detour SDK 
*/

var kindle = window.kindle || top.kindle;

window.detour = {
    version: 1,
    getFile(url) {
        return new Promise(function (resolve) {
            var iframe = document.createElement("iframe");
            iframe.src = url;
            document.body.appendChild(iframe);

            iframe.addEventListener("load", function (e) {
                var src = e.target.contentDocument.documentElement.innerHTML;
                e.target.remove();

                src = src
                    .replace('<head></head><body><pre style="word-wrap: break-word; white-space: pre-wrap;">', "")
                    .replace("</pre></body>", "")
                    .replace("<head></head><body></body>", "");

                resolve(src);
            });

            setTimeout(function () {
                if (iframe.parentNode) iframe.remove();
            }, 2000);
        });
    },
    getDirectory(loc) {
        return new Promise(function (resolve) {
            window.detour.getFile(loc).then(function (data) {
                var files = [];
                var tagReg = /<a(\n|.)*?(?=<\/a>)/gim;
                var hrefReg = /href="(\n|.)*?(?=")/gim;
                var tagRemovalReg = /<a(\n|.)*?>/gim;

                var anchorTags = Array.from(data.matchAll(tagReg));

                for (var i = 0; i < anchorTags.length; i++) {
                    var source = Array.from(anchorTags[i][0].matchAll(hrefReg));
                    files.push({
                        name: anchorTags[i][0].replace(tagRemovalReg, ""),
                        path: source[0][0].substring(6) 
                    });
                }

                resolve(files);
            }).catch(function (err) {
                console.error("Error reading directory:", err);
                resolve([]);
            });
        });
    },
    joinPaths(one, two) {
        if (one.slice(-1) === "/") one = one.slice(0, -1);
        if (two.slice(0, 2) === "./") two = two.slice(1);
        else if (two[0] !== "/") two = "/" + two;
        return one + two;
    }
};
