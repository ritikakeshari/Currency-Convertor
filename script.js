const BASE_URL = "https://v6.exchangerate-api.com/v6/6e9fb60fff0e82706c483259/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let opt = document.createElement("option");
    opt.innerText = currCode;
    opt.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      opt.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      opt.selected = "selected";
    }

    select.appendChild(opt);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amountVal = amount.value;
  
  if (amountVal === "" || amountVal < 1) {
      amountVal = 1;
      amount.value = "1";
  }

  const URL = `${BASE_URL}/${fromCurr.value.toUpperCase()}`;

  try {
      let response = await fetch(URL);

      if (!response.ok) {
          throw new Error(`Failed to fetch exchange rate. Status: ${response.status}`);
      }

      let data = await response.json();
      let rate = data.conversion_rates[toCurr.value.toUpperCase()];

      let finalAmount = parseFloat(amountVal) * parseFloat(rate);

      msg.innerText = `${amountVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } catch (error) {
      console.error("Error fetching exchange rate:", error);
      msg.innerText = "Failed to retrieve exchange rate. Please try again later.";
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", async (e) => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});