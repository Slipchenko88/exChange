//courseId=5 Cash rate of PrivatBank (in the branches):
// courseId=11 Non-cash exchange rate of PrivatBank (conversion by cards, replenishment of deposits):
const pbUrl = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=11'
const monoURL = 'https://api.monobank.ua/bank/currency'

const pb = sendGetRequest(pbUrl)
const mono = sendGetRequest(monoURL)

let setResult = () => {
    let pbResponse = JSON.parse(pb.responseText)
    let monoResponse = JSON.parse(mono.responseText)

    let {pb_eur_buy, pb_eur_sale} = extract_pb_eur(pbResponse);
    let {pb_usd_buy, pb_usd_sale} = extract_pb_usd(pbResponse);
    let {mono_eur_buy, mono_eur_sale} = extract_mono_uer(monoResponse);
    let {mono_usd_buy, mono_usd_sale} = extract_mono_usd(monoResponse);

    set_pb_values(pb_usd_buy, pb_usd_sale, pb_eur_buy, pb_eur_sale);
    set_mono_values(mono_usd_buy, mono_usd_sale, mono_eur_buy, mono_eur_sale);
}

function sendGetRequest(url) {
    let http = new XMLHttpRequest();
    http.open('GET', url, false);

    http.onload = () => {
        console.log('URL: ' + url)
        console.log('Status: ' + http.status)
        console.log('Body: ' + http.responseText)
    }
    http.send(null)
    if (http.status === 429) {
        alert('Too many requests. Try again later.')
    }
    return http

}

function extract_mono_usd(monoResponse) {
    let mono_usd = monoResponse.filter(obj => {
        return obj.currencyCodeA === 840
    })[0];

    let mono_usd_buy = formatDigits(mono_usd.rateBuy)
    let mono_usd_sale = formatDigits(mono_usd.rateSell)
    return {mono_usd_buy, mono_usd_sale};
}

function extract_mono_uer(monoResponse) {
    let mono_eur = monoResponse.filter(obj => {
        return obj.currencyCodeA === 978
    })[0];

    let mono_eur_buy = formatDigits(mono_eur.rateBuy)
    let mono_eur_sale = formatDigits(mono_eur.rateSell)
    return {mono_eur_buy, mono_eur_sale};
}

function extract_pb_usd(pbResponse) {
    let pb_usd = pbResponse.filter(obj => {
        return obj.ccy === 'USD'
    })[0];
    let pb_usd_buy = formatDigits(pb_usd.buy)
    let pb_usd_sale = formatDigits(pb_usd.sale)
    return {pb_usd_buy, pb_usd_sale};
}

function extract_pb_eur(pbResponse) {
    let pb_eur = pbResponse.filter(obj => {
        return obj.ccy === 'EUR'
    })[0];
    let pb_eur_buy = formatDigits(pb_eur.buy)
    let pb_eur_sale = formatDigits(pb_eur.sale)
    return {pb_eur_buy, pb_eur_sale};
}

function set_pb_values(pb_usd_buy, pb_usd_sale, pb_eur_buy, pb_eur_sale) {
    document.querySelector("#pb .usduahbuy").textContent = pb_usd_buy
    document.querySelector("#pb .usduahsell").textContent = pb_usd_sale
    document.querySelector("#pb .euruahbuy").textContent = pb_eur_buy
    document.querySelector("#pb .euruahsell").textContent = pb_eur_sale
}

function set_mono_values(mono_usd_buy, mono_usd_sale, mono_eur_buy, mono_eur_sale) {
    document.querySelector("#mono .usduahbuy").textContent = mono_usd_buy
    document.querySelector("#mono .usduahsell").textContent = mono_usd_sale
    document.querySelector("#mono .euruahbuy").textContent = mono_eur_buy
    document.querySelector("#mono .euruahsell").textContent = mono_eur_sale
}

function formatDigits(obj) {
    return obj.toString().substring(0, 5)
}

setTimeout(setResult, 500);






