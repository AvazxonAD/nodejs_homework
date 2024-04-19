const a = 1
const b = 3
const c = -1

function checkNumber(a, b, c){
    if(a <= 0 || b <= 0 || c <= 0 ){
        return false
    }
    return true
}

function makeNumber (a, b, c){
    if(!(checkNumber(a, b, c))){
        return 0 
    }
    const aString = String(a)
    const bString = String(b)
    const cString = String(c)
    const result = aString + bString + cString 
    return result 
}

console.log(makeNumber(a, b, c))