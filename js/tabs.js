NodeList.prototype.forEach = Array.prototype.forEach;

document.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {
  setActiveTab('#intro')
  setActiveTabContent('#intro');
  document.querySelectorAll('#tabs > a').forEach(setupTabListener);
}

function setupTabListener(element) {
  element.addEventListener('click', function(event) {
    event.preventDefault();
    setActiveTab(event.target.hash)
    setActiveTabContent(event.target.hash);
  })
}

function setActiveTabContent(id) {
  document.querySelectorAll('#content > div').forEach(function(element) {
    element.classList.add('hide-tab');
  });
  document.querySelector(id).classList.remove('hide-tab');
}

function setActiveTab(id) {
  document.querySelectorAll('.highlight-tab').forEach(function(element) {
    element.classList.remove('highlight-tab');
  });
  document.querySelector('a[href="' + id + '"]').classList.add('highlight-tab');
}
