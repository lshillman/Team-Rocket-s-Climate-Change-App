console.log("I'm a JavaScript file linked to this page!");

function getIce() {
    console.log("I'm in the getIce function");
    var iceData = 'https://global-warming.org/api/arctic-api';
    const element = document.getElementById('ice-level');

    fetch(iceData)
    .then(function (response){
        return response.json()
    })
    .then(function (data){
            console.log(data.arcticData[data.arcticData.length-1].extent)
            element.innerText = (data.arcticData[data.arcticData.length-1].extent + " million km^2");
    })

}

getIce();

var button = document.querySelector("#asshole");

button.addEventListener("click", function(individual){
    individual.preventDefault();
    window.location.href = "./calculator-2.html?user=individual"
}) 