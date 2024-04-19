const number = 7

// 0 dan katta va 7 dan kichikligini tekshirish 
function checkMaxNumber(num){
    if(num <= 0 || num > 7){
        return false
    }
    return true
}
// butun ekanligini tekshirish 
function isInteger(num) {
    if(num % 1 !== 0){
        return false
    }
    return true
}

function checkWeek(num){
    if(!(checkMaxNumber(num))){
        return NaN
    }
    if(!(isInteger(num))){
        return NaN
    }
    
    if(num === 1) return 'Monday'
    if(num === 2) return 'Tuesday'
    if(num === 3) return 'Wednesday'
    if(num === 4) return 'Thursday'
    if(num === 5) return 'Friday'
    if(num === 6) return 'Saturday'
    if(num === 7) return 'Sunday'
    
}
console.log(checkWeek(number))