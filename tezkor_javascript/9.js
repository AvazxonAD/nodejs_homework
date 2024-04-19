const number = 1221
function checkNumber(number){
    const right = String(number).split('')
    const reverse = right.reverse()
    let check = ''
    for(let n of reverse){
        check += n 
    }
    if(number === parseInt(check)){
        return true
    } 
    return false
}

console.log(checkNumber(number))