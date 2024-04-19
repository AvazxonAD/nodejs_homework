const array = [12, 2, 3, 4324, 34, 3,  443443434 ]

function arraySort(array){
    return array.sort((a, b) => a - b);
}

console.log(arraySort(array))