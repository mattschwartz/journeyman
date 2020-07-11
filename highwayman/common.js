const getTableHeaders = ($, $row) => {
    const result = []
    const headers = $($row).find('th')

    if (headers) {
        const numHeaders = headers.length
        for (let i = 0; i < numHeaders; ++i) {
            result.push($(headers[i]).text())
        }
    }

    return result
}

const toRange = (rangeText) => {
    const rangePair = (rangeText || '').split(' to ')
    
    if (rangePair.length == 2) {
        return [
            Number(rangePair[0]),
            Number(rangePair[1])
        ]
    } else {
        return [
            Number(rangeText),
            Number(rangeText),
        ]
    }
}

export {
    getTableHeaders,
    toRange,
}
