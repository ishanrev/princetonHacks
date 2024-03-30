function fibonacci(n){
    // Write your code here
    if (n === 0) {
        return 0;
    }
    if (n === 1) {
        return 1;
    }
    // Recursive case: F(n) = F(n-1) + F(n-2) for n > 1
    return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log(factorial(10))