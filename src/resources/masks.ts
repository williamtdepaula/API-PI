function maskRemoveAllSpecialCharacters(value: string) {
    return value.replace(
        /[-.@$!%*#?'"&_/%+,;:’()<>~|\\\][{}=•√π÷×¶∆£¨¢€¥^°=%©®™✓ ]/g,
        '',
    );
}

export { maskRemoveAllSpecialCharacters }