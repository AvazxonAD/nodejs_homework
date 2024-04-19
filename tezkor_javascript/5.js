const a = 1 
const b = 2 
const c = 3 
const d = 6

function checkNumber(a, b, c, d){
    if(a > 0 &&  b > 0  &&  c > 0  && d > 0){
        return true
    }
    return false
}

console.log(checkNumber(a, b, c, d))