const a = 7 

function checkNumber(a){
    let numbers = []
    let check = 0
    for(let n = 1; n < a; n++){
        if(a % n === 0){
            numbers.push(n)
        }
    }
    for(let number of numbers){
        check += number
    }
    if(check === a){
        return true
    }
    return false
}

console.log(checkNumber(a))