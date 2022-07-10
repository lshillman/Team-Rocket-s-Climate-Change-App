console.log("I'm a JavaScript file linked to this page!");
var fetchBtn = document.getElementById("government")

function getFucked() {
    console.log("I'm in the getFucked function");
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

// fetchBtn.addEventListener('click', getFucked)

getFucked();