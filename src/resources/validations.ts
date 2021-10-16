function stringHasOnlyNumbers(value: string) {
    return /^\d+$/.test(value)
}

export {
    stringHasOnlyNumbers
}