public class TwoSumSolution {
    public int[] TwoSum(int[] nums, int target) {
       Dictionary<int,int> indexes = new Dictionary<int,int>();
        for(int i = 0; i < nums.Length; i++)
        {
            int requiredNum = target - nums[i];
            if(indexes.ContainsKey(requiredNum))
            {
                return new int[]{indexes[requiredNum], i};                
            }
            
            if(indexes.ContainsKey(nums[i]))
            {
                indexes[nums[i]] = i;
            }
            else
            {
                indexes.Add(nums[i], i);
            }
        }
        return new int[0];
    }
}

//Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

//You may assume that each input would have exactly one solution, and you may not use the same element twice.

//You can return the answer in any order.
