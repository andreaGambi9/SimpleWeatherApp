/*SEARCH BY USING A CITY NAME (e.g. athens) OR A COMMA-SEPARATED CITY NAME ALONG WITH THE COUNTRY CODE (e.g. athens,gr)*/
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
/*SUBSCRIBE HERE FOR API KEY: https://home.openweathermap.org/users/sign_up*/
const apiKey = "667e47915f0f585facc52d207361325f";

form.addEventListener("submit", e => {
    e.preventDefault();
    let inputVal = input.value;

    //check if there's already a city
    const listItems = list.querySelectorAll(".ajax-section .city");
    const listItemsArray = Array.from(listItems);

    if (listItemsArray.length > 0) {
        const filteredArray = listItemsArray.filter(el => {
        let content = "";
        //athens,gr
        if (inputVal.includes(",")) {
            //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
            if (inputVal.split(",")[1].length > 2) {
            inputVal = inputVal.split(",")[0];
            content = el
                .querySelector(".city-name span")
                .textContent.toLowerCase();
            } else {
            content = el.querySelector(".city-name").dataset.name.toLowerCase();
            }
        } else {
            //athens
            content = el.querySelector(".city-name span").textContent.toLowerCase();
        }
        
        return content == inputVal.toLowerCase();
        });

        

        if (filteredArray.length > 0) {
        msg.textContent = `You already know the weather for ${
            filteredArray[0].querySelector(".city-name span").textContent
        } ...try specifying the postcode`;
        form.reset();
        input.focus();
        return;
        }
    }

    //ajax here
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
        const { main, name, sys, weather, timezone } = data;
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
            weather[0]["icon"]
        }.svg`;

        var currentDate = new Date();
        console.log(timezone);
        
        if(((timezone/3600) % Math.trunc(timezone/3600) == 0) || timezone == 0){
            console.log("entro 1");
            if((currentDate.getHours() - 2 + (timezone/3600)) < 0){
                ore = 24 - (currentDate.getHours() - 2 + (timezone/3600));
            }else if((currentDate.getHours() - 2 + (timezone/3600)) > 23){
                ore = (currentDate.getHours() - 2 + (timezone/3600)) - 24;
            }else{
                ore = (timezone/3600)+ currentDate.getHours() - 2;
            }
            minuti = currentDate.getMinutes();
            if(minuti < 10){
                minuti = "0" + minuti;
            }
        }else{
            console.log("entro 2");
            if(currentDate.getMinutes() + 30 >= 60){
                ore = Math.trunc(timezone/3600) + 1;
                minuti = currentDate.getMinutes()-30;
                if(minuti < 10){
                    minuti = "0" + minuti;
                }
            }else{
                ore = Math.trunc(timezone/3600);
                minuti = currentDate.getMinutes() + 30;
            }
            if(ore < 0){
                ore = 24 - ore;
            } else if(ore > 23){
                ore = ore - 24;
            }
        }

        const li = document.createElement("li");
        li.classList.add("city");
        const markup = `
            <button class="chiudi" onclick = "chiudi(this)">X</button>
            <h2 class="city-name" data-name="${name},${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
            </h2>
            <div class="city-time"> (${ore}:${minuti})</div>
            <div class="city-temp-icon">
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
            <figure>
            <img class="city-icon" src="${icon}" alt="${weather[0]["description"]}">
            </figure>
            </div>
        `;
        console.log(Math.round(main.temp));
        if(Math.round(main.temp)<= -50){
            li.style.backgroundColor = "#D1BDFF";
        }else if(Math.round(main.temp) > -50 && Math.round(main.temp) <= -20) {
            li.style.backgroundColor = "#E2CBF7";
        }else if(Math.round(main.temp) > -20 && Math.round(main.temp) <= 0) {
            li.style.backgroundColor = "#D6F6FF";
        }else if(Math.round(main.temp) > 0 && Math.round(main.temp) <= 10) {
            li.style.backgroundColor = "#B3F5BC";
        }else if(Math.round(main.temp) > 10 && Math.round(main.temp) <= 20) {
            li.style.backgroundColor = "#F9FFB5";
        }else if(Math.round(main.temp) > 20 && Math.round(main.temp) <= 30) {
            li.style.backgroundColor = "#FFE699";
        }else if(Math.round(main.temp) > 30 && Math.round(main.temp) < 40) {
            li.style.backgroundColor = "#FCAE7C";
        }else{
            li.style.backgroundColor = "#FA9189";
        }
        li.innerHTML = markup;
        list.appendChild(li);
        

        })
        
        .catch(() => {
        msg.textContent = "Please search for a valid city";
        });
        


    msg.textContent = "";
    form.reset();
    input.focus();
}); 

const button = document.getElementById('pulisci');

button.addEventListener('click', () => {
    console.log('Hello');
    const ulElement = document.querySelector('.cities'); // select the ul element

    while (ulElement.firstChild) {
        ulElement.removeChild(ulElement.firstChild); // remove all the li elements
    }
});

button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
});

function chiudi(button) {
    var li = button.parentNode;
    li.parentNode.removeChild(li);
}



// -88 a 58 
// < -80
// < -50
// < -20
// < -10
// < 0
// < 10
// < 20
// < 30
// < 40
// > 40