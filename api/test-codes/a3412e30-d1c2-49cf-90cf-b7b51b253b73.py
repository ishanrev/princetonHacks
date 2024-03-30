import sys
def printNumbers(n):
    #write your code here
    if n < 1:
        return
    # Recursive case: first call the function with n-1
    printNumbers(n-1)
    # Then print the current number
    print(n)
print(printNumbers(3))