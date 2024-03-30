import sys
def factorial(n):
    #write your code here
   if n == 0 or n == 1:
        return 1
    # Recursive case: factorial of n is n multiplied by the factorial of n-1
    else:
        return n * factorial(n-1)
print(factorial(3))