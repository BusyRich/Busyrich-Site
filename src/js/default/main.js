var bsy = {
  bindLinks: function() {
    
  },
  selectTab: function(target) {
    var id = target.currentTarget || target;

    if(typeof id !== 'string') {
      id = $(id).data('tab');
    }

    $('#tabs li, #content > div').removeClass('active');
    $('#tabs li[data-tab="' + id + '"], #tab-' + id).addClass('active');
  },
  closeTab: function(evt) {
    evt.preventDefault();
  
    var target = $(evt.currentTarget),
        slug = target.attr('href').substring(1);

    $('#tabs li[data-tab="' + slug + '"], #tab-' + slug).remove();
    $('#pageLinks a[href="/' + slug + '"]').removeClass('open');
  },
  addTab: function(tab) {
    var li = $('<li/>', {
      "class": 'file-link',
      'data-tab': tab.slug,
      click: bsy.selectTab
    })
    .append($('<i/>', {
      "class": 'fas fa-file icon-file'
    }))
    .append($('<span/>', {
      text: tab.slug
    }))
    .append($('<a/>', {
      href: '#' + tab.slug,
      "class": 'close-tab',
      text: 'X',
      click: bsy.closeTab
    }))
    .appendTo('#tabs');

    $('<div/>', {
      id: 'tab-' + tab.slug,
      html: tab.content || tab.compiled
    })
    .appendTo('#content');
    
    bsy.selectTab(tab.slug);
  },
  openPage: function(evt) {
    evt.preventDefault();

    var target = $(evt.currentTarget);
        slug = target.attr('href');

    if(target.hasClass('open')) {
      bsy.selectTab(slug.substring(1));
    } else {
      $.ajax({
        url: slug + '?json'
      })
      .done(function(page) {
        bsy.addTab(page);
        target.addClass('open');
      });
    }
  }
};

$(document).ready(function() {
  $('#tabs li').click(bsy.selectTab);
  $('#tabs li .close-tab').click(bsy.closeTab).show();
  $('.navLinks a').click(bsy.openPage);
});