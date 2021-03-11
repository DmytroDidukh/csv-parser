const checkRequiredColumns = (arr) => (
    arr.includes('fullName') &&
    arr.includes('phone') &&
    arr.includes('email')
)

export default checkRequiredColumns
