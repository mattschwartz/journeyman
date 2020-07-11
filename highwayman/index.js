import fs from 'fs'
import { buildPrefixModDatasetAsync, buildSuffixModDatasetAsync, } from './affixDataBuilder.js'
import { buildWeaponDatasetAsync, } from './weaponDataBuilder.js'
import { buildArmorDatasetAsync, } from './armorDataBuilder.js'
import { buildJewelryDatasetAsync, } from './jewelryDataBuilder.js'

const CURRENT_GAME_VERSION = '3.11.x'
const DATA_DIR_PATH = `../resources/data/patch_${CURRENT_GAME_VERSION}`

const main = async () => {
    if (!fs.existsSync(DATA_DIR_PATH)) {
      console.debug(`Directory (${DATA_DIR_PATH}) does not exist. Creating...`)
        fs.mkdirSync(DATA_DIR_PATH, { recursive: true })
    }

    const prefixModDataSet = await buildPrefixModDatasetAsync()
    const suffixModDataset = await buildSuffixModDatasetAsync()
    const weaponDataset = await buildWeaponDatasetAsync()
    const armorDataset = await buildArmorDatasetAsync()
    const jewelryDataset = await buildJewelryDatasetAsync()

    console.debug('Saving prefix mods to file...')
    fs.writeFileSync(`${DATA_DIR_PATH}/prefix_mods.json`, JSON.stringify(prefixModDataSet, null, 2))

    console.debug('Saving suffix mods to file...')
    fs.writeFileSync(`${DATA_DIR_PATH}/suffix_mods.json`, JSON.stringify(suffixModDataset, null, 2))

    console.debug('Saving weapon data to file...')
    fs.writeFileSync(`${DATA_DIR_PATH}/weapon_data.json`, JSON.stringify(weaponDataset, null, 2))

    console.debug('Saving armor data to file...')
    fs.writeFileSync(`${DATA_DIR_PATH}/armor_data.json`, JSON.stringify(armorDataset, null, 2))

    console.debug('Saving jewelry data to file...')
    fs.writeFileSync(`${DATA_DIR_PATH}/jewelry_data.json`, JSON.stringify(jewelryDataset, null, 2))
}

main()
