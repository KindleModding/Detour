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
                    resolve(
                        src
                            .replace(
                                '<head></head><body><pre style="word-wrap: break-word; white-space: pre-wrap;">',
                                ""
                        )
                        .replace("</pre></body>", "")
                        .replace("<head></head><body></body>", "")
                );
            });
            setTimeout(function () {
                iframe.remove();
            }, 2000);
        });
    },
    getDirectory(loc) {
        return new Promise(function (callback) {
            _file(loc).then(function (data) {
                var files = [];
                var tagReg = new RegExp('<a(\n|.)*?(?=<\/a>)', "gim");
                var hrefReg = new RegExp('href="(\n|.)*?(?=")', "gim");
                var tagRemovalReg = new RegExp('<a(\n|.)*?>', "gim");

                var anchorTags = Array.prototype.slice.call(data.matchAll(tagReg));

                for (var i = 0; i < anchorTags.length; i++) {
                    var source = Array.prototype.slice.call(
                        anchorTags[i][0].matchAll(hrefReg)
                    );

                    files.push({
                        name: anchorTags[i][0].replace(tagRemovalReg, ""),
                        path: source[0][0].substring(6),
                    });
                }

                callback(files);
            });
        });
    },
    joinPath(one, two) {
        if (one.slice(-1) === "/") {
            one = one.slice(0, -1);
        };

        if (two.slice(0, 2) === "./") {
            two = two.slice(1);
        } else if (two[0] !== "/") {
            two = "/" + two;
        };

        return one + two;
    }
};