// Configure a view object, to hold all our functions for dynamic updates and article-related event handlers.
var articleView = {};

articleView.render = function() {
  articles.forEach(function(a) {
    $('#articles').append(a.toHtml('#article-template'));
    $('#author-filter').append(a.toHtml('#author-filter-template'));
    if($('#category-filter option:contains("'+ a.category + '")').length === 0) {
      $('#category-filter').append(a.toHtml('#category-filter-template'));
    };
  });
};

articleView.handleAuthorFilter = function() {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      // TODO: If the select box was changed to an option that has a value, we need to hide all the articles,
      //       and then show just the ones that match for the data-author value that was selected.
      //       Use an "attribute selector" to find those articles, and fade them in for the reader.
      $('article').hide();
      $('article[data-author="' + $(this).val() + '"]').fadeIn();
    } else {
      // TODO: If the select box was changed to an option that is blank, we should
      //       show all the articles, except the one article we are using as a template.
      $('article').fadeIn();
      $('article.template').hide();
    }
    // Reset the category-filter:
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = function() {
  // TODO: Just like we do for #author-filter above, we should handle change events on the #category-filter element.
  //       When an option with a value is selected, hide all the articles, then reveal the matches.
  //       When the blank (default) option is selected, show all the articles, except for the template.
  //       Be sure to reset the #author-filter while you are at it!
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $('article[data-category="' + $(this).val() + '"]').fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    // Reset the author-filter:
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = function() {
  /* TODO: Add an event handler to .main-nav element that will power the Tabs feature.
       Clicking any .tab element should hide all the .tab-content sections, and then reveal the
       single .tab-content section that is associated with the clicked .tab element.
       So: You need to dynamically build a selector string with the correct ID, based on the
       data available to you on the .tab element that was clicked.  */

  $('.main-nav').on('click', '.tab', function() {
    $('.tab-content').hide();
    $('#' + $(this).data('content')).fadeIn();
  });

  // Let's now trigger a click on the first .tab element, to set up the page.
  $('.main-nav .tab:first').click();
};

articleView.setTeasers = function() {
  $('.article-body *:nth-of-type(n+2)').hide(); // Hide elements beyond the first 2 in any artcile body.

  // TODO: Add an event handler to reveal all the hidden elements,
  //       when the .read-on link is clicked. You can go ahead and hide the
  //       "Read On" link once it has been clicked. Be sure to prevent the default link-click action!
  //       Ideally, we'd attach this as just 1 event handler on the #articles section, and let it
  //       process any .read-on clicks that happen within child nodes.
  $('article').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    if($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

// TODO: Call all of the above functions (I mean, methods!)
  articleView.render();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
