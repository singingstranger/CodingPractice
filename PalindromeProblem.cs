public class Solution {
    public bool IsPalindrome(int x) {
        if (x<0 || (x%10 == 0 && x!= 0)){
            return false;
        }
        int revertedNumber = 0;
        while (x > revertedNumber)
        {
            revertedNumber = revertedNumber * 10 + x % 10;
            x /= 10;
        }
        return x == revertedNumber || x == revertedNumber/10;
    }
}
//Given an integer x, return true if x is a palindrome, and false otherwise.
