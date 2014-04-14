(function() {
  chrome.management.getAll.forEach(entry(function() {
    return console.log('hello' + entry);
  }));

}).call(this);
