public class Solution {
    public int SearchInsert(int[] nums, int target) {
        List<int> numsList = nums.ToList();
        if (numsList.IndexOf(target) != -1){
            return numsList.IndexOf(target);
        }
        for (int i = 0; i< nums.Length; i++){
            if (nums[i]>target){
                return i;
                break;
            }
        }
            return nums.Length;
    }
}

//Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.
