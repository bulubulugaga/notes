# 题库
目前是来自[力扣（LeeCode）](https://leetcode-cn.com/)的一些题目
## 两数之和
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。   
你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。   
你可以按任意顺序返回答案。   
```
// 1、初步解法
var twoSum = function(nums, target) {
  for(let i = 0; i < nums.length - 1; i++) {
    for(let j = i + 1; j < nums.length; j++) {
      if(nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
};
console.log(twoSum([2, 7, 2, 11, 15], 18));   // [1, 3]
console.log(twoSum([2, 7, 2, 11, 15], 9));   // [0, 1]
console.log(twoSum([2, 7, 2, 11, 15], 1));   // undefined
```
看到来自可乐君JY的另外两种解法
```
// 2、静态哈希表
var twoSum = function(nums, target) {
  const map = new Map();
  for(let i = 0;i < nums.length;i++){
    map.set(nums[i],i);
  }
  for(let i = 0;i < nums.length;i++){
    const diff = target - nums[i];
    if(map.has(diff) && map.get(diff) !== i){
      return [i,map.get(diff)];
    }
  }
};
```
```
// 3、动态哈希表
var twoSum = function (nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const num1 = nums[i];
    const num2 = target - nums[i];
    if(map.has(num2)){
      return [map.get(num2),i];
    }else{
      map.set(num1,i);
    }
  }
};
```
## 判断回文
回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。  
```
function isReverse(num) {
  let str = num.toString();
  let flag = false;
  let arr = str.split('');
  let i = 0;
  for( ;i < Math.floor(arr.length / 2); i++ ) {
    if(arr[i] !== arr[arr.length - i - 1]) {
      // 只要不等，就推出循环
      break;
    }
  }
  if(i === Math.floor(arr.length / 2)) {
    flag = true;
  }
  return flag;
}
console.log(isReverse(123321));    // true
console.log(isReverse(1234321));    // true
console.log(isReverse(123412));    // false
console.log(isReverse(12344221));    // false

// 可直接用于字符串
console.log(isReverse('asdfdsa));    // true
console.log(isReverse('asds'));    // false
```
其他解法
```
function isReverse(x) {
  if(x<0){
    // 负数不能是回文
    return false;
  }else{
    var x2 = parseInt(x.toString().split("").reverse().join(""));
    return x2===x?true:false;
  }
}
```
```
function isReverse(x) {
  if (x < 0) return false;
  if (x < 10) return true;    // 一位为回文
  let n = 10 ** Math.floor(Math.log10(x));
  while (n > 1 && x > 0) {
    if (Math.floor(x / n) !== x % 10) return false;
    x = Math.floor((x % n) / 10);
    n /= 100;
  }
  return true;
}
```

