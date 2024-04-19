const array = [1, 2, 3, 4, 2, 2, 4, 2]
const n = 2

function checkArrayNumber(n, array){
    let result = 0
    for(let a of array){
        if(a === n){
            result +=1
        }
    }
    return result
}

console.log(checkArrayNumber(n, array))
