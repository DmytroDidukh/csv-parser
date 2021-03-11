const camelCaseKey = (key) => key
    .split(' ')
    .map((value, i) => i > 0 ? value[0].toUpperCase() + value.slice(1) : value.toLowerCase())
    .join('')

export default camelCaseKey
