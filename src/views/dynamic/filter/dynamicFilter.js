export function dynamicFilter(data) {
    if (data.length > 25) {
        return data.slice(0, 25) + '...'
    } else {
        return data
    }
}