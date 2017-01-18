//http://www.javascriptkit.com/dhtmltutors/ajaxgetpost4.shtml

function ajaxRequest(){
 var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] //activeX versions to check for in IE
 if (window.ActiveXObject){ //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
  for (var i=0; i<activexmodes.length; i++){
   try{
    return new ActiveXObject(activexmodes[i])
   }
   catch(e){
    //suppress error
   }
  }
 }
 else if (window.XMLHttpRequest) // if Mozilla, Safari etc
  return new XMLHttpRequest()
 else
  return false
}

var mygetrequest = new ajaxRequest()
mygetrequest.onreadystatechange = function(){
 if (mygetrequest.readyState == 4){
  if ( mygetrequest.status == 200 || window.location.href.indexOf("http") == -1 ){
   var jsondata = eval("("+mygetrequest.responseText+")") //retrieve result as an JavaScript object
   var items = jsondata.items;
   var output = Object;
   for (var i=0; i<items.length; i++){
      output += items;
   }

   /*var output='<ul>'
   for (var i=0; i<rssentries.length; i++){
    output += '<li>'
    output += '<a href="'+rssentries[i].link+'">'
    output += rssentries[i].title+'</a>'
    output += '</li>'
   }
   output += '</ul>'
   document.getElementById("result").innerHTML=output*/
  }
  else{
   alert("An error has occured making the request")
  }
 }
}

///////RUN FUNCTION
//mygetrequest.open("GET", "javascriptkit.json", true)
//mygetrequest.send(null)