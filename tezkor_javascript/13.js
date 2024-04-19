function ikkiYigindiRaqamlar(nums, maqsad) {  
    var yigindi = [];  
    var indekslar = [];  

    for (var x = 0; x < nums.length; x++)  
    {  
        if (yigindi[nums[x]] != null)  
        {  
            indeks = yigindi[nums[x]];  
            indekslar[0] = indeks+1;  
            indekslar[1] = x+1;  
            break;  
        }  
        else  
        {  
            yigindi[maqsad - nums[x]] = x;  
        }  
    }  
    return indekslar;  
}  

console.log(ikkiYigindiRaqamlar([10,20,10,40,50,60,70],50));
