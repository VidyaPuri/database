
export let apiServices = {
    httpGetAsync: function(theUrl,callback)
    {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (this.readyState == 4 && this.status == 200){
                callback(xmlHttp.responseText);
            }    
        }
        xmlHttp.open("GET", theUrl, true); // true for asynchronous 
        xmlHttp.send(null);
    }
}