// Usage:
document.getElementById('_option').addEventListener('click', function () {
  toggle(document.querySelectorAll('.control-sidebar'))
})

function toggle (elements, specifiedDisplay) {
  var element, index

  elements = elements.length ? elements : [elements]
  for (index = 0; index < elements.length; index++) {
    element = elements[index]

    if (isElementHidden(element)) {
      element.style.display = ''

      // If the element is still hidden after removing the inline display
      if (isElementHidden(element)) {
        element.style.display = specifiedDisplay || 'block'
      }
    } else {
      element.style.display = 'none'
    }
  }
  function isElementHidden (element) {
    return window.getComputedStyle(element, null).getPropertyValue('display') === 'none'
  }
}

var type          = '';
var quantity      = 0;
var currentPageNo = 0;
var totalPages    = 0;

function getTypeAndQuantity () {
  var selectBox = document.getElementById('typeDropDown')
  type = selectBox.options[selectBox.selectedIndex].text

  quantity = document.getElementById('quantityTextBox').value;
  if (isNaN(quantity)) {
    alert('Input is not a number')
    quantity.className = ''
  }else {
    callAPIFlag = true
  }

  if (callAPIFlag) {
    setTimeout(function () {
      callAPI(1)
    }, 1000)
  }
}

function callAPI (current_page) {
  currentPageNo = current_page
  var urlPath = '/getItems'
  var xmlhttp = new XMLHttpRequest()
  var itemlist = []

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 200) {
        var res = JSON.parse(xmlhttp.responseText);
        itemlist = res.itemlist;
        totalPages = res.totalPages;
        changePage(current_page, itemlist, totalPages);
      } else if (xmlhttp.status == 400) {
        console.log('There was an error 400')
      } else {
        console.log('something else other than 200 was returned')
      }
    }
  }
  var origin = window.location.origin
  xmlhttp.open('GET', origin + urlPath + '?type=' + type + '&quantity=' + quantity + '&pageNo=' + current_page, true)
  xmlhttp.send()
}

function changePage (page, objJson, totalPages) {
  
  var listing_table = document.getElementById('listingTable');
	
  var ih1 = "<ul>";
  var ih2 = '';
  var ih3 = '';

  if (page < 1) {
    page = 1;
  }

  if (page > totalPages) {
    page = totalPages;
  }

  for (var i = 0; i < (page * 3) && i < objJson.length; i++) {
    var itemVal = objJson[i];

    ih2 = ih2 +'<li><span>'+(((page - 1) * 3) + 1 + i)+'</span>' + itemVal + '</li>';
  }
  ih3 = '</ul>';
  listing_table.innerHTML = ih1 + ih2 + ih3
  buttonsDiv.style.visibility = 'visible';
}

function prevPage () {
  if (currentPageNo != 1) {
    callAPI(currentPageNo - 1);
  }
}

function nextPage () {
  if (currentPageNo != totalPages) {
    callAPI(currentPageNo + 1);
  }
}
