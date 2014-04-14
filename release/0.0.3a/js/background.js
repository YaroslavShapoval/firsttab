// http://paul.kinlan.me/creating-a-new-new-tab-page-for-chrome/

document.addEventListener("DOMContentLoaded", function() {
  chrome.management.getAll(getAllCallback);
});

var getAllCallback = function(list) {
  console.log('hello, chrome user!' + list);
};