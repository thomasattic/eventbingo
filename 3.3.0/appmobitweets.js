
function Twitter(oauth_consumer_key, oauth_consumer_secret)
{
    this.oauth_signature_method = 'HMAC-SHA1';
    this.base_url = 'https://api.twitter.com/';
    this.oauth_consumer_key = oauth_consumer_key;
    this.oauth_consumer_secret = oauth_consumer_secret;
    this.format = '.xml';
}

Twitter.prototype = new OAuth();
Twitter.prototype.constructor = Twitter;


Twitter.prototype.getAuthorizationUrl = function()
{
    return this.base_url + OAuth.endpoint_urls.authorize + '?oauth_token=' + this.oauth_token;
}

Twitter.prototype.verify_credentials = function ()
{
    return this.call('GET', 'account/verify_credentials', {});
}

Twitter.prototype.rate_limit_status = function ()
{
    return this.call('GET', 'account/rate_limit_status', {});
}

Twitter.prototype.home_timeline = function ()
{
    return this.call('GET', 'statuses/home_timeline', {},"showtimeline");
}
Twitter.prototype.updateStatus=function(status)
{
   return this.call("POST",'statuses/update',{status:status},"statusupdate");
}
Twitter.prototype.createSign=function()
{
   return this.Request(this, "GET", OAuth.endpoint_urls.request_token, {});
}

