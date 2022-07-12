// API URLS
var wbURL1 = 'https://api.worldbank.org/v2/country/';
var wbURL2 = '/indicator/NY.GDP.MKTP.CD?date=2021:2021&format=json';
var nasaURL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,pl_masse,sy_dist+from+ps+where+upper(soltype)+like+%27%CONF%%27+and+pl_masse+between+0.5+and+2.0&format=json&api_key=7jZEPvOZP9azewBX1r9wDAR3cbPA2wfoFLewlex3"; // This was working, but then started returning CORS errors. Wheeeee!
var raURL = "https://api.richassholes.ml/current/";

var user; // the type of user, passed in as a URL parameter

// country form elements
var countryForm = $('#countryForm');
var percentEl = $('#percent');
var ttlEl = $('#ttl');

// billionnaire form elements
var individualForm = $('#individualForm');
var percentOfWealth = $('#indivPercent');
var indivTTL = $('#indivTTL');

// mission and planet section
var deetSection = $('#missionSummary')
var planetTable = $('#planetTable');

// fetched or calculated values
var GDP;
var projectFunds;
var netWorth;
var indivProjectFunds;
var totalFeasibleWorlds;

var candidateWorlds = []; // 

var richassholes = {}; // this will store names and net worths
var raNames = []; // this is names only (for the autocomplete widget)

var countries = [];

function parsePlanets () {
  // This used to be a function that made an API call to the NASA exoplanet archive. That API started giving me CORS errors, so now it just parses a local JSON file I downloaded through my browser.
  var parsedPlanets = JSON.parse(planets);
  for (i=0; i < parsedPlanets.length; i++) {
      candidateWorlds.push({
          "name": parsedPlanets[i].pl_name,
          "distance": Math.floor(parsedPlanets[i].sy_dist * 3.261564), // convert parsecs to light years
          "tta": Math.floor(parsedPlanets[i].sy_dist * 3.261564) * 37.5, // assume 37.5 years per light year based on Project Hyperion timeframe
          "population": Math.floor(parsedPlanets[i].sy_dist * 3.261564) * 10000, // assume 10,000 people needed per light year
          "cost": (Math.floor(parsedPlanets[i].sy_dist * 3.261564) * 10000) * 250000000, // assume 250 million USD per person
      })
  }
  candidateWorlds.sort((a, b) => {
    return a.distance - b.distance; // sort candidateWorlds nearest to farthest
  });
}

function checkUserType() {
    if (window.location.href.split("user=")[1] == "individual") {
        individualForm.css("display", "block");
        countryForm.css("display", "none");
        user = "individual";
        getAssholes();       
    } else {
        getCountries();
        user = "govt";
    }
}









function getAssholes () {
    fetch(raURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data){
        for (i=0; i < data.length; i++) {
          richassholes[data[i].name] = data[i].networth * 1000000000;
          raNames.push(data[i].name);
        }
      accessibleAutocomplete({
        element: document.querySelector('#personAutocomplete-container'),
        id: 'personAutocomplete',
        source: raNames,
        showAllValues: true,
        onConfirm: validatePerson,
        required: true,
        displayMenu: 'overlay'
      }); 
    })
}


function validatePerson(str) {
  console.log('I am now validating the person');
  if (richassholes[str]) {
    netWorth = richassholes[str];
    console.log(netWorth)
  } else {
    console.log('You must choose a person from the list');
  }

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
      accessibleAutocomplete({
        element: document.querySelector('#countryAutocomplete-container'),
        id: 'countryAutocomplete', // To match it to the existing <label>.
        source: countries,
        showAllValues: true,
        onConfirm: validateCountry,
        required: true,
        autoselect: true,
        displayMenu: 'overlay'
      });
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
    if (user != "individual") {
        var funds = Math.floor(GDP * (percentEl.val()/100) * ttlEl.val());
        projectFunds = funds;
        console.log("Total available funds: " + funds.toLocaleString());
    } else {
        var funds = Math.floor(netWorth * (percentOfWealth.val()/100) * indivTTL.val());
        indivProjectFunds = funds;
        console.log("Total available personal funds: " + funds.toLocaleString());
    }
    renderTable();
}




function renderTable () {
  planetTable.html("");
  var lastPlanet;
  totalFeasibleWorlds = 0;
  if (user == "individual") {
     var funds = indivProjectFunds;
  } else {
      var funds = projectFunds;
  }
  for (i=0; i < candidateWorlds.length; i++) {
      if (candidateWorlds[i].name != lastPlanet) { // make sure we aren't showing duplicate planets
          if (funds >= candidateWorlds[i].cost) {
            var feasibility = `<span class="feasible">YES</span>`;
            totalFeasibleWorlds++;
          } else {
            var feasibility = `<span class="not-feasible">NO</span>`;
          }
          planetTable.append(`<tr class="border-b odd:bg-white even:bg-slate-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-700"><a href="http://www.openexoplanetcatalogue.com/planet/` + candidateWorlds[i].name + `/" target="_blank">` + candidateWorlds[i].name + `</a></td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">` + candidateWorlds[i].distance.toLocaleString() + `</td>
          <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">` + Math.floor(candidateWorlds[i].tta).toLocaleString() + ' / ' + Math.floor(candidateWorlds[i].tta/30).toLocaleString() + ' generations' + `</td>
          <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">` + (candidateWorlds[i].cost/1000000000000).toLocaleString() + `</td>
          <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">` + candidateWorlds[i].population.toLocaleString() + `</td>
          <td class="text-sm text-gray-900 font-medium px-6 py-4 whitespace-nowrap">` + feasibility + `</td>
          </tr>`);
          lastPlanet = candidateWorlds[i].name;
      }

  }
  deetSection.html("");
  if (user != "individual"){
      deetSection.append(`<p><strong>Your GDP:</strong> ` + GDP.toLocaleString() + `</p><p><strong>Total mission funding:</strong> ` + funds.toLocaleString() + `</p><p><strong>Feasible candidate worlds:</strong> ` + totalFeasibleWorlds + `</p>`)
  } else {
      deetSection.append(`<p><strong>Your current net worth:</strong> ` + netWorth.toLocaleString() + `</p><p><strong>Total mission funding:</strong> ` + funds.toLocaleString() + `</p><p><strong>Feasible candidate worlds:</strong> ` + totalFeasibleWorlds + `</p><p class="mt-4"><em>Perhaps you should consider that a more ambitious legacy would be to <a href="https://pbarkley.github.io/Helping-Hand/" target="_blank" class="text-purple-700">save the planet we're already on</a>.</em></p>`)
  }
 }


function validateIndivFields(e) {
  e.preventDefault();
  if ((percentOfWealth.val() > 0 && percentOfWealth.val() <= 100) && indivTTL.val() != "select-a-timeframe") {
    calculateFunds();
  } else {
    // TODO: handle validation messages per-field
  }
}




function init() {
  checkUserType();
  parsePlanets();
}

init();


$('#searchBtn').click(validateFields);
$('#indivSearchBtn').click(validateIndivFields);

