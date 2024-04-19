const a = 4

function sum(a){
    let sum = 0
    for(let n = 0; n <= a; n++){
        sum += n
    }
    return sum
}

console.log(sum(a))