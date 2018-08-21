var bsy = {
  selectTab: function(target) {
    var id = target,
        currentTarget = util.getEventTarget(target),
        tabs = page.getTabs(),
        contentDivs = page.getContentDivs();
    
    if(currentTarget) {
      id = currentTarget.getAttribute('data-tab');
    }
  
    var tab, div;
    for(var t = 0; t < tabs.length; t++) {
      tab = tabs[t];
      div = contentDivs[t];
  
      if(tab) {
        util.removeClass(tab, 'active');
  
        if(tab.getAttribute('data-tab') === id) {
          util.addClass(tab, 'active');
        }
      }
  
      if(div) {
        util.removeClass(div, 'active');
  
        if(div.id === 'tab-' + id) {
          util.addClass(div, 'active');
        }
      }
    }
  },
  closeTab: function(evt) {
    util.preventDefault(evt);
  
    var target = util.getEventTarget(evt),
        slug = target.getAttribute('href');
  
    if(slug.indexOf('http') > -1) {
      var hrefSplit = slug.split('/');
      slug = hrefSplit.pop();
    }

    slug = slug.substring(1);
  
    var selectedTab = document.getElementById('tab-' + slug);
    selectedTab.parentNode.removeChild(selectedTab);
  
    var tabs = page.getTabs();
    for(var t = 0; t < tabs.length; t++) {
      if(tabs[t].getAttribute('data-tab') === slug) {
        tabs[t].parentNode.removeChild(tabs[t]);
      }
    }
    
    var pageLinks = page.getPageLinks();
    for(var p = 0; p < pageLinks.length; p++) {
      if(pageLinks[p].getAttribute('href').indexOf('/' + slug) > -1) {
        util.removeClass(pageLinks[p], 'open');
      }
    }
  },
  addTab: function(tab) {
    var li = document.createElement('li');
    li.className = "file-link";
    li.setAttribute('data-tab', tab.slug);
    util.bindEvent(li, 'click', bsy.selectTab);
    
    var icon = document.createElement('i');
    icon.className = "fas fa-file icon-file";
    li.appendChild(icon);
    
    var tabText = document.createElement('span');
    tabText.appendChild(document.createTextNode(tab.slug));
    li.appendChild(tabText);
  
    var closeButton = document.createElement('a');
    closeButton.setAttribute('href', '#' + tab.slug);
    closeButton.className = "close-tab"
    closeButton.appendChild(document.createTextNode("X"));
    util.bindEvent(closeButton, 'click', bsy.closeTab);
  
    li.appendChild(closeButton);
    
    document.getElementById('tabs').appendChild(li);
    
    var tabContent = document.createElement('div');
    tabContent.id = 'tab-' + tab.slug;
    tabContent.innerHTML = tab.content || tab.compiled;
    
    document.getElementById('content').appendChild(tabContent);
    
    bsy.selectTab(tab.slug);
  },
  openPage: function(evt) {
    util.preventDefault(evt);
  
    var target = util.getEventTarget(evt);
        id = target.getAttribute('href');
    
    if(id.indexOf('http') > -1) {
      var hrefSplit = id.split('/');
      id = hrefSplit.pop();
    } else {
      id = id.substring(1);
    }
    
    if(util.hasClass(target, 'open')) {
      bsy.selectTab(id);
      return;
    }
  
    util.requestPage(id, function(err, page) {
      bsy.addTab(page);
      util.addClass(target, 'open');
    });
  },
  init: function() {
    var tabs = page.getTabs();
    for(var t = 0; t < tabs.length; tabs++) {
      util.bindEvent(tabs[t], 'click', bsy.selectTab);

      var children = tabs[t].children;
      for(var c = 0; c < children.length; c++) {
        if(util.hasClass(children[c], 'close-tab')) {
          util.bindEvent(children[c], 'click', bsy.closeTab);
          children[c].style.display = "";
        }
      }
    }

    var pageLinks = page.getPageLinks();
    for(var p = 0; p < pageLinks.length; p++) {
      util.bindEvent(pageLinks[p], 'click', bsy.openPage);
    }
  }
};

window.onload = bsy.init;