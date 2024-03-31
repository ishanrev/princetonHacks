function arraySum(arr){
    // Write your code here
    let sum = 0;
    for(let x of arr){
        sum+=x;
    }
    return sum
}
console.log(arraySum([5,10,15,20]))