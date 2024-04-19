const year = 2024
function checkYear(year){
    if(year % 1 !== 0 || year <= 0){
        return false
    }
    return true
}

function checkFour(year){
    if(year % 4 !== 0){
        return false
    }
    return true
}

function checkKasaba(year){
    if(!checkYear(year)){
        return "yil notogri kiritilgan "
    }
    if(!checkFour(year)){
        return "kasaba yili emas"
    }
    return 'kasaba yili'
}

console.log(checkKasaba(year))