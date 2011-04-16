
OAuth = function () {
    this.base_url = "";
    this.oauth_consumer_key = "";
    this.oauth_consumer_secret = "";
    this.oauth_token = "";
    this.oauth_token_secret = "";
    this.oauth_signature_method = "HMAC-SHA1";
    this.oauth_version = "1.0";
    this.authenticated = false;
    this.realm = "";
    this.format = ""
};
OAuth.endpoint_urls = {
    request_token: "oauth/request_token",
    authorize: "oauth/authorize",
    access_token: "oauth/access_token"
};
OAuth.prototype.setConsumerCredentials = function (b, a) {
    this.oauth_consumer_key = b;
    this.oauth_consumer_secret = a
};
OAuth.prototype.getAuthentication = function () {
    if (!this.authenticated) {
        return false
    }
    return {
        oauth_token: this.oauth_token,
        oauth_token_secret: this.ouauth_token_secret
    }
};
OAuth.prototype.setAuthentication = function (a) {
    this.oauth_token = a.oauth_token;
    this.oauth_token_secret = a.oauth_token_secret
};
OAuth.prototype.getSignatureKey = function () {
    var a = this.oauth_consumer_secret + "&" + this.oauth_token_secret;
    return a
};
OAuth.prototype.call = function (c, a, b,callbackFN) {
    return new OAuth.Request(this, c, a + this.format, b).fire(callbackFN)
};
OAuth.prototype.request_token = function () {
    //return OAuth.Util.parseRequestResult(new OAuth.Request(this, "GET", OAuth.endpoint_urls.request_token, {}).fire())
	
	try {
	new OAuth.Request(this, "GET", OAuth.endpoint_urls.request_token, {}).fire("requestTokenCB");
	}
	catch(e){alert("Error with request "+e);}
};
OAuth.prototype.access_token = function (a) {
    /*return OAuth.Util.parseRequestResult(new OAuth.Request(this, "POST", OAuth.endpoint_urls.access_token, {
        oauth_verifier: a
    }).fire())*/
	try {
	new OAuth.Request(this, "GET", OAuth.endpoint_urls.access_token, {
        oauth_verifier: a
    }).fire("accessTokenCB");
	}
	catch(e){alert("Error with access token "+e);}
};
OAuth.Request = function (a, d, b, c) {
    this.oauth = a;
    this.method = d;
    this.url = this.oauth.base_url + b;
    this.payload = OAuth.Util.cloneObject(c);
    this.params = c;
    this.params.oauth_token = this.oauth.oauth_token;
    this.params.oauth_consumer_key = this.oauth.oauth_consumer_key;
    this.params.oauth_signature_method = this.oauth.oauth_signature_method;
    this.params.oauth_version = this.oauth.oauth_version;
    this.params.oauth_timestamp = OAuth.Util.getCurrentTimeStamp();
    this.params.oauth_nonce = OAuth.Util.getNonce();
    this.params = OAuth.Util.sortCollection(this.params);
    this.sign()	
};
OAuth.Request.prototype.getSignatureBaseString = function () {
    return encodeURIComponent(this.method) + "&" + encodeURIComponent(this.url) + "&" + encodeURIComponent(this.getParameterString())
};
OAuth.Request.prototype.getParameterString = function () {
    var c = "";
    var b = 0;
    for (var a in this.params) {
        if (b > 0) {
            c += "&"
        }
        b++;
        c += encodeURIComponent(a) + "=" + encodeURIComponent(this.params[a])
    }
    return c
};
OAuth.Request.prototype.getAuthorizationHeader = function () {
    var c = 'OAuth realm="' + this.oauth.realm + '",';
    var b = 0;
    for (var a in this.params) {
        if (b > 0) {
            c += ", "
        }
        b++;
        c += encodeURIComponent(a) + '="' + encodeURIComponent(this.params[a]) + '"'
    }
    return c
};
OAuth.Request.prototype.sign = function () {
    var a;
    switch (this.oauth.oauth_signature_method) {
    default:
        a = Crypto.SHA1
    }
    this.params.oauth_signature = Crypto.util.bytesToBase64(Crypto.HMAC(a, this.getSignatureBaseString(), this.oauth.getSignatureKey(), {
        asBytes: true
    }))
};
OAuth.Request.prototype.fire = function (callbackFuncID) {
    var b = {
        Authorization: this.getAuthorizationHeader()
    };
	
    var a = new Teucer(this.url).addHeaders(b).addParams(this.params).synchronous();
/*
	if(this.method.toLowerCase()=="post")
		AppMobi.device.getRemoteData(this.url,this.method,a.parameterString,"OAuth.Util.parseRequestResult","errorcb");
	else  
		AppMobi.device.getRemoteData(this.url+"?"+a.parameterString,this.method,null,"OAuth.Util.parseRequestResult","errorcb");
	);
	return
	*/
    if (this.method == "GET") {
        a.get()
    } else {
        a.post()
    }
    return a.execute(callbackFuncID)
};
OAuth.Util = {};
OAuth.Util.sortCollection = function (d) {
    var c = [];
    for (var b in d) {
        if (d.hasOwnProperty(b)) {
            c.push(b)
        }
    }
    c.sort();
    var a = [];
    for (var b in c) {
        if (c.hasOwnProperty(b)) {
            a[c[b]] = d[c[b]]
        }
    }
    return a
};
OAuth.Util.getNonce = function () {
    return /(?:\d\.)?(\d+)/.exec(Math.random())[1]
};
OAuth.Util.getCurrentTimeStamp = function () {
    var a = Math.round(new Date().getTime() / 1000);
    return a
};
OAuth.Util.cloneObject = function (a) {
    var b = (a instanceof Array) ? [] : {};
    for (i in a) {
        if (a.hasOwnProperty(i)) {
            b[i] = a[i]
        }
    }
    return b
};
OAuth.Util.parseRequestResult = function (f) {
    var c = new Array();
    var b = new Array();
    var e = /([^&]+)/g;
    var a = new Object();
    while ((c = e.exec(f))) {
        var d = /([^=]*)=([^=]*)/g;
        b = d.exec(c[1]);
        a[b[1]] = b[2]
    }
    return a
};
Teucer = function (a) {
    this.url = a;
    this.xmlHttp = new XMLHttpRequest();
    this.asynchronous = true;
    this.method = "GET";
    this.headers = null;
    this.parameterString = "";
    this.callback = null;
    this.errorCallback = function () {}
};
Teucer.prototype.addHeaders = function (a) {
    if (typeof a == "object") {
        this.headers = a
    } else {
        throw new Error("Teucer.addHeaders espects a collection object as parameter but " + typeof a + " was given.")
    }
    return this
};
Teucer.prototype.get = function () {
    this.method = "GET";
    return this
};
Teucer.prototype.post = function () {
    this.method = "POST";
    return this
};
Teucer.prototype.synchronous = function (a) {
    if ("boolean" == typeof a) {
        this.asynchronous = !a
    } else {
        this.asynchronous = false
    }
    return this
};
Teucer.prototype.addParams = function (b) {
    if (typeof b == "object") {
        for (var a in b) {
            if (this.parameterString.length > 0) {
                this.parameterString += "&"
            }
            this.parameterString += encodeURIComponent(a) + "=" + encodeURIComponent(b[a])
        }
    } else {
        throw new Error("Teucer.addParams espects a collection object as parameter but " + typeof b + " was given.")
    }
    return this
};
Teucer.prototype.errorHandler = function (a) {
    if (typeof a == "function") {
        this.errorCallback = a
    } else {
        throw new Error("Teucer.errorHandler espects a function as parameter but " + typeof a + " was given.")
    }
    return this
};
Teucer.prototype.execute = function (d) {
    if (typeof d != "function" && typeof d != "undefined"&&typeof d !="string") {
        throw new Error("Teucer.execute espects a function as parameter but " + typeof d + " was given.")
    }
  //  if (this.method == "GET" && this.parameterString.length > 0) {
        this.url += "?" + this.parameterString
    //}

	try{
	AppMobi.device.getRemoteData(this.url,this.method,this.parameterString,d,"errorcb");
	}
	catch(e){alert("Error with remote request "+e);}
	return;
	
	
    this.xmlHttp.open(this.method, this.url, this.asynchronous);
    var b = null;
    if (this.headers) {
        for (key in this.headers) {
            this.xmlHttp.setRequestHeader(key, this.headers[key])
        }
    }
   /* if (this.method == "POST") {
        this.xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        this.xmlHttp.setRequestHeader("Content-length", this.parameterString.length);
        this.xmlHttp.setRequestHeader("Connection", "close");
        b = this.parameterString
    }*/
		
		//console.log(this.url,this.parameterString);
	
    if (this.asynchronous) {
        var a = this.errorCallback;
        this.xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status < 400) {
                    d(this.responseText)
                } else {
                    a(this.status, this.responseText)
                }
            }
        }
    }
    //this.xmlHttp.send(b);
	
    /*if (!this.asynchronous) {
        if (this.xmlHttp.status < 400) {
            return this.xmlHttp.responseText
        } else {
            var c = new Error(this.xmlHttp.responseText);
            c.number = this.xmlHttp.status;
            throw c
        }
    }*/
};

(function () {
    var c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var d = window.Crypto = {};
    var a = d.util = {
        rotl: function (h, g) {
            return (h << g) | (h >>> (32 - g))
        },
        rotr: function (h, g) {
            return (h << (32 - g)) | (h >>> g)
        },
        endian: function (h) {
            if (h.constructor == Number) {
                return a.rotl(h, 8) & 16711935 | a.rotl(h, 24) & 4278255360
            }
            for (var g = 0; g < h.length; g++) {
                h[g] = a.endian(h[g])
            }
            return h
        },
        randomBytes: function (h) {
            for (var g = []; h > 0; h--) {
                g.push(Math.floor(Math.random() * 256))
            }
            return g
        },
        bytesToWords: function (h) {
            for (var k = [], j = 0, g = 0; j < h.length; j++, g += 8) {
                k[g >>> 5] |= h[j] << (24 - g % 32)
            }
            return k
        },
        wordsToBytes: function (i) {
            for (var h = [], g = 0; g < i.length * 32; g += 8) {
                h.push((i[g >>> 5] >>> (24 - g % 32)) & 255)
            }
            return h
        },
        bytesToHex: function (g) {
            for (var j = [], h = 0; h < g.length; h++) {
                j.push((g[h] >>> 4).toString(16));
                j.push((g[h] & 15).toString(16))
            }
            return j.join("")
        },
        hexToBytes: function (h) {
            for (var g = [], i = 0; i < h.length; i += 2) {
                g.push(parseInt(h.substr(i, 2), 16))
            }
            return g
        },
        bytesToBase64: function (h) {
            if (typeof btoa == "function") {
                return btoa(e.bytesToString(h))
            }
            for (var g = [], l = 0; l < h.length; l += 3) {
                var m = (h[l] << 16) | (h[l + 1] << 8) | h[l + 2];
                for (var k = 0; k < 4; k++) {
                    if (l * 8 + k * 6 <= h.length * 8) {
                        g.push(c.charAt((m >>> 6 * (3 - k)) & 63))
                    } else {
                        g.push("=")
                    }
                }
            }
            return g.join("")
        },
        base64ToBytes: function (h) {
            if (typeof atob == "function") {
                return e.stringToBytes(atob(h))
            }
            h = h.replace(/[^A-Z0-9+\/]/ig, "");
            for (var g = [], j = 0, k = 0; j < h.length; k = ++j % 4) {
                if (k == 0) {
                    continue
                }
                g.push(((c.indexOf(h.charAt(j - 1)) & (Math.pow(2, -2 * k + 8) - 1)) << (k * 2)) | (c.indexOf(h.charAt(j)) >>> (6 - k * 2)))
            }
            return g
        }
    };
    d.mode = {};
    var b = d.charenc = {};
    var f = b.UTF8 = {
        stringToBytes: function (g) {
            return e.stringToBytes(unescape(encodeURIComponent(g)))
        },
        bytesToString: function (g) {
            return decodeURIComponent(escape(e.bytesToString(g)))
        }
    };
    var e = b.Binary = {
        stringToBytes: function (j) {
            for (var g = [], h = 0; h < j.length; h++) {
                g.push(j.charCodeAt(h))
            }
            return g
        },
        bytesToString: function (g) {
            for (var j = [], h = 0; h < g.length; h++) {
                j.push(String.fromCharCode(g[h]))
            }
            return j.join("")
        }
    }
})();
(function () {
    var f = Crypto,
        a = f.util,
        b = f.charenc,
        e = b.UTF8,
        d = b.Binary;
    var c = f.SHA1 = function (i, g) {
        var h = a.wordsToBytes(c._sha1(i));
        return g && g.asBytes ? h : g && g.asString ? d.bytesToString(h) : a.bytesToHex(h)
    };
    c._sha1 = function (o) {
        if (o.constructor == String) {
            o = e.stringToBytes(o)
        }
        var v = a.bytesToWords(o),
            x = o.length * 8,
            p = [],
            r = 1732584193,
            q = -271733879,
            k = -1732584194,
            h = 271733878,
            g = -1009589776;
        v[x >> 5] |= 128 << (24 - x % 32);
        v[((x + 64 >>> 9) << 4) + 15] = x;
        for (var z = 0; z < v.length; z += 16) {
            var E = r,
                D = q,
                C = k,
                B = h,
                A = g;
            for (var y = 0; y < 80; y++) {
                if (y < 16) {
                    p[y] = v[z + y]
                } else {
                    var u = p[y - 3] ^ p[y - 8] ^ p[y - 14] ^ p[y - 16];
                    p[y] = (u << 1) | (u >>> 31)
                }
                var s = ((r << 5) | (r >>> 27)) + g + (p[y] >>> 0) + (y < 20 ? (q & k | ~q & h) + 1518500249 : y < 40 ? (q ^ k ^ h) + 1859775393 : y < 60 ? (q & k | q & h | k & h) - 1894007588 : (q ^ k ^ h) - 899497514);
                g = h;
                h = k;
                k = (q << 30) | (q >>> 2);
                q = r;
                r = s
            }
            r += E;
            q += D;
            k += C;
            h += B;
            g += A
        }
        return [r, q, k, h, g]
    };
    c._blocksize = 16
})();
(function () {
    var e = Crypto,
        a = e.util,
        b = e.charenc,
        d = b.UTF8,
        c = b.Binary;
    e.HMAC = function (l, m, k, h) {
        if (m.constructor == String) {
            m = d.stringToBytes(m)
        }
        if (k.constructor == String) {
            k = d.stringToBytes(k)
        }
        if (k.length > l._blocksize * 4) {
            k = l(k, {
                asBytes: true
            })
        }
        var g = k.slice(0),
            n = k.slice(0);
        for (var j = 0; j < l._blocksize * 4; j++) {
            g[j] ^= 92;
            n[j] ^= 54
        }
        var f = l(g.concat(l(n.concat(m), {
            asBytes: true
        })), {
            asBytes: true
        });
        return h && h.asBytes ? f : h && h.asString ? c.bytesToString(f) : a.bytesToHex(f)
    }
})();
(function () {
    var e = Crypto,
        a = e.util,
        b = e.charenc,
        d = b.UTF8,
        c = b.Binary;
    e.PBKDF2 = function (q, o, f, t) {
        if (q.constructor == String) {
            q = d.stringToBytes(q)
        }
        if (o.constructor == String) {
            o = d.stringToBytes(o)
        }
        var s = t && t.hasher || e.SHA1,
            k = t && t.iterations || 1;

        function p(i, j) {
            return e.HMAC(s, j, i, {
                asBytes: true
            })
        }
        var h = [],
            g = 1;
        while (h.length < f) {
            var l = p(q, o.concat(a.wordsToBytes([g])));
            for (var r = l, n = 1; n < k; n++) {
                r = p(q, r);
                for (var m = 0; m < l.length; m++) {
                    l[m] ^= r[m]
                }
            }
            h = h.concat(l);
            g++
        }
        h.length = f;
        return t && t.asBytes ? h : t && t.asString ? c.bytesToString(h) : a.bytesToHex(h)
    }
})();