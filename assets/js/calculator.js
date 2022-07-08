console.log("I'm a JavaScript file linked to this CALCULATOR page!");

var GDP;
var wbURL1 = 'http://api.worldbank.org/v2/country/';
var wbURL2 = '/indicator/NY.GDP.MKTP.CD?date=2021:2021&format=json';
var testURL = 'http://api.worldbank.org/v2/country/BRA/indicator/NY.GDP.MKTP.CD?date=2021:2021&format=json';

var countries = [];
//['France', 'Russia', 'United States', 'United Kingdom', 'Bahamas', 'Bermuda', 'Russia']; // we'll get this from the restcountries api


function validateCountry(str) {
  console.log('I am now validating the country');
  if (countries.includes(str)) {
    var countryCode = str.split(" - ")[1];
    getGDP(countryCode);
  } else {
    console.log('You must choose a country from the list');
  }

}


// getGDP needs a three-letter ISO country code.
function getGDP(countryCode) {
    fetch(wbURL1 + countryCode + wbURL2)
    // fetch(testURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data){
        console.log(data);
        GDP = data[1][0].value;
        console.log(GDP);
      })
}


function getCountries () {
  fetch('https://restcountries.com/v3.1/all?fields=name,cca3,independent')
  // fetch(testURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data){
      console.log(data);

      for (i=0; i < data.length; i++) {
        if (data[i].independent) {
          countries.push(data[i].name.common + " - " + data[i].cca3)
        }
      }
      countries.sort();
      console.log(countries);
    })
}


function executeSearch(e) {
  e.preventDefault();
  var input = $("#countryAutocomplete").val();
  var countryCode = input.split(" - ")[1];
  console.log(countryCode);
  getGDP(countryCode);
}







function init() {
  getCountries();
}

init();


$('#searchBtn').click(executeSearch);

$('#countryAutocomplete').blur(validateCountry);


accessibleAutocomplete({
  element: document.querySelector('#countryAutocomplete-container'),
  id: 'countryAutocomplete', // To match it to the existing <label>.
  source: countries,
  showAllValues: true,
  onConfirm: validateCountry,
  required: true,
  autoselect: true
})