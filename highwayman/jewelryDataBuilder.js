import fetch from 'node-fetch'
import cheerio from 'cheerio'
import { toRange, } from './common.js'

const parseItemFromRow = ($, $row) => {
    const parseImplicitMods = () => {
        const modsHtml = $($row[3]).html()
        const modValuesHtml = $($row[4]).html()
        const implicitMods = modsHtml.split('<br>')
        const implicitModValues = modValuesHtml.split('<br>')

        return implicitMods.filter(t => t.length > 0).map((t, idx) => {
            const valueRange = toRange(implicitModValues[idx])

            return {
                mod: t,
                valueRange,
            }
        })
    }

    return {
        imageUrl: $($row[0]).find('img').prop('src'),
        name: $($row[1]).text(),
        level: Number($($row[2]).text()),
        implicitMods: parseImplicitMods(),
    }
}

const parseItemsFromTable = ($, $table) => {
    const $rows = $($table).find('tr')

    const itemSet = []
    for (let i = 1; i < $rows.length; ++i) {
        itemSet.push(parseItemFromRow($, $($rows[i]).find('td')))
    }

    return itemSet
}

const buildJewelryDatasetAsync = async () => {
    console.log('Parsing all weapon data')

    const response = await fetch('https://www.pathofexile.com/item-data/jewelry')
    const responseData = await response.text()
    const $ = cheerio.load(responseData)

    const $modSections = $('div.layoutBox1.layoutBoxFull.defaultTheme')
    console.debug(`...Found ${$modSections.length} sections.`)

    let dataset = []
    for (let i = 0; i < $modSections.length; ++i) {
        const modSectionTitle = $($modSections[i]).find('h1.topBar.last.layoutBoxTitle').text()
        const $itemDataTable = $($modSections[i]).find('table.itemDataTable').first()

        console.log(`...Parsing table "${modSectionTitle}"`)

        const itemSet = parseItemsFromTable($, $itemDataTable)

        dataset.push({
            weaponType: modSectionTitle,
            itemSet,
        })
    }

    return dataset
}

export {
    buildJewelryDatasetAsync,
}
