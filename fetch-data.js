const csv = require('csv-string');
const fs = require('fs');
const puppeteer = require('puppeteer');
const agents = require('./resources/userAgents.json');
const animals = require('./resources/animals.json');

function updateCsv(name, data) {
    fs.writeFile(name, csv.stringify(data), 'utf8', function(err) {
        if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
        } else {
            console.log(`saved ${name}`);
        }
    });

}

async function getPromebo() {
    const randomUserAgent = agents[Math.floor(Math.random() * agents.length)];
    const browser = await puppeteer.launch();

    for (const animal of animals) {
        console.log(`----- Fetching data for animal ID ${animal}...`);
        const page = await browser.newPage();
        // random user agents to make bot hard to detect
        await page.setUserAgent(randomUserAgent);
        // open the animal page
        await page.goto('https://sistema.herdbook.org.br/publico/animal/' + animal);

        // extract data
        const data = await page.evaluate(() => {
            var tables = {};
            tables['desmama'] = document.querySelectorAll('table[id="result_list"]')[0].innerText;
            tables['indiceDesmama'] = document.querySelectorAll('table[id="result_list"]')[1].innerText;
            tables['sobreano'] = document.querySelectorAll('table[id="result_list"]')[2].innerText;
            tables['indiceFinal'] = document.querySelectorAll('table[id="result_list"]')[3].innerText;
            tables['carcaca'] = document.querySelectorAll('table[id="result_list"]')[4].innerText;
            tables['indiceCarcaca'] = document.querySelectorAll('table[id="result_list"]')[5].innerText;
            tables['adaptacao'] = document.querySelectorAll('table[id="result_list"]')[6].innerText;
            tables['indiceAdaptacao'] = document.querySelectorAll('table[id="result_list"]')[7].innerText;

            return tables;
        });
        // storing data as CSV
        updateCsv(`csv/${animal}-desmama.csv`, csv.parse(data['desmama']));
        updateCsv(`csv/${animal}-indiceDesmama.csv`, csv.parse(data['indiceDesmama']));
        updateCsv(`csv/${animal}-sobreano.csv`, csv.parse(data['sobreano']));
        updateCsv(`csv/${animal}-indiceFinal.csv`, csv.parse(data['indiceFinal']));
        updateCsv(`csv/${animal}-carcaca.csv`, csv.parse(data['carcaca']));
        updateCsv(`csv/${animal}-indiceCarcaca.csv`, csv.parse(data['indiceCarcaca']));
        updateCsv(`csv/${animal}-adaptacao.csv`, csv.parse(data['adaptacao']));
        updateCsv(`csv/${animal}-indiceAdaptacao.csv`, csv.parse(data['indiceAdaptacao']));

        await page.close();
    }
    await browser.close();
}

getPromebo();
