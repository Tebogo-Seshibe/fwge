window.onload = function onload(e)
{
    [].slice.call(document.getElementsByTagName('span')).forEach(function forEach(item, index)
    {
        if (item.className === 'open' || item.className === 'closed')
        {
            item.onclick = function onclick(e)
            {
                this.className = this.className === 'open' ? 'closed' : 'open';
                this.nextSibling.nextSibling.className = this.className;

                if (this.className === 'closed')
                {
                    var collection = this.nextSibling.nextSibling.children;

                    for (var i = 0; i < collection.length; ++i)
                        if (!!collection[i].children[1] && collection[i].children[1].className === 'open')
                            collection[i].children[1].click();
                }
            };
        }
    });
};