const n = 1231431


function isInteger(n){
    if(n % 1 !== 0){
        return false
    }
    return true
}

function checkLength(n){
    if(!isInteger(n)){
        return "butun son kiriting"
    }
    const stringNumber = String(n)
    return stringNumber.length
}

console.log(checkLength(n))