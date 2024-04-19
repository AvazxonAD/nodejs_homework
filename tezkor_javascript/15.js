const array = [12, 23, 2324, 4343434213123, 3434, 343434, 213131313]

function max2(array){
    const sortArray = array.sort((a, b) => b - a);
    return sortArray[1]
}

console.log(max2(array))