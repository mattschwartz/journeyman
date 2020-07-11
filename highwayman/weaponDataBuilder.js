import fetch from 'node-fetch'
import cheerio from 'cheerio'
import { toRange, } from './common.js'

const parseItemFromRow = ($, $baseRow, $secondaryRow) => {
    const $baseRowCells = $($baseRow).find('td')
    const $secondaryRowCells = $($secondaryRow).find('td')

    const parseImplicitMods = () => {
        const modsHtml = $($secondaryRowCells[0]).html()
        const modValuesHtml = $($secondaryRowCells[1]).html()
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
        imageUrl: $($baseRowCells[0]).find('img').prop('src'),
        name: $($baseRowCells[1]).text(),
        level: Number($($baseRowCells[2]).text()),
        damageRange: toRange($($baseRowCells[3]).text()),
        attacksPerSecond: Number($($baseRowCells[4]).text()),
        dps: Number($($baseRowCells[5]).text()),
        requiredStrength: Number($($baseRowCells[6]).text()),
        requiredDexterity: Number($($baseRowCells[7]).text()),
        requiredIntelligence: Number($($baseRowCells[8]).text()),
        implicitMods: parseImplicitMods(),
    }
}

const parseItemsFromTable = ($, $table) => {
    const $rows = $($table).find('tr')

    const itemSet = []
    for (let i = 2; i < $rows.length; i += 2) {
        itemSet.push(parseItemFromRow($, $($rows[i]), $($rows[i + 1])))
    }

    return itemSet
}

const buildWeaponDatasetAsync = async () => {
    console.log('Parsing all weapon data')

    const response = await fetch('https://www.pathofexile.com/item-data/weapon')
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
    buildWeaponDatasetAsync,
}
