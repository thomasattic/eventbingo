/*  This is a general javascript library for miscellaneous useful functions */

//This method is used to debug the application
//Change the iDebugLevel to turn it on/off
var iDebugLevel = 1;
var dbAlert = function(message,errorLevel)
{
    try
    {
        if (errorLevel == null)
        {
            alert(message);
        }
        else
        {
            if (errorLevel <= iDebugLevel)
            {
                alert(message);
            }
        }
    }
    catch(e) {}
};

var IsNumeric = function(val) {

    if (isNaN(parseFloat(val))) 
    {
          return false;
    }
    return true
};


function Querystring(qs) { // optionally pass a querystring to parse
    this.params = new Object();
    this.get=Querystring_get;
	
    if (qs == null)
	    qs=location.search.substring(1,location.search.length);

    if (qs.length == 0) return;

// Turn <plus> back to <space>
// See: http://www.w3.org/TR/REC-html40/interact/forms.html#h-17.13.4.1
    qs = qs.replace(/\+/g, ' ');
    var args = qs.split('&'); // parse out name/value pairs separated via &
	
// split out each name=value pair
    for (var i=0;i<args.length;i++) {
	    var value;
	    var pair = args[i].split('=');
	    var name = unescape(pair[0]);

	    if (pair.length == 2)
		    value = unescape(pair[1]);
	    else
		    value = name;
		
	    this.params[name] = value;
    }
}

function Querystring_get(key, default_) {
    // This silly looking line changes UNDEFINED to NULL
    if (default_ == null) default_ = null;
	
    var value=this.params[key];
    if (value==null) value=default_;
	
    return value;
}