function factorial(n){
    // Write your code here
    if (n === 0 || n === 1) {
        return 1;
    }
    // Recursive case: factorial of n is n multiplied by the factorial of n-1
    else {
        return n * factorial(n - 1);
    }
}
console.log(factorial(0))