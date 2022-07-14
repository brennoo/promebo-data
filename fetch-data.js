const puppeteer = require('puppeteer');
const agents = require('./resources/userAgents.json');
const animals = require('./resources/animals.json');

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
        // showing data as an example
        console.log("----- Avaliações à Desmama");
        console.log(data['desmama']);

        console.log("----- Índice Desmama");
        console.log(data['indiceDesmama']);

        console.log("----- Avaliações ao Sobreano");
        console.log(data['sobreano']);

        console.log("----- Índice Final");
        console.log(data['indiceFinal']);

        console.log("----- Avaliações de Carcaça por Ultrassonografia");
        console.log(data['carcaca']);

        console.log("----- Índice Bioeconômico de Carcaça");
        console.log(data['indiceCarcaca']);

        console.log("----- Avaliações de Adaptação");
        console.log(data['adaptacao']);

        console.log("----- Índice Adaptação");
        console.log(data['indiceAdaptacao']);

        await page.close();
    }
    await browser.close();
}

getPromebo();
