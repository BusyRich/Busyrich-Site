var page = {
  getPageLinks: function() {
    return document.getElementById('pageLinks').getElementsByTagName('a');
  },
  getTabs: function() {
    return document.getElementById('tabs').getElementsByTagName('li');
  },
  getContentDivs: function() {
    return document.getElementById('content').children;
  }
};