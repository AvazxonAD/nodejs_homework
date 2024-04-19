const a = 11111

function numberSum(a){
    let sum = 0
    let array = String(a).split('')
    for(let n of array){
        sum += parseInt(n)
    }
    return sum
}

console.log(numberSum(a))