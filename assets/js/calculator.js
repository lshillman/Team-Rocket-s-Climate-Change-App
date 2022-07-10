var GDP;

// API URLS
var wbURL1 = 'http://api.worldbank.org/v2/country/';
var wbURL2 = '/indicator/NY.GDP.MKTP.CD?date=2021:2021&format=json';
var nasaURL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_masse,sy_dist+from+ps+where+upper(soltype)+like+%27%CONF%%27+and+pl_masse+between+0.5+and+2.0&format=json&api_key=7jZEPvOZP9azewBX1r9wDAR3cbPA2wfoFLewlex3"; // This was working, but then started returning CORS errors. Wheeeee!
var raURL = "https://api.richassholes.ml/current/";

var percentEl = $('#percent');
var ttlEl = $('#ttl');
var projectFunds;

var planetTable = $('#planetTable');

var candidateWorlds = [];

var richassholes = [];

var countries = [];
//['France', 'Russia', 'United States', 'United Kingdom', 'Bahamas', 'Bermuda', 'Russia']; // we'll get this from the restcountries api

function parsePlanets () {
  // This used to be a function that made an API call to the NASA exoplanet archive. That API started giving me CORS errors, so now it just parses a local JSON file I downloaded through my browser.
  var parsedPlanets = JSON.parse(planets);
  for (i=0; i < parsedPlanets.length; i++) {
      candidateWorlds.push({
          "name": parsedPlanets[i].pl_name,
          "distance": Math.floor(parsedPlanets[i].sy_dist * 3.261564), // convert parsecs to light years
          "tta": Math.floor(parsedPlanets[i].sy_dist * 3.261564) * 37.5, // assume 37.5 years per light year based on Project Hyperion timeframe
          "population": Math.floor(parsedPlanets[i].sy_dist * 3.261564) * 10000, // assume 10,000 people needed per light year
          "cost": (Math.floor(parsedPlanets[i].sy_dist * 3.261564) * 10000) * 100000000, // assume one hundred million USD per person
      })
  }
  candidateWorlds.sort((a, b) => {
    return a.distance - b.distance; // sort candidateWorlds nearest to farthest
  });

  console.log(candidateWorlds);

}










function getAssholes () {
    fetch(raURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data){
        for (i=0; i < data.length; i++) {
          richassholes.push({
            "name": data[i].name,
            "networth": data[i].networth * 1000000000
          })
    }
      console.log(richassholes);
    })
}


function validateCountry(str) {
  console.log('I am now validating the country');
  if (countries.includes(str)) {
    var countryCode = str.split(" - ")[1];
    getGDP(countryCode);
  } else {
    // console.log('You must choose a country from the list');
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


function validateFields(e) {
  e.preventDefault();
  if ((percentEl.val() > 0 && percentEl.val() <= 100) && ttlEl.val() != "select-a-timeframe") {
    calculateFunds();
  } else {
    // TODO: handle validation messages per-field
  }
}

function calculateFunds() {
  var funds = Math.floor(GDP * percentEl.val() * ttlEl.val());
  projectFunds = funds;
  console.log("Total available funds: " + funds.toLocaleString());
  renderTable();
}




function renderTable () {
  planetTable.html("");
  var lastPlanet;
  for (i=0; i < candidateWorlds.length; i++) {
      if (candidateWorlds[i].name != lastPlanet) {
          if (projectFunds >= candidateWorlds[i].cost) {
            var color = "feasible";
            var feasibility = "yes";
          } else {
            var color = "not-feasible";
            var feasibility = "no";
          }
          planetTable.append(`<tr class="border-b ` + color + `">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-700">` + candidateWorlds[i].name + `</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">` + candidateWorlds[i].distance.toLocaleString() + `</td>
          <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">` + Math.floor(candidateWorlds[i].tta).toLocaleString() + ' / ' + Math.floor(candidateWorlds[i].tta/30).toLocaleString() + ' generations' + `</td>
          <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">` + (candidateWorlds[i].cost/1000000000000).toLocaleString() + `</td>
          <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">` + candidateWorlds[i].population.toLocaleString() + `</td>
          </tr>`);
          lastPlanet = candidateWorlds[i].name;
      }

  }
}

// TODO: add this styling back in for pre-calc display: odd:bg-white even:bg-slate-50 



function init() {
  getCountries();
  parsePlanets();
}

init();


$('#searchBtn').click(validateFields);

$('#countryAutocomplete').blur(validateCountry);


accessibleAutocomplete({
  element: document.querySelector('#countryAutocomplete-container'),
  id: 'countryAutocomplete', // To match it to the existing <label>.
  source: countries,
  showAllValues: true,
  onConfirm: validateCountry,
  required: true,
  autoselect: true,
  displayMenu: 'overlay'
})