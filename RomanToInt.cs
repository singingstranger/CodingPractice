public class Solution {
    public int RomanToInt(string s) {
        char[] romanChars = s.ToArray();
        int solution = 0;
        for (int i =0; i< romanChars.Length; i++){
            switch (romanChars[i]){
            case 'I': 
                solution += 1;
                break;
            case 'V':
                solution += 5;
                break;
            case 'X':
                solution += 10;
                break;
            case 'L':
                solution += 50;
                break;
            case 'C':
                solution += 100;
                break;
            case 'D':
                solution += 500;
                break;
            case 'M':
                solution += 1000;
                break;
            default:
                solution += 0;
                break;            
            }        
        }
        if (s.Contains("CD") || s.Contains("CM"))
            solution -= 200;
        if (s.Contains("XL") || s.Contains("XC"))
            solution -= 20;
        if (s.Contains("IV") || s.Contains("IX"))
            solution -= 2;
        
    return solution;
    }
    
}

//Given a roman numeral, convert it to an integer.
