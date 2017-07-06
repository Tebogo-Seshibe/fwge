const send = (function()
{
    function send(message, callback)
    {
        let xml = new XMLHttpRequest();

        xml.onreadystatechange = function onreadystatechange(e)
        {
            if (xml.readyState === xml.DONE && (xml.status === 0 || xml.status === 200))
                callback(xml.responseText);
        };

        xml.open("POST", "/", true);
        xml.setRequestHeader("Content-type", "application/json");
        message = JSON.stringify({path: message});
        console.log(message);
        xml.send(message);
    }

    return send;
})();

function parse_text(text)
{
    let info = JSON.parse(text);
    info.data = unescape(info.data);

    let response = { test: function(){}, cases: [] };

    text = info.data.split("// <border>\r\n");
    
    let setup = new Function(text[1]);
    let run = new Function(text[0]);

    console.log(setup, run);

    setup();
    run();

    return response;
}

window.onload = function onload(e)
{
    send("cases/FWGE.js", function callback(text)
    {
        console.log(parse_text(text));
    });
};