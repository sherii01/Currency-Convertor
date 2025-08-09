const url = "https://open.er-api.com/v6/latest/USD";
const currencylistt = document.getElementById("currencyfromlist");
const currencytosel = document.getElementById("currencytoselect");
const popularitylist = document.getElementById("ulpopularity");

let ratesFrom = {};
let ratesTo = {};
let ratesPKR = {};

async function loadcurrencyfrom() {
    const response = await fetch(url);
    const data = await response.json();
    ratesFrom = data.rates;

    for (let code in ratesFrom) {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = code;
        currencylistt.append(option);
    }
}

async function loadcurrencyto() {
    const response = await fetch(url);
    const data = await response.json();
    ratesTo = data.rates;

    for (let code in ratesTo) {
        const option = document.createElement("option");
        option.value = code;
        option.textContent = code;
        currencytosel.append(option);
    }
}

function convert() {
    const from = currencylistt.value;
    const to = currencytosel.value;
    const amount = parseFloat(document.getElementById("amount").value);

    if (from === "" || to === "" || isNaN(amount)) {
        document.getElementById("convertedAmount").value = "";
        return;
    }

    const usdAmount = amount / ratesFrom[from];
    const finalAmount = usdAmount * ratesTo[to];

    document.getElementById("convertedAmount").value = finalAmount.toFixed(2);
}

async function loadpoplist() {
    const response = await fetch("https://open.er-api.com/v6/latest/PKR");
    const data = await response.json();
    ratesPKR = data.rates;

    let currencyarray = [];

    for (let code in ratesPKR) {
        currencyarray.push([code, ratesPKR[code]]);
    }

    for (let i = 0; i < currencyarray.length; i++) {
        for (let j = 0; j < currencyarray.length; j++) {
            if (currencyarray[j][1] > currencyarray[i][1]) {
                let temp = currencyarray[i];
                currencyarray[i] = currencyarray[j];
                currencyarray[j] = temp;
            }
        }
    }

for (let i = 0; i < currencyarray.length; i++) {
    let currencyCode = currencyarray[i][0];
    let currencyRate = currencyarray[i][1];

    let rateInPKR = 1 / currencyRate;

    let listItem = document.createElement("li");
    listItem.textContent = `#${i + 1} ${currencyCode} — ${rateInPKR.toFixed(2)} PKR`;

    popularitylist.appendChild(listItem);
}
}


document.addEventListener("DOMContentLoaded", () => {
    loadcurrencyfrom();
    loadcurrencyto();
    loadpoplist();
});


currencylistt.addEventListener("change", convert);
currencytosel.addEventListener("change", convert);
document.getElementById("amount").addEventListener("input", convert);
