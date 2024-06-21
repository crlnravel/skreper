import puppeteer from "puppeteer";
import fs from 'fs';

const sleep = ms => new Promise(r => setTimeout(r, ms));

const saveData = (data) => {
    let csv = data.join('\n') + '\n'

    fs.appendFile('data-pertanyaan.csv', csv, 'utf8', (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('File saved')
        }
    })
}

/**
 * @param {number} startPage
 * @param {number} endPage
 */
export const scrape = async (startPage, endPage) => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.setGeolocation({latitude: -6.1944, longitude: 106.8229})

    const url = 'https://www.hukumonline.com'

    await page.goto(url + '/klinik/arsip/')

    let data = []

    for (let i = startPage; i <= endPage; i++) {
        try {
            await sleep(1000)

            if (i !== 1) {
                await page.goto(url + '/klinik/arsip/page/' + i + '/')
            }

            if (i % 3 === 0) {
                saveData(data)
                data = []
            }

            await page.waitForSelector('.klinik-list')

            const elemList = await page.$$('.klinik-list > a')
            const links = []

            for (const elem of elemList) {
                const href = await elem.evaluate(el => el.getAttribute('href'))
                links.push(href)
            }

            for (const link of links) {
                try {
                    await page.goto(url + link)

                    let pertanyaanElem = await page.waitForSelector('.e1vjmfpm0')

                    let pertanyaan = await pertanyaanElem.evaluate(el => el.textContent.trim())
                    data.push(`'${pertanyaan}'`)
                } catch (ignored) {
                    fs.appendFile('skipped.txt', url + link + '\n', 'utf8', (err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(`Can't access: ${url + link}`)
                        }
                    })
                }

            }
        } catch (e) {
            fs.appendFile('skippedPage.txt', url + '/klinik/arsip/page/' + i + '/\n', 'utf8', (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(`Can't access page ${i}`)
                }
            })
        }
    }
    await browser.close()

    saveData(data)
}

/**
 * @param {Array<string>} pages
 */
export const tryScrapePage = async (pages) => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.setGeolocation({latitude: -6.1944, longitude: 106.8229})

    const url = 'https://www.hukumonline.com'

    let data = []

    let i = 0

    for (let p of pages) {
        try {
            await sleep(1000)

            i++;

            await page.goto(p)

            if (i % 10 === 0) {
                saveData(data)
                data = []
            }

            await page.waitForSelector('.klinik-list')

            const elemList = await page.$$('.klinik-list > a')
            const links = []

            for (const elem of elemList) {
                const href = await elem.evaluate(el => el.getAttribute('href'))
                links.push(href)
            }

            for (const link of links) {
                try {
                    await page.goto(url + link)

                    let pertanyaanElem = await page.waitForSelector('.e1vjmfpm0')

                    let pertanyaan = await pertanyaanElem.evaluate(el => el.textContent.trim())
                    data.push(`'${pertanyaan}'`)
                } catch (ignored) {
                    fs.appendFile('skipped.txt', url + link + '\n', 'utf8', (err) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(`Can't access: ${url + link}`)
                        }
                    })
                }

            }
        } catch (e) {
            fs.appendFile('skippedPage.txt', url + '/klinik/arsip/page/' + i + '/\n', 'utf8', (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(`Can't access page ${i}`)
                }
            })
        }
    }
    await browser.close()

    saveData(data)
}

/**
 * @param {Array<string>} links
 */
export const tryScrapeLinks = async (links) => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.setGeolocation({latitude: -6.1944, longitude: 106.8229})

    const url = 'https://www.hukumonline.com'

    let data = []

    let i = 0

    for (let link of links) {
        try {
            await sleep(1000)

            i++;

            if (i % 10 === 0) {
                saveData(data)
                data = []
            }

            await page.goto(link)

            let pertanyaanElem = await page.waitForSelector('.e1vjmfpm0')

            let pertanyaan = await pertanyaanElem.evaluate(el => el.textContent.trim())
            data.push(`'${pertanyaan}'`)
        } catch (ignored) {
            fs.appendFile('skipped.txt', url + link + '\n', 'utf8', (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(`Can't access: ${url + link}`)
                }
            })
        }
    }
    await browser.close()

    saveData(data)
}