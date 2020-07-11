import fetch from 'node-fetch'
import cheerio from 'cheerio'
import { getTableHeaders, } from './common.js'

const parseItemDataTable = ($, $table) => {
    const $rows = $($table).find('tr')

    const headers = getTableHeaders($, $rows.first())

    const result = []

    for (let i = 1; i < $rows.length; ++i) {
        const $cells = $($rows[i]).find('td')

        let rowObject = {}
        for (let j = 0; j < headers.length; ++j) {
            if ($($cells[j]).html().indexOf('<br>') !== -1) {
                rowObject[headers[j]] = $($cells[j]).html().replace('<br>', '\n')
            } else {
                rowObject[headers[j]] = $($cells[j]).text()
            }
        }
        result.push(rowObject)
    }

    return result
}

const buildPrefixModDatasetAsync = async () => {
    console.log('Parsing all prefix mods')

    const response = await fetch('https://www.pathofexile.com/item-data/prefixmod')
    const responseData = await response.text()
    const $ = cheerio.load(responseData)

    const $modSections = $('div.layoutBox1.layoutBoxFull.defaultTheme')
    console.log(`...Parsing ${$modSections.length} sections.`)

    let dataSet = []
    for (let i = 0; i < $modSections.length; ++i) {
        const modSectionTitle = $($modSections[i]).find('h1.topBar.last.layoutBoxTitle').text()
        const $itemDataTable = $($modSections[i]).find('table.itemDataTable').first()

        console.log(`...Parsing table "${modSectionTitle}"`)

        dataSet.push({
            sectionTitle: modSectionTitle,
            itemSet: parseItemDataTable($, $itemDataTable),
        })
    }
    
    return dataSet
}

const buildSuffixModDatasetAsync = async () => {
    console.log('Parsing all suffix mods')

    const response = await fetch('https://www.pathofexile.com/item-data/suffixmod')
    const responseData = await response.text()
    const $ = cheerio.load(responseData)

    const $modSections = $('div.layoutBox1.layoutBoxFull.defaultTheme')
    console.log(`...Parsing ${$modSections.length} sections.`)

    let dataSet = []
    for (let i = 0; i < $modSections.length; ++i) {
        const modSectionTitle = $($modSections[i]).find('h1.topBar.last.layoutBoxTitle').text()
        const $itemDataTable = $($modSections[i]).find('table.itemDataTable').first()

        console.log(`...Parsing table "${modSectionTitle}"`)

        dataSet.push({
            sectionTitle: modSectionTitle,
            itemSet: parseItemDataTable($, $itemDataTable),
        })
    }
    
    return dataSet
}

export {
    buildPrefixModDatasetAsync,
    buildSuffixModDatasetAsync,
}
