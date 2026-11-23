const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapIcon = document.querySelector(".dropdown i");

// Populate dropdowns
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update country flag image
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Fetch exchange rate and update UI
const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1 || isNaN(amtVal)) {
        amtVal = 1;
        amount.value = "1";
    }

    const fromCode = fromCurr.value.toLowerCase();
    const toCode = toCurr.value.toLowerCase();
    const URL = `${BASE_URL}/${fromCode}.json`;

    try {
        msg.innerText = "Getting exchange rate...";
        let response = await fetch(URL);
        if (!response.ok) throw new Error("Failed to fetch rate");
        
        let data = await response.json();
        let rate = data[fromCode][toCode];

        let finalAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Error fetching exchange rate. Try again.";
        console.error(error);
    }
};

// Swap currencies when clicking the middle arrow icon
swapIcon.style.cursor = "pointer";
swapIcon.addEventListener("click", () => {
    let temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;
    updateFlag(fromCurr);
    updateFlag(toCurr);
    updateExchangeRate();
});

// Event listeners
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});