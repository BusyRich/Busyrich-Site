var bsy = {
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
    $('a[href="/' + slug + '"]').removeClass('open');
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
  loadPage: function(target, slug) {
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
  },
  openPage: function(evt) {
    evt.preventDefault();

    var target = $(evt.currentTarget);
    bsy.loadPage(target, target.attr('href'));
  },
  filterCommands: function(filter) {
    $('#commandOptions li')
      .hide()
      .removeClass('selected')
      .filter(function() {
        return $(this).text().toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      })
      .show()
      .first()
      .addClass('selected');
  },
  stopTextboxButtons: function(evt) {
    if((evt.which >= 37 && evt.which <= 40) || evt.which === 13) {
      return evt.preventDefault();
    }

    return true;
  },
  hideToolsPalette: function() {
    var toolsPalette = $('#commandPalette');
    toolsPalette.find('input').val('');
    toolsPalette.hide();
  }
};

$(document).ready(function() {
  $('#tabs li').click(bsy.selectTab);
  $('#tabs li .close-tab').click(bsy.closeTab).show();
  $('.navLinks a').click(bsy.openPage);

  $('#commandInput input').keyup(function(evt) {
    if(!bsy.stopTextboxButtons(evt)) {
      return evt.preventDefault();
    }

    bsy.filterCommands(this.value);
  }).keydown(bsy.stopTextboxButtons);

  document.onkeyup = function(evt) {
    if(evt.key === "Escape") {
      bsy.hideToolsPalette();
      return evt.preventDefault();
    }

    var toolsPalette = $('#commandPalette');

    if(evt.altKey && evt.shiftKey && evt.key.toLowerCase() === "p") {
      toolsPalette.toggle();
      
      var input = toolsPalette.find('input');
      if(toolsPalette.is(':visible')) {
        input.focus();
      } else {
        input.val('');
      }
      
      return evt.preventDefault();
    }

    if(!toolsPalette.is(':visible')) {
      return;
    }
  
    var selected = toolsPalette.find('.selected'),
        next = selected.nextAll(':visible').first(),
        prev = selected.prevAll(':visible').first();
    
    if(evt.key === "Enter") {
      var link = selected.find('a');
      bsy.loadPage(link, link.attr('href'));
      bsy.hideToolsPalette();
    }
  
    if(evt.key === "ArrowDown" && next.is('li')) {
      selected.removeClass('selected');
      next.addClass('selected');
    } else if(evt.key === "ArrowUp" && prev.is('li')) {
      selected.removeClass('selected');
      prev.addClass('selected');
    }
  
    evt.preventDefault();
  };
});
