var util = {
  //https://stackoverflow.com/questions/2308134/trim-in-javascript-not-working-in-ie
  trimRegex: /^\s+|\s+$/g,
  hasClass: function(elm, cls) {
    return (elm.className.indexOf(cls) > -1);
  },
  addClass: function(elm, cls) {
    elm.className += ' ' + cls;
  },
  removeClass: function(elm, cls) {
    elm.className = elm.className
      .replace(cls, '')
      .replace(util.trimRegex, '');
  },
  bindEvent: function(elm, evt, funct) {
    if (elm.addEventListener) {
      elm.addEventListener(evt, funct);
    } else if (elm.attachEvent) {
      elm.attachEvent("on" + evt, funct);
    }
  },
  getEventTarget: function(evt) {
    var target = (evt.currentTarget ? evt.currentTarget : evt.srcElement);
    
    if(!target) {
      return;
    }
  
    if(target.nodeName.toLowerCase() === 'span') {
      target = target.parentNode;
    }
  
    return target;
  },
  preventDefault: function(evt) {
    if(evt.preventDefault) {
      evt.preventDefault();
    } else {
      evt.returnValue = false;
    }
  },
  //http://dean.edwards.name/weblog/2006/04/easy-xml/
  parseXML: function(xmlString) {
    var div, xmlDocument;
    div = document.createElement('div');
    div.innerHTML = '<xml>' + xmlString + '</xml>';
    document.body.appendChild(div);
  
    xmlDocument = div.firstChild.XMLDocument;
    document.body.removeChild(div);
  
    return xmlDocument.documentElement;
  },
  xmlToObj: function(xmlDocument) {
    var obj = {},
        rootChildren = xmlDocument.childNodes,
        currentNode, tagLength;
  
    for(var c = 0; c < rootChildren.length; c++) {
      currentNode = rootChildren[c];
      tagLength = currentNode.nodeName.length + 2;
  
      obj[currentNode.nodeName] = currentNode.xml.substring(
        tagLength, currentNode.xml.length - tagLength - 1);
    }
  
    return obj;
  },
  requestPage: function(slug, callback) {
    var xhttp = new XMLHttpRequest(),
        hasJSON = typeof JSON !== 'undefined';
  
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200 && this.responseText) {
        if(hasJSON) {
          callback(null, JSON.parse(this.responseText));
        } else {
          callback(null, util.xmlToObj(
            util.parseXML(this.responseText)));
        }
      }
    };
  
    xhttp.open("GET", "/" + slug + "?" + (hasJSON ? "json" : "xml&" + new Date().getTime()));
    xhttp.send();
  }
};