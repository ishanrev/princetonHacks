import sys
def printNumbers(n):
    #write your code here
   if n == 0:
        return ""
    # Recursive case: get the string from the previous numbers and add the current number
    return printNumbers(n - 1) + str(n)
print(printNumbers(7))