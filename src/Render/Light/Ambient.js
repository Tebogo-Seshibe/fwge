function Ambient(request)
{
    var $ = this;
    
    if (!request)   request = {};
    
    request.type = "AMBIENTLIGHT";
    LightObject.call($, request);
}

