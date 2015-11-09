'use strict';
var DefaultFileDownload = function(customize) {
    return {
        progress: function (e) {},
        success: function (response) {
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(response);
            link.download = this.fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
        },
        error: function (e) {}
    };
};

var XHRDownload = function (url, fileName, FileDownload) {
    if (!url) {
        throw new Error('Need url!');
    }
    var FDownload = FileDownload || DefaultFileDownload;
    var xhr = new XMLHttpRequest();
    xhr.open("post", url, true);
    xhr.responseType = "blob";
    //xhr.overrideMimeType('text\/plain; charset=x-user-defined');

    var object = {
        xhr: xhr,
        fileName: fileName,
        url: url
    };
    var fileDownload = new FDownload();

    xhr.onload = function() {
        if (this.readyState == 4 && this.status == 200) {
            fileDownload.success.call(object, this.response);
        }
    };
    if (typeof fileDownload.progress === 'function') {
        xhr.onprogress = fileDownload.progress.bind(object);
    }

    if (typeof fileDownload.error === 'function') {
        xhr.onerror = fileDownload.error.bind(object);
    }

    var send = function() {
        xhr.send();
    };

    return {
        send: send
    };
};