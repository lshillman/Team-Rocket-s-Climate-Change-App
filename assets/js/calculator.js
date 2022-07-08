console.log("I'm a JavaScript file linked to this CALCULATOR page!");

var countryEl = $('#country');
var country = "USA";
var GDP;
var wbURL1 = 'http://api.worldbank.org/v2/country/';
var wbURL2 = '/indicator/NY.GDP.MKTP.CD?date=2021:2021&format=json';
var testURL = 'http://api.worldbank.org/v2/country/BRA/indicator/NY.GDP.MKTP.CD?date=2021:2021&format=json';

var countries = [];
//['France', 'Russia', 'United States', 'United Kingdom', 'Bahamas', 'Bermuda', 'Russia']; // we'll get this from the restcountries api

function collectCountry () {
    country = countryEl.val()
}


// getGDP needs a three-letter ISO country code.
function getGDP() {
    fetch(wbURL1 + countryEl.val() + wbURL2)
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

function init() {
  getCountries();
}

init();

accessibleAutocomplete({
  element: document.querySelector('#countryAutocomplete'),
  id: 'countryAutocomplete', // To match it to the existing <label>.
  source: countries
})