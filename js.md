# 数组
## 数组方法
### 查找数组是否含有某元素
> const arrNaN = ['a', 2, 2, NaN, ' '];    

除了使用数组循环自己判断，用原生方法
```
// 可以查找NaN（目前唯一）
console.log(arrNaN.includes(NaN));  //true 

console.log(arrNaN.indexOf(NaN));  //-1  
console.log(arrNaN.lastIndexOf(2));  //2  从后面查找，返回元素下标  

// 回调函数，找到第一个跳出循环，返回元素
console.log(arrNaN.find(o => o === 2));  //2   
console.log(arrNaN.find(o => o === NaN));   //undefined 

// 找到第一个跳出循环，返回元素下标
console.log(arrNaN.findIndex(o => o === 2));  //1   
console.log(arrNaN.findIndex(o => o === NaN));  //-1

// 找到第一个跳出循环，返回布尔
console.log(arrNaN.some(o => o === 2));  //true   
console.log(arrNaN.some(o => o === NaN));  //false

// 一直查找，返回数组
console.log(arrNaN.filter(o => o === 2));  //[2, 2]   
console.log(arrNaN.filter(o => o === NaN));  //[]
```
### 连接数组
> const arr1 = [1, 2, 'a'];    
> const arr2 = [2, 3, NaN];    

```
console.log(arr1.concat(arr2));  //[1, 2, 'a', 2, 3, NaN]
console.log(arr1);  //[1, 2, 'a']
console.log(arr1.push.apply(arr1, arr2));  //6                           直接改变原数组
console.log(arr1);  //[1, 2, 'a', 2, 3, NaN]
console.log([...arr1, ...arr2]);  //[1, 2, "a", 2, 3, NaN, 2, 3, NaN]
console.log(arr1.splice(arr1.length, 0, ...arr2));   //[]                直接改变原数组
console.log(arr1);   //[1, 2, "a", 2, 3, NaN, 2, 3, NaN]
```
## 去除对象数组中的全空对象元素
```
let arr = [
  {name: 'aaa', number: '', compony: ''},
  {name: '', number: 2, compony: ''},
  {name: '', number: '', compony: 'aaa科技'},
  {name: '', number: '', compony: ''},
  {name: 'aaa', number: 2, compony: 'aaa科技'}
]
console.log(_.filter(arr, o => isHasEle(o)));
console.log(arr.filter(o => isHasEle(o)));
// 返回数据
    [
      {name: 'aaa', number: '', compony: ''},
      {name: '', number: 2, compony: ''},
      {name: '', number: '', compony: 'aaa科技'},
      {name: 'aaa', number: 2, compony: 'aaa科技'}
    ]
```
添加判断: 只要填写（有非空元素），其它数据也必须存在（这里用了elementUI）
```
oBtn.click = function () {
  let arr1 = arr.filter(o => isHasEle(o));
  if (arr1.length === 0) {
    // 未填写内容
    this.$message.error('请输入物品名称');
    return;
  }
  // 判断必填字段
  for(let i = 0; i < arr.length; i++) {
    if(!arr[i].name) {
      this.$message.error('请输入物品名称');
      return;
    } 
    else if (!arr[i].number) {
      this.$message.error('请输入数量');
      return;
    }
    else if (!arr[i].compony) {
      this.$message.error('请输入公司');
      return;
    }
  }
  // 进行下一步操作，如提交
  api.post(arr1).then(res => { ··· })
}
```
## 数组去重
### 一维数组
主要针对一些普通元素，以下大部分不能去除空对象，嵌套对象和数组未测试。
> let arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];     

**1、Set**  
```
function unique(arr) {
  return Array.from(new Set(arr))
}
console.log(unique(arr));
// [1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {}, {}]
// 无法去掉“{}”空对象
```

**2、Set + ...**  
```
console.log([...new Set(arr)]);
// [1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {}, {}]
```

**3、利用for嵌套for，然后splice去重**   
```
function unique(arr){            
  for(var i=0; i<arr.length; i++){
      for(var j=i+1; j<arr.length; j++){
          if(arr[i]===arr[j]){         //第一个等同于第二个，splice方法删除第二个
              arr.splice(j,1);
              j--;
          }
      }
  }
  return arr;
}
// [1, "true", true, 15, false, undefined, null, NaN, NaN, "NaN", 0, "a", {…}, {…}]     
// NaN和{}没有去重
```

**4、用indexOf**
```
function unique(arr) {
  let array = [];
  for (let i = 0; i < arr.length; i++) {
      if (array.indexOf(arr[i]) === -1) {
          array.push(arr[i])
      }
  }
  return array;
}
// [1, "true", true, 15, false, undefined, null, NaN, NaN, "NaN", 0, "a", {…}, {…}]     
// NaN和{}没有去重
```

**4、利用sort**
```
function unique(arr) {
  arr = arr.sort();
  let arrry= [arr[0]];
  for (let i = 1; i < arr.length; i++) {
      if (arr[i] !== arr[i-1]) {
          arrry.push(arr[i]);
      }
  }
  return arrry;
}
// [0, 1, 15, NaN, NaN, "NaN", {…}, {…}, "a", false, null, "true", true, undefined]
// NaN和{}没有去重
```

**5、利用includes**
```
function unique(arr) {
  var array =[];
  for(var i = 0; i < arr.length; i++) {
    if( !array.includes(arr[i])) {
      array.push(arr[i]);
    }
  }
  return array
}
// [1, "true", true, 15, false, undefined, null, NaN, "NaN", 0, "a", {…}, {…}] 
// {}没有去重
```

**6、利用filter**
```
function unique(arr) {
  return arr.filter((item, index) => {
    return arr.indexOf(item) === index;
  });
}
// [1, "true", true, 15, false, undefined, null, "NaN", 0, "a", {…}, {…}]
// 去掉了NaN，{}没有去重
```

### 多维数组
> let list = [   
> &emsp;1, 1, 5,   
> &emsp;[1, 1, 6],   
> &emsp;[1, 1, 7, [1, 1, 78]]   
> ];    

> 去重后：    
> [   
> &emsp;1, 5,   
> &emsp;[1, 6],   
> &emsp;[1, 7, [1, 78]]   
> ]; 

```
getList(arr) {
  for (let i=0; i<arr.length; i++) {
    if (Array.isArray(arr[i])) {

      arr[i] = Array.from(new Set(arr[i]))
      getList(arr[i]);
    }
  };
  arr = Array.from(new Set(arr));
  return arr
}
console.log(getList(list));
```


# Object
## Object.assign
* 简单的说就是通过复制一个或多个对象来创建一个新的对象。  
* MDN描述 用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。

示例
```
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 }
```

### 语法
> **Object.assign(target, ...sources)** 

**参数**    
target: 目标对象   
sources: 源对象   
**返回值**   
目标对象


### 相关描述

* 如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。后面的源对象的属性将类似地覆盖前面的源对象的属性。

* Object.assign 方法只会拷贝源对象自身的并且可枚举的属性到目标对象。该方法使用源对象的[[Get]]和目标对象的[[Set]]，所以它会调用相关 getter 和 setter。因此，它分配属性，而不仅仅是复制或定义新的属性。如果合并源包含getter，这可能使其不适合将新属性合并到原型中。为了将属性定义（包括其可枚举性）复制到原型，应使用Object.getOwnPropertyDescriptor()和Object.defineProperty() 。

* String类型和 Symbol 类型的属性都会被拷贝。

* 在出现错误的情况下，例如，如果属性不可写，会引发TypeError，如果在引发错误之前添加了任何属性，则可以更改target对象。

* Object.assign 不会在那些source对象值为 null或 undefined 的时候抛出错误。

* **针对深拷贝，需要使用其他办法，因为 Object.assign()拷贝的是属性值。假如源对象的属性值是一个对象的引用，那么它也只指向那个引用。也就是说，如果对象的属性值为简单类型（如string， number），通过Object.assign({},srcObj)，得到的新对象为深拷贝；如果属性值为对象或其它引用类型，那对于这个对象而言其实是浅拷贝的。**

**针对最后一条描述的示例**
```
let obj = { a: 1, b: 2, c: { d: 10 } };
let copy = Object.assign({}, obj);    

copy.a = 3;  //深拷贝
copy.c.c1 = 11;  //浅拷贝

console.log(obj);
//{ a: 1, b: 2, c: { d: 11 } }     
console.log(copy);
//{ a: 3, b: 2, c: { d: 11 } }
```

### 整体实例
1. 复制一个对象
```
const obj = { a: 1 };
const copy = Object.assign({}, obj);
console.log(copy); // { a: 1 }
```

2. 深拷贝对象属性
```
let obj = { a: 1, b: 2, c: { d: 10 } };
let copyDeep = Object.assign({}, JSON.parse(JSON.stringify(obj)));
copyDeep.a = 3;
copyDeep.c.d = 11;
console.log(obj);
//{ a: 1, b: 2, c: { d: 10 } }     
console.log(copyDeep);
//{ a: 3, b: 2, c: { d: 11 } }
```

3. 合并对象
```
const o1 = { a: 1 };
const o2 = { b: 2 };
const o3 = { c: 3 };
const obj = Object.assign(o1, o2, o3);
console.log(obj); // { a: 1, b: 2, c: 3 }
console.log(o1);  // { a: 1, b: 2, c: 3 } 注意目标对象自身也会改变。
console.log(o2);  // { b: 2 } 因为o1在第一位，如不想改变，用{}
```

4. 合并具有相同属性的对象
```
const o1 = { a: 1, b: 1, c: 1 };
const o2 = { b: 2, c: 2 };
const o3 = { c: 3 };
const obj = Object.assign({}, o1, o2, o3);
console.log(obj); // { a: 1, b: 2, c: 3 }
```

5. 继承属性和不可枚举属性是不能拷贝的
```
const obj = Object.create({foo: 1}, { // foo 是个继承属性。
  bar: {
    value: 2  // bar 是个不可枚举属性。
  },
  baz: {
    value: 3,
    enumerable: true  // baz 是个自身可枚举属性。
  }
});
const copy = Object.assign({}, obj);
console.log(copy); // { baz: 3 }
```

6. 原始类型会被包装为对象(只有字符串的包装对象才可能有自身可枚举属性)
```
const v1 = "abc";
const v2 = true;
const v3 = 10;
const v4 = Symbol("foo");
const obj = Object.assign({}, v1, null, v2, undefined, v3, v4);
// 原始类型会被包装，null 和 undefined 会被忽略。
// 这里只有字符串被包装为对象。
console.log(obj); // { "0": "a", "1": "b", "2": "c" }
```

7. 异常会打断后续拷贝任务
```
const target = Object.defineProperty({}, "foo", {
    value: 1,
    writable: false
}); // target 的 foo 属性是个只读属性。
Object.assign(target, {bar: 2}, {foo2: 3, foo: 3, foo3: 3}, {baz: 4});
// TypeError: "foo" is read-only
// 注意这个异常是在拷贝第二个源对象的第二个属性时发生的。
console.log(target.bar);  // 2，说明第一个源对象拷贝成功了。
console.log(target.foo2); // 3，说明第二个源对象的第一个属性也拷贝成功了。
console.log(target.foo);  // 1，只读属性不能被覆盖，所以第二个源对象的第二个属性拷贝失败了。
console.log(target.foo3); // undefined，异常之后 assign 方法就退出了，第三个属性是不会被拷贝到的。
console.log(target.baz);  // undefined，第三个源对象更是不会被拷贝到的。
```

## 判断对象是否有元素不为空    
全为空返回false, 含有非空元素返回true
```
// lodash.js
isHasEle(obj) {
  let flag = false;
  _.forIn(obj, value => {
    if(value || value === 0) {
      // 0保证元素可能为0的情况
      flag = true;
    }
  })
  return flag;
}
// 普通使用
function isHasEle(obj) {
  let flag = false;
  for(let key in obj) {
    if(obj[key] || obj[key] === 0) {
      flag = true;
    }
  }
  return flag;
}
console.log(isHasEle({a: '', b: ''}));  //false
console.log(isHasEle({a: 1, b: ''}));  //true
console.log(isHasEle({a: 0, b: ''}));  //true
```

## 判断对象是否为空对象
对象比较特殊，怎么判断{}。
```
console.log(!{});   //false，则直接判断{}会是true
console.log({} == {});   //false，指向的对象地址不一致
```
解决方法
```
let obj = {}
let obj1 = {
  name: "jack"
}
let obj2 = {
  [Symbol("name")]: "jack",
}
let obj3 = Object.defineProperty({}, "name", {
  value: "john",
  enumerable: false // 不可枚举
})
```

1、将对象转化为字符串，再判断该字符串是否为"{}"
```
let isEmpty = (obj) => (JSON.stringify(obj) === '{}') ? true : false;
console.log(isEmpty(obj)) // true
console.log(isEmpty(obj1)) // false
console.log(isEmpty(obj2)) // true
console.log(isEmpty(obj3)) // true
```
2、for in 循环判断
```
function isEmpty(obj) {
  for (let i in Object.keys(obj)) {
    return false;
  }
  return true;
}
console.log(isEmpty(obj)) // true
console.log(isEmpty(obj1)) // false
console.log(isEmpty(obj2)) // true
console.log(isEmpty(obj3)) // true
```
3、ES6的Object.keys()方法
```
let isEmpty = (obj) => (Object.keys(obj).length === 0) ? true : false
console.log(isEmpty(obj)) // true
console.log(isEmpty(obj1)) // false
console.log(isEmpty(obj2)) // true
console.log(isEmpty(obj3)) // true
```
由此可见，以上三种方法不能判断对象中的不可枚举属性。    

4、不可枚举    
如果对象中含有不可枚举属性，且需要找出这些属性，就可以使用 Object.getOwnPropertyNames() 和 Object.getOwnPropertySymbols()  这两个API。   
Object.getOwnPropertyNames()  返回对象中的所有属性（不包括symbol）   
Object.getOwnPropertySymbols()  只返回对象中的symbol属性   
```
function isEmpty(obj) {
  return  !Object.getOwnPropertyNames(obj).length &&  !Object.getOwnPropertySymbols(obj).length
}
console.log(isEmpty(obj)) // true
console.log(isEmpty(obj1)) // false
console.log(isEmpty(obj2)) // false
console.log(isEmpty(obj3)) // false
```
文章：[判断对象是否为空对象](https://www.cnblogs.com/feng-fengfeng/p/12409546.html)

## 原型和原型链
推荐文章：[文章一](https://blog.csdn.net/weixin_42614080/article/details/93413476) [文章二](https://segmentfault.com/a/1190000014717972)

## new操作符 
**1、new操作符用于创建一个给定的构造函数的对象实例**
```
let obj = new Base();
```
**2、new关键字进行的操作**   
* 创建一个空对象   
* 将空对象的 \__proto\__ 属性指向Base函数对象的prototype成员对象   
* 将Base函数对象的this指针替换成obj，然后调用Base函数   
* 考察第三步的返回值，如果无返回值或者返回一个非对象值，则将obj返回作为新对象；否则将返回值作为新对象返回。   

即为：
```
let obj = {};
obj.__proto__ = Base.prototype;
Base.call(obj);
```
**3、简单示例**
```
let Person = function(name, age) {
  this.name = name;
  this.age = age;
};
Person.prototype.show = function() {
  console.log(this.name, this.age);
};

// let p = new Person("bella", 10);

let p = {};
p.__proto__ = Person.prototype;
Person.call(p, "balle", 10);

console.log(p);
```
运行结果    
![运行结果](./toc/images/js/Object01.png)   

**4、实现一个new操作符**
```
function create(){
  let obj = {};   //创建一个空的对象；
  let con = [].shift.call(arguments);   //获得构造函数；
  obj.__proto__ = con.prototype;   //链接到原型，但是此时的this还没有绑定
  let result = con.apply(obj, arguments);   //绑定this，执行构造函数
  return typeof result === 'object' ? con : obj;   //确保new出来的是个对象
}
function Person(name){
  this.name = name;
}
Person.prototype.getName = function(){
  return this.name;
}
create(Person,'seven')
```
![运行结果](./toc/images/js/Object02.png)    
[].shift.call(arguments)：首先shift函数获得参数数组的第一项，并且通过call函数，改变原来shift函数的指向，使其指向arguments，并对数组的第一项进行复制。而后返回一个数组。至此完成了arguments类数组转化为数组的目的。   

参考文章：[对JS中new操作符的一些理解](https://blog.csdn.net/weixin_44015821/article/details/105783172)

# 函数
## arguments
是一个对应于传递给函数的参数的类数组**对象**。    
arguments对象不是一个 Array 。它类似于Array，但除了length属性和索引元素之外没有任何Array属性。
```
function test() {
  console.log(arguments);
}
test(1, 2, [1, 2]);
arguments.push(1);
```
![结果演示](./toc/images/js/函数01.png)     
**1、可以通过索引获取和设置arguments值。**   
```
console.log(Object.prototype.toString.call(arguments));   // "[object Arguments]"
console.log(arguments[1]);   // 2
arguments[1] = 4;
```
**2、callee值指向函数本身**
```
console.log(arguments.callee === test);   // true
```
**3、应用**
```
// 计算和
function add() {
  let sum = 0;
  for(let val of arguments) {
    if(typeof val !== 'number') {
      return '请传入数值类型';
    }
    sum += val;
  }
  return sum;
}
console.log(add(1, 2, 3, 4));
console.log(add(1, '2', 3, 4));
```
```
// 函数递归直接用函数名，但是匿名函数可以用arguments.callee
// 递归生成数组（只是一个递归示例，不考虑方法简易）
let arr = [];
(function () {
  arr.push(arguments[0]);
  if(arguments[0] === 0) return;
  arguments.callee(--arguments[0]);
})(4)
console.log(arr);   // [4, 3, 2, 1]
```
```
// 如果有固定的参数，其余不确定，可以用扩展语法（手写call、apply、bind）
// 简单示例
function test(cl, ...args) {
  console.log(cl);       // 高二一班
  console.log(args);     // ['小王，18岁', '小红，17岁']
}
test('高二一班', '小王，18岁', '小红，17岁');
```
## 闭包
闭包是指有权访问另一个函数作用域中变量的函数。   
创建闭包的最常见的方式就是在一个函数A内创建另一个函数B，通过函数B访问函数A的局部变量。

**1、优缺点**    
&emsp;优点：   
&emsp;1）读取另一个函数作用域中的变量；  
&emsp;2）让这些变量始终保持在内存中，即闭包可以使得它诞生环境一直存在。(似乎是子函数调用了父函数变量，该变量不会被销毁，会一直存在)  
&emsp;3）封装对象的私有属性和私有方法。（然后在全局作用域中通过调用闭包就能访问函数中的变量）  
&emsp;缺点：   
&emsp;由于闭包会携带包含它的函数的作用域，因此会比其他函数占用更多的内存，过度使用闭包可能会导致内存占用过多的问题。所以不能滥用闭包，否则会造成网页的性能问题，在IE中可能导致内存泄露。解决方法是，在退出函数之前，将不使用的局部变量全部删除。

**2、简单应用**
```
// 函数内部变量自增
var add = (function () {
  var counter = 0;
  return function () {return counter += 1;}
})(); 
console.log(add());   //1
console.log(add());   //2
console.log(add());   //3
```
## call apply bind
call apply bind都可以改变函数调用的this指向。
```
let obj = {
  name: '小明',
  age: 17,
  myFun: function(fm, t) {
    console.log(`${this.name} 年龄 ${this.age}，来自${fm}，去往${t}`);
  }
}
let db = {
  name: '小张',
  age: 99
} 
obj.myFun('成都', '上海');               //小明 年龄 17，来自成都，去往上海
obj.myFun.call(db,'成都','上海');　　　　 // 小张 年龄 99，来自成都，去往上海
obj.myFun.apply(db,['成都','上海']);      // 小张 年龄 99，来自成都，去往上海  
obj.myFun.bind(db,'成都','上海')();       // 小张 年龄 99，来自成都，去往上海
obj.myFun.bind(db,['成都', '上海'])();　　 // 小张 年龄 99，来自成都,上海，去往 undefined
```
call 、bind 、 apply 这三个函数的第一个参数都是 this 的指向对象，三者的参数不限定是 string 类型，允许是各种类型，包括函数 、 object 等。    
call 的参数是直接放进去的，第二第三第 n 个参数全都用逗号分隔。    
apply 的所有参数都必须放在一个数组里面传进去。       
bind 参数和 call 一样，且返回一个函数。   
如果想生成一个新的函数长期绑定某个函数给某个对象使用，则可以使用const newFn = fn.bind(thisObj);

**手写call**
```
let bar = { a: 1 };
function foo(b) {
  console.log(`${this.a} + ${b} = ${this.a + b}`)
}
foo.call(bar, 2);

// 相当于

let bar = {
  a: 1,
  foo: function (b) {
    console.log(`${this.a} + ${b} = ${this.a + b}`);
  }
}
bar.foo(2);
```

```
Function.prototype.myCall = function(context, ...args) { // 解构context 与arguments
  if(typeof this !== 'function') { // this 必须是函数
    throw new TypeError(`It's must be a function`)
  }

  if(!context) context = window; // 没有context，或者传递的是 null undefined，则重置为window
  // context = context || window;

  const fn = Symbol(); // 指定唯一属性，防止 delete 删除错误
  context[fn] = this; // 将 this 添加到 context的属性上 ( this 指向 foo )
  const result = context[fn](...args); // 直接调用context 的 fn
  delete context[fn]; // 删除掉context新增的symbol属性
  return result; // 返回返回值
}

let bar = { a: 1 };
function foo(b) {
  console.log(`${this.a} + ${b} = ${this.a + b}`)
}
foo.myCall(bar, 2);     // 1 + 2 = 3
```
**手写apply**
```
Function.prototype.myApply = function(context, args = []) { // 解构方式
  if(typeof this !== 'function') {
    throw new TypeError(`It's must be a function`)
  }
  if(!context) context = window;
  const fn = Symbol();
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
}

let bar = { a: 1 };
function foo(b) {
  console.log(`${this.a} + ${b} = ${this.a + b}`)
}
foo.myApply(bar, [2]);     // 1 + 2 = 3
```
**手写bind**
```
Function.prototype.myBind = function (context, ...args) {
  const fn = this;   // 后续返回函数内部this可能改变，所以先存一遍
  if(typeof fn !== 'function'){
      throw new TypeError('It must be a function');
  }
  if(!context) context = window;
  return function (...otherArgs) {
    // return fn.apply(context, [...args, ...otherArgs]);
    let p = Symbol();
    context[p] = fn;
    context[p](...args, ...otherArgs);
    delete context[p];
  };
};

let bar = { a: 1 };
function foo(b) {
  console.log(`${this.a} + ${b} = ${this.a + b}， ${c}， ${d}`)
}
fn = foo.myBind(bar, 2, '多个参数');
fn('aa');     // 1 + 2 = 3, 多个参数, aa
```
## 防抖节流
**2、实现**   
```
function throttled(fn, delay = 200) {
  let timer = null;
  let startTime = Date.now();
  return () => {
    let curTime = Date.now();
    let remaining = delay - (curTime - startTime);   // 从上一次到现在剩下的时间
    clearTimeout(timer);
    if(remaining <= 0) {
      fn.apply(this, arguments);
      startTime = Date.now();
    } else {
      timer = setTimeout(fn, remaining);
    }
  }
}

window.onresize = throttled(() => {
  console.log(1);
}, 1000)
```
```
function debounce(fn, delay = 200) {
  let timer = null;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  }
}

window.onresize = debounce(() => {
  console.log(1);
}, 1000)
```

# 数据存储与内存管理
## js数据类型及其存储
1、 基本数据类型：数值(number)、字符串(string)、布尔(boolean)、null、undefined、Symbol(ES6新定义)    
2、 引用数据类型：对象(数组、正则表达式、日期、函数)  

> Object分为本地对象、内置对象和宿主对象。    
> 本地对象：独立于宿主环境的ECMAScript实现提供的对象，简单的说就是ECMA定义的类。他们包括：Object&emsp;Function&emsp;Array&emsp;String&emsp;Boolean&emsp;Number&emsp;Date&emsp;RegExp&emsp;Error&emsp;EvalError&emsp;RangeError&emsp;ReferenceError&emsp;SyntaxError&emsp;TypeError&emsp;URIError，这里的String等类型是它的定义类型，如new String('str') 
```
var str1='hello';
var str2=new String("hello");
typeof str1 //string
typeof str2 //object
//如果想获取str2的字符串，可以通过str2.toString()
str1 instanceof String //false
str2 instanceof String //true
```
> 内置对象：定义：“由ECMAScript实现提供的、独立于宿主环境的所有对象，在ECMAScript程序开始执行时出现”。这意味着开发者不必明确实例化内置对象，它已经被实例化了。内置对象只有两个 Global和 Math,他们其实也是本地对象，根据定义每个内置对象都是本地对象。    
> 宿主对象：所有非本地对象都是宿主对象，即由ECMAScript实现的宿主环境提供的对象。所有 BOM和 DOM对象都是宿主对象。

基本数据类型保存在栈内存，引用类型保存在堆内存中。根本原因在于保存在栈内存的必须是大小固定的数据，引用类型的大小不固定，只能保存在堆内存中，但是可以把它的地址写在栈内存中以供我们访问。   

如果是基本数据类型，则按值访问，操作的就是变量保存的值；如果是引用类型的值，我们只是通过保存在变量中的引用类型的地址来操作实际对象。

```
var a = 1;//定义了一个number类型
var obj1 = {//定义了一个object类型
  name:'obj'
};
```
![内存分配](./toc/images/js/深浅拷贝01.png)

1、基本类型的复制
```
var a = 1;
var b = a; //复制
console.log(b) //1
a = 2;//改变a的值
console.log(b) //1
```
赋值的时候，在栈内存中重新开辟内存，存放变量b，所以在栈内存中分别存放着变量a、b各自的值，修改时互不影响。

2、引用类型的复制
```
var color1 = ['red','green'];
var color2 = color1;  //复制
console.log(color2)  //['red','green'];
color1.push('black') ;  //改变color1的值
console.log(color2)  //['red','green','black']
```
color1与color2指向堆内存中同一地址的同一对象，复制的只是引用地址。    
![引用类型内存分配](./toc/images/js/深浅拷贝02.png)
## 深浅拷贝
### 深浅拷贝
>浅拷贝只复制指向某个对象的指针，而不复制对象本身，新旧对象还是共享同一块内存。但深拷贝会另外创造一个一模一样的对象，新对象跟原对象不共享内存，修改新对象不会改到原对象。

1、浅拷贝    
浅拷贝只是拷贝基本类型的数据，如果父对象的属性等于数组或另一个对象，那么实际上，子对象获得的只是一个内存地址，因此存在父对象被篡改的可能，浅拷贝只复制指向某个对象的指针，而不复制对象本身，新旧对象还是共享同一块内存。

浅拷贝函数
```
function simpleClone(initalObj) {    
  var obj = Array.isArray(initalObj) ? [] : {};   // 只考虑了数组和对象
  for ( var i in initalObj) {
    obj[i] = initalObj[i];
  }    
  return obj;
}
```
其它：Object.assign slice concat ...   

2、深拷贝
深拷贝就是能够实现真正意义上的数组和对象的拷贝。递归调用"浅拷贝"。（深拷贝会另外创造一个一模一样的对象，新对象跟原对象不共享内存，修改新对象不会改到原对象）

深拷贝函数    
写法一
```
function deepClone(initalObj, finalObj) {
  var obj = finalObj || {};
  for (var i in initalObj) {
    var prop = initalObj[i];
    // 避免相互引用对象导致死循环，如initalObj.a = initalObj的情况
    if(prop === obj) {
      continue;
    }
    if (typeof prop === 'object') {
      obj[i] = (prop.constructor === Array) ? [] : {};
      arguments.callee(prop, obj[i]);
    } else {
      obj[i] = prop;
    }
  }
  return obj;
}
```

写法二
```
function deepClone(initalObj, finalObj) {
  var obj = finalObj || {};
  for (var i in initalObj) {
    var prop = initalObj[i];
    // 避免相互引用对象导致死循环，如initalObj.a = initalObj的情况
    if(prop === obj) {
      continue;
    }
    if (typeof prop === 'object') {
      obj[i] = (prop.constructor === Array) ? [] : Object.create(prop);
    } else {
      obj[i] = prop;
    }
  }
  return obj;
}
```

### 深拷贝实现方式
1、以上深拷贝函数    

2、JSON.stringify 和 JSON.parse   
> 可以转成 JSON 格式的对象才能使用这种方法，如果对象中包含特殊格式如 function 或 RegExp 这些就不能用这种方法了。 

```
function deepClone(obj) {
  let _obj = JSON.stringify(obj);
  let objClone = JSON.parse(_obj);
  return objClone;
}
或者
copy = JSON.parse(JSON.stringify(obj));
```
> **注意：**   

a. 时间对象，序列化后会将时间对象转换为字符串格式   
b. function 和 undefined，序列化后会丢失   
c. 正则和Error对象，序列化后变成空对象   
d. NaN、Infinity和-Infinity，序列化后会变成null   
e. json里有对象是由构造函数生成的，则序列化的结果会丢弃对象的 constructor   
f. 对象中存在循环引用的情况将抛出错误
```
function Person(name) {
  this.name = name;
}

let obj = {
  a: new Date(),
  b1: function() {},
  b2: undefined,
  c1: new Error(),
  c2: new RegExp(),   //  直接正则格式 /a/g 也可以
  d1: NaN,
  d2: Infinity,
  d3: -Infinity,
  e: new Person('Ken'),
  f: null
}
console.log(obj);
console.log(JSON.parse(JSON.stringify(obj)));

obj.f = obj;
console.log(JSON.parse(JSON.stringify(obj)));
```
![上述结果实例](./toc/images/js/深浅拷贝03.png)

3、Object.assign()    
> 当对象中只有一级属性，没有二级属性的时候，此方法为深拷贝，但是对象中有对象的时候，此方法，在二级属性以后就是浅拷贝。 

```
copy = Object.assign({}, obj);
```

4、lodash.cloneDeep()     
> 需要先引入lodash才能使用   

```   
copy = _.cloneDeep(obj);
```

5、递归
```
function deepClone(obj){
  let objClone = Array.isArray(obj)?[]:{};
  if(obj && typeof obj==="object"){
    for(key in obj){
      if(obj.hasOwnProperty(key)){
         //判断ojb子元素是否为对象，如果是，递归复制
          if(obj[key]&&typeof obj[key] ==="object"){
              objClone[key] = deepClone(obj[key]);
          }else{
              //如果不是，简单复制
              objClone[key] = obj[key];
          }
       }
     }
  }
  return objClone;
} 
```
## 判断js数据类型    
判断数据类型的方法一般可以通过：typeof、instanceof、constructor、toString四种常用方法。
### typeof
typeof操作符返回一个字符串，表示未经计算的操作数的类型。    
返回结果包括：number、boolean、string、object、undefined、function、symbol等7种数据类型。  

简单理解就是typeof是判断的是原始类型（值类型），但**函数返回的是function，引用类型返回的基本上都是object，null返回的也是object**，因为所有对象的原型链最终都指向了Object，null被认为是一个空的对象引用，当我们需要知道某个对象的具体类型时，typeof 就显得有些力不从心了。   
```
console.log(typeof 2);   //number
console.log(typeof '2');   //string
console.log(typeof true);   //boolean 
console.log(typeof Symbol());   //symbol
console.log(typeof undefined);   //undefined
console.log(typeof null);   //object
console.log(typeof (() => 's'));   //function
console.log(typeof [1, 3, 's']);   //object
console.log(typeof new Date());   //object
console.log(typeof new RegExp());   //object
```
### instanceof
instanceof 运算符用来测试一个对象（第一个参数）在其原型链中是否存在一个构造函数（第二个参数）的 prototype 属性。  

换言之，判断A是否为B的实例，表达式为：A instanceof B，如果A是B的实例，则返回true，否则返回false。 在这里需要特别注意的是：instanceof检测的是原型，我们用一段伪代码来模拟其内部执行过程：
```
instanceof (A, B) = {
  var L = A.__proto__;
  var R = B.prototype;
  if(L === R) {
      // A的内部属性 __proto__ 指向 B 的原型对象
      return true;
  }
  return false;
}
```
从上述过程可以看出，当 A 的 \__proto__ 指向 B 的 prototype 时，就认为 A 就是 B 的实例，我们再来看几个例子：
```
console.log([] instanceof Array);// true
console.log({} instanceof Object);// true
console.log(new Date() instanceof Date);// true

function Person(){};
console.log(new Person() instanceof Person);  //true

console.log([] instanceof Object);// true
console.log(new Date() instanceof Object);// true
console.log(new Person() instanceof Object);// true
```
虽然 instanceof 能够判断出 [ ] 是Array的实例，但它认为 [ ] 也是Object的实例   

从 instanceof 能够判断出 [ ].\_\_proto\_\_  指向 Array.prototype，而 Array.prototype.\__proto__ 又指向了Object.prototype，最终 Object.prototype.\__proto__ 指向了null，标志着原型链的结束。因此，[]、Array、Object 就在内部形成了一条原型链：  
![原型链分析](./toc/images/js/数据类型01.png)   
从原型链可以看出，[] 的 \__proto__  直接指向Array.prototype，间接指向 Object.prototype，所以按照 instanceof 的判断规则，[] 就是Object的实例。依次类推，类似的 new Date()、new Person() 也会形成一条对应的原型链 。因此，**instanceof 只能用来判断两个对象是否属于实例关系， 而不能判断一个对象实例具体属于哪种类型**。   

相应判断：
```
console.log(2 instanceof Number);   //false
console.log(new Number(2) instanceof Number);   //true
console.log('2' instanceof String);   //false
console.log(new String('2') instanceof String);   //true
console.log(true instanceof Boolean);   //false
console.log(new Boolean(true) instanceof Boolean);   //true
console.log(Symbol() instanceof Symbol);   //false
console.log(null instanceof Object);   //false
console.log(undefined instanceof Object);   //false
console.log({} instanceof Object);   //true
console.log(/a/ instanceof RegExp);   //true
console.log(/a/ instanceof Object);   //true
console.log((() => {}) instanceof Function);   //true
```
从上面的运行结果我们可以看到，基本数据类型是没有检测出他们的类型，但是我们使用对象实例化的方式，是可以检测出类型的。  
### constructor
当一个函数 F被定义时，JS引擎会为F添加 prototype 原型，然后再在 prototype上添加一个 constructor 属性，并让其指向 F 的引用。如下所示：
![演示图片](./toc/images/js/数据类型02.png)  

当执行 var f = new F() 时，F 被当成了构造函数，f 是F的实例对象，此时 F 原型上的 constructor 传递到了 f 上，因此 f.constructor == F。
![演示图片](./toc/images/js/数据类型03.png)  

可以看出，F 利用原型对象上的 constructor 引用了自身，当 F 作为构造函数来创建对象时，原型上的 constructor 就被遗传到了新创建的对象上， 从原型链角度讲，构造函数 F 就是新对象的类型。这样做的意义是，让新对象在诞生以后，就具有可追溯的数据类型。
```
console.log('2'.constructor === String);   //true
console.log(2.constructor === Number);   //浏览器报错
let num = 2; console.log(num.constructor === Number);   //true
console.log(new Number(2).constructor === Number);   //true
console.log(true.constructor === Boolean);   //true
console.log(Symbol().constructor === Symbol);   //true
console.log(null.constructor === Object);   //报错
console.log(undefined.constructor === Object);   //报错
console.log({}.constructor === Object);   //true
console.log((new Date()).constructor === Date);   //true
console.log((new Date()).constructor === Object);   //false
console.log((() => {}).constructor === Function);   //true
```
null 和 undefined 是无效的对象，因此是不会有 constructor 存在的，故报错，这两种类型的数据需要通过其他方式来判断。  
另外，函数的 constructor 是不稳定的，这个主要体现在自定义对象上，当开发者重写 prototype 后，原有的 constructor 引用会丢失，constructor 会默认为 Object。
```
function F() {}
F.prototype = { a: 1 }
let f = new F();
console.log(f.constructor === F)   //false
console.log(f.constructor);  //ƒ Object() { [native code] }
console.log(f.constructor === Object);  //true
```
因为 prototype 被重新赋值的是一个 { }， { } 是 new Object() 的字面量，因此 new Object() 会将 Object 原型上的 constructor 传递给 { }，也就是 Object 本身。   
**因此，为了规范开发，在重写对象原型时一般都需要重新给 constructor 赋值，以保证对象实例的类型不被篡改。**  
### Object.prototype.toString
可以说不管是什么类型，它都可以立即判断出，推荐使用。   

toString() 是 Object 的原型方法，调用该方法，默认返回当前对象的 [[Class]] (其调用者的具体类型)。这是一个内部属性，其格式为 [object Xxx] ，其中 Xxx 就是对象的类型。   

对于 Object 对象，直接调用 toString() 就能返回 [object Object] 。而对于其他对象，则需要通过 call / apply 来调用才能返回正确的类型信息。   
```
console.log(Object.prototype.toString.call(2));   //[object Number]
console.log(Object.prototype.toString.call('2'));   //[object String]
console.log(Object.prototype.toString.call(true));   //[object Boolean]
console.log(Object.prototype.toString.call(Symbol()));   //[object Symbol]
console.log(Object.prototype.toString.call(null));   //[object Null]
console.log(Object.prototype.toString.call(undefined));   //[object Undefined]
console.log(Object.prototype.toString.call(new Date()));   //[object Date]
console.log(Object.prototype.toString.call({}));   //[object Object]
console.log(Object.prototype.toString.call([]));   //[object Array]
console.log(Object.prototype.toString.call(/a/));   //[object RegExp]
console.log(Object.prototype.toString.call(() => {}));   //[object Function]
console.log(Object.prototype.toString.call(new Error()));   //[object Error]
console.log(Object.prototype.toString.call(document));   //[object HTMLDocument]
console.log(Object.prototype.toString.call(window));   //[object Window]  window 是全局对象 global 的引用
```  
### 优缺点
|    | typeof | instanceof | constructor | Object.prototype.toString.call |
| :---: | :---: | :---: | :---: | :---: |
| 优点 | 使用简单 | 能检测出引用类型 | 基本能检测所有的类型（除了null和undefined） | 检测出所有的类型 |
| 缺点 | 只能检测出基本类型（除null） | 不能检测出基本类型，且不能跨iframe | constructor易被修改，也不能跨iframe | IE6下，undefined和null均为Object |   
测试：跨页面判断是否是数组   
```
var oF = document.createElement('iframe');
document.body.appendChild( oF );
var ifArray = window.frames[0].Array;
var arr = new ifArray();
console.log( typeof arr );   //object
console.log( arr.constructor == Array );   //false
console.log( arr instanceof Array );   //false
console.log( Object.prototype.toString.call(arr) == '[object Array]' );   //true
```   
从结果中可以看出，constructor和instanceof都没有正确的判断出类型。  

参考文章：[一像素](https://www.cnblogs.com/onepixel/p/5126046.html)&emsp;[冰雪为融](https://blog.csdn.net/lhjuejiang/article/details/79623973)  
## 垃圾回收机制
### 变量回收原则
1、全局变量不会被回收。   
2、局部变量会被回收，也就是函数一旦运行完以后，函数内部的东西都会被销毁。   
3、只要被另外一个作用域所引用就不会被回收。   
```
var i = 1;   // 全局变量不会被回收
var i = 2;   // 这里重复声明变量i,因此var声明被忽略，只是把i赋值为2
var add = function () {  // 全局变量不会被回收
  var i = 0;  // 局部变量
  return function () {
    i++;
    console.log(i); // 被另一个作用域引用导致不会被回收
  }
}();
add();
```
### 垃圾回收原则
在 JavaScript 内存管理中有一个概念叫做 可达性，就是那些以某种方式可访问或者说可用的值，它们被保证存储在内存中，反之不可访问则需回收。    
常用的垃圾回收算法有两种
#### 标记清除算法
最常用的垃圾回收策略。当变量进入上下文，比如在函数内部声明一个变量时，这个变量会被加上存在于上下文中的标记。而在上下文中的变量，逻辑上讲，永远不应该释放它们的内存，因为只要上下文中的代码在运行，就有可能用到它们。当变量离开上下文时，也会被加上离开上下文的标记。   

1、垃圾回收程序运行的时候，会标记内存中存储的所有变量（标记方法有很多种)。   
2、然后，它会将所有在上下文中的变量，以及被在上下文中的变量引用的变量的标记去掉。
3、在此之后再被加上标记的变量就是待删除的了，原因是任何在上下文中的变量都访问不到它们了。    
4、随后垃圾回收程序做一次内存清理，销毁带标记的所有值并收回它们的内存。
#### 引用计数算法
对每个值记录它被引用的次数。    

1、当声明了一个变量并且将一个引用类型赋值给该变量的时候这个值的引用次数就为1。  
2、如果同一个值又被赋给另一个变量，那么引用数加1。  
3、如果该变量的值被其他的值覆盖了，则引用次数减1。   
4、当这个值的引用次数变为0的时候，说明没有变量在使用，这个值没法被访问了，回收空间，垃圾回收器会在运行的时候清理掉引用次数为0的值占用的内存。    

參考：<a href="https://www.cnblogs.com/erqi/p/14436416.html">JavaScript变量回收原则/垃圾回收机制</a>&emsp;<a href="https://juejin.cn/post/6981588276356317214">垃圾回收机制</a>
## 内存泄漏
指一块被分配的内存既不能使用，又不能回收，直到浏览器进程结束。   
对于持续运行的服务进程（daemon），必须及时释放不再用到的内存。否则，内存占用越来越高，轻则影响系统性能，重则导致进程崩溃。    
一次内存泄漏似乎不会有大的影响，但内存泄漏堆积后的后果就是内存溢出。    
### 常见的内存泄漏
#### 意外的全局变量
```
function test() {
  num = 1;
  this.str = 'abc';
}
test();
```
这里的num由于没有声明，自动提升为全局变量，str由this创建，这里调用也指向全局，str也是全局变量，不会被自动回收。
```
delete num;   // 手动删除(最好在函数内部声明)
```
#### 闭包
```
let outer = function() {
  let name = 'Jack';
  return function() {
    return name;
  }
}
```
这段代码执行后创建了一个内部闭包，只要返回的函数存在就不能清理name，因为闭包一直在使用。
#### 定时器
```
let name = 'Jack';
setInterval(() => {
  console.log(name)
}, 100);
```
只要定时器一直运行，回调函数中的name就会一直占用内存，不会被回收。
#### Map和Set
类似于脱离DOM的引用，如果不将其主动清除引用，其同样会造成内存不自动进行回收，对于键为对象的情况，可以采用WeakMap，WeakMap对象同样用来保存键值对，对于键是弱引用的而且必须为一个对象，而值可以是任意的对象或者原始值，且由于是对于对象的弱引用，其不会干扰Js的垃圾回收。
#### console的滥用
传递给console.log的对象不能被垃圾回收，所以没有去掉console.log可能会存在内存泄漏。
#### DOM泄漏
```
let a = {};
document.getElementById('box').style = a;
//  document.getElementById('box').style = null;  回收

let a = document.getElementById('box');
document.body.removeChild(a);  // 虽然移除了，但是a还在引用，不会清除
//  a = null;
```
### 避免
1、减少不必要的全局变量，或者生命周期较长的对象，及时对无用的数据进行垃圾回收(即赋值为null)；   
2、注意程序逻辑，避免“死循环”等；   
3、避免创建过多的对象；   
4、减少层级过多的引用。   
## 内存溢出
存在无法回收的内存或使用的内存过多，最终使得程序运行要用到的内存大于能提供的最大内存，就出抛出内存溢出的错误。

# 变量
## 编译原理
JavaScript的源代码在运行的时候，会经过两个阶段：编译和执行。而且，编译阶段往往就在执行阶段的前几微秒甚至更短的时间内。   
大家通常把 javascript 归类为一种“动态”或“解释执行”的语言，但事实上，它是一门编译语言，但和传统的编译语言不同，它不是提前编译的，编译结果也不能进行移植。  

在传统编译语言中，程序在执行之前会经历三个步骤，统称为“编译”：  
**1、词法解析**   
这个过程会把字符串分解成有意义的代码块，这些代码块被称为词法单元。  
例如 **var a = 5;** 这段程序通常会被分解成下面这些词法单元： var、a、=、5、; 。空格是否会被当成词法单元取决于空格在这门语言中是否有意义。  
**2、语法解析**   
这个过程是将词法单元流（数组）转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树。这个树被称为“抽象语法树”（Abstract Syntax Tree，AST）。var a = 5; 的抽象语法树中可能如下图所示：  
![抽象语法树](./toc/images/js/变量02.png)   
**3、代码生成**   
将 AST 转换为可执行代码的过程被称为代码生成。这个过程与语言、目标平台等息息相关。简单来说，就是通过某种方法可以将 var a = 5; 的 AST 转化为一组机器指令，用来创建一个叫做 a 的变量（包括分配内存等），并将一个值 5 存储在 a 中。   
任何 javascript 代码片段在执行前都要进行编译（预编译）。因此，javascript 编译器首先会对 var a = 5; 这段程序进行编译，然后做好执行它的准备，并且通常马上就会执行它。
## 作用域  
作用域说明：指一个变量的作用范围   

**1、全局作用域**   
(1) 全局作用域在页面打开时被创建，页面关闭时被销毁   
(2) 编写在script标签中的变量和函数，作用域为全局，在页面的任意位置都可以访问到   
(3) 在全局作用域中有全局对象window，代表一个浏览器窗口，由浏览器创建，可以直接调用   
(4) 全局作用域中声明的变量和函数会作为window对象的属性和方法保存   
```
var a = 10;
b = 20;
function an(){
    console.log('an')
}
var bn = function(){
    console.log('bn')
}
console.log(window)
```  
如图，变量a，b和函数an，bn都保存在window对象上   
![项目图片](./toc/images/js/变量01.png)    

**2、函数作用域**  
(1) 调用函数时，函数作用域被创建，函数执行完毕，函数作用域被销毁   
(2) 每调用一次函数就会创建一个新的函数作用域，他们之间是相互独立的   
(3) 在函数作用域中可以访问到全局作用域的变量，在函数外无法访问到函数作用域内的变量   
(4) 在函数作用域中访问变量、函数时，会先在自身作用域中寻找，若没有找到，则会到函数的上一级作用域中寻找，一直到全局作用域    
(5) 在函数作用域中也有声明提前的特性，对于变量和函数都起作用，此时函数作用域相当于一个小的全局作用域，详细声明提前请看声明提前部分    
(6) 在函数作用域中，不使用变量关键字声明的变量，在赋值时会往上一级作用域寻找已经声明的同名变量，直到全局作用域时还没找到，则会成为window的属性   
```  
an(); // 输出结果 bn
function an(){
  var b = 'bn';
  function bn(){
    console.log(b); 
    b = 'bn2';   // b会往上一级寻找已经声明的同名变量，并赋值，直到全局作用域时还没找到，则会成为window的属性
  }
  bn();
  console.log(b); // 输出 bn2
}
```
(7) 在函数中定义形参,等同于声明变量  
```
function an(name){
  console.log(name); // 输出 undefined
}
an();
```
等同于
```
function an(){
  var name
  console.log(name); // 输出 undefined
}
an();
```  

原文链接：[JS中的变量作用域](https://blog.csdn.net/zjy_android_blog/article/details/80863425)   
## 作用域嵌套  
当一个块或函数嵌套在另一个块或函数中时，就发生了作用域嵌套。因此，在当前作用域中无法找到某个变量时，引擎就会在外层嵌套的作用域中继续查找，直到找到该变量，或抵达最外层的作用域（也就是全局作用域）为止。   
```
function foo(a) {
  console.log(a + b);
}
var b = 2;
foo(2);    // 4
```  
这里对 b 进行的 RHS 查询在 foo 作用域中无法找到，但可以在上一级作用域（这个例子中就是全局作用域）中找到。   
## LHS 和 RHS
**LHS查询**  
LHS ： 指的是赋值操作的左端。在编译的过程中，先将标识符和函数声明给提升到其对应的作用域的顶端。标识符解析的时候，会进行LHS查询，在LHS查询的时候，如果标识符一直找不到声明的位置，那么最终就会在全局环境生成一个全局变量。   

**RHS查询**   
说到LHS查询，就不得不提对应的RHS查询，它指的是赋值操作的源头。RHS查询的时候，如果找不到对应的标识符，就会抛出一个异常：ReferenceError。  

```
function foo(a) {
  // 这里隐式包含了 a = 2 这个赋值，所以对 a 进行了 LHS 查询
  var b = a;   // 这里对 a 进行了 RHS 查询，找到 a 的值，然后对 b 进行 LHS 查询，把 2 赋值给 b
  return a + b;   // 这里包含了对 a 和 b 进行的 RHS 查询
}
var c = foo(2);  // 这里首先对 foo 进行 RHS 查询，找到它是一个函数，然后对 c 进行 LHS 查询把 foo 赋值给 c 
```
## 变量提升  
### 变量提升
提升简单来说就是把我们所写的类似于var a = 123;这样的代码，声明提升到它所在作用域的顶端去执行，到我们代码所在的位置来赋值。   
其在JS引擎的执行的优先级是 变量声明、函数声明、变量赋值。   
```
function test () {
    console.log(a);  //undefined
    var a = 123; 
}
test ();
```   
实际执行顺序
```
function test () {
    var a;
    console.log(a);
    a = 123;
}
test();
```
### 函数提升
**1、函数声明式**   
```
console.log(bar);
function bar () {
  console.log(1);
}
```
执行顺序相当于   
```
function bar () {
  console.log(1);
}
console.log(bar);
```
**2、函数字面量式**
```
foo();   //1
function foo () {
  console.log(1);
}
var foo = function () {
  console.log(2);
}
```
执行顺序相当于
```
function foo () {
  console.log(1);
}
var foo;
foo();
foo = function () {
  console.log(2);
}
```
### 题目
```
console.log(v1); 
var v1 = 100;
function foo() {
  console.log(v1); 
  var v1 = 200;
  console.log(v1);   
}
foo();
console.log(v1);   

// undefined
// undefined
// 200
// 100
```
```
foo(); 
var a = true;
if(a){
  function foo () { console.log(1); }
}else{
  function foo () { console.log(2); }
}

//低版本：2  //高版本： Uncaught TypeError: foo is not a function
```
```
console.log(typeof a);
a();
var a = 3;
function a() {
 console.log(typeof a);
}
console.log(typeof a);
a = 6;
a();

// "function"
// "function"
// "number"
// "a is not a function"
```
```
f();
fn(); 
var fn = function(){
  console.log(1)
}
function f(){
  console.log(0)
}

// 0
// fn is not a function
```
```
var s = function(){
  console.log(0);
}
function s(){
  console.log(1);
}
s(); // 0

// 执行顺序
var s; // 变量声明
function s(){ //函数声明
  console.log(1);
}
s = function(){ // 变量赋值
  console.log(0);
}
s(); // 0

```
```
console.log(fn);
function fn() {
  console.log('a');
}
var fn = 3;

// ƒ fn() {
  console.log('a');
}

// 执行顺序
var fn;
function fn() {
  console.log('a');
}
console.log(fn);
fn = 3;
```
## 暂时性死区
红宝书第四版92页说let在JavaScript运行时也会被提升，但由于“暂时性死区”（temporal dead zone）的缘故，实际上不能在声明之前使用let变量。   
只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。  
```
tmp = 'abc';    // ReferenceError
let tmp;
```
上述用let看着没有提升，其实是被限制了。   

```
var tmp = 123;
if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}
```
上面代码中，存在全局变量tmp，但是块级作用域内let又声明了一个局部变量tmp，导致后者绑定这个块级作用域，所以在let声明变量前，对tmp赋值会报错。   
ES6明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。  

总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。   
```
if (true) {
  // TDZ开始
  tmp = 'abc'; // ReferenceError
  console.log(tmp); // ReferenceError
  let tmp; // TDZ结束
  console.log(tmp); // undefined
  tmp = 123;
  console.log(tmp); // 123
}
```
上面代码中，在let命令声明变量tmp之前，都属于变量tmp的“死区”。    

“暂时性死区”也意味着**typeof**不再是一个百分之百安全的操作。(如果一个变量根本没有被声明，使用typeof反而不会报错)   
```
typeof undeclared_variable;    // "undefined"
typeof x;    // ReferenceError
let x;
```
变量x使用let命令声明，所以在声明之前，都属于x的“死区”，只要用到该变量就会报错。因此，typeof运行时就会抛出一个ReferenceError。  
但是如果一个变量根本没有被声明，使用typeof反而不会报错。   

有些“死区”比较隐蔽，不太容易发现。  
```
function bar(x = y, y = 2) {
  return [x, y];
}
bar(); // 报错
```
上面代码中，调用bar函数之所以报错（某些实现可能不报错），是因为参数x默认值等于另一个参数y，而此时y还没有声明，属于”死区“。如果y的默认值是x，就不会报错，因为此时x已经声明了。   
```
function bar(x = 2, y = x) {
  return [x, y];
}
bar(); // [2, 2]
```
参考文章：[详细介绍JS中“暂时性死区”的概念](https://www.gxlcms.com/JavaScript-253414.html)
## 运算符
### ||
expr1 || expr2 或：如果 expr1 可以转换为 true，就返回 expr1 ，否则返回 expr2。
```
console.log(null || undefined)   // undefined
console.log(undefined || null)   // null
```

# 其它内置对象方法
## parseInt
在掘金看到<a href="https://juejin.cn/post/7121899182582923300" _target="_blank">为什么 JavaScript 的 parseInt(0.0000005) 打印“5”？
</a>这个问题后，深入了解了一下这个方法。    

parseInt(string, radix) 解析一个字符串并返回指定基数的十进制整数或NaN，radix 是 2-36 之间的整数，表示被解析字符串的基数(10不是默认值)。    
例如：parseInt('10', 2)表示将10当作2进制转换为十进制，结果为2。   

string 是需要解析的值，如果该参数不是字符串，则会将其使用toString先转换为字符串，再转换为数值类型；   

如果 radix 是 undefined、0 或未指定的，JavaScript 会假定以下情况：    
1. 如果输入的 string 以 0x 或 0X（一个 0，后面是小写或大写的 X）开头，那么 radix 被假定为 16，字符串的其余部分被当做十六进制数去解析。    
2. 如果输入的 string 以 "0"（0）开头，radix 被假定为 8（八进制）或 10（十进制）。具体选择哪一个 radix 取决于实现。ECMAScript 5 澄清了应该使用 10 (十进制)，但不是所有的浏览器都支持。因此，在使用 parseInt 时，一定要指定一个 radix。     
3. 如果输入的 string 以任何其他值开头，radix 是 10 (十进制)。       

当radix小于5或大于36，或者第一个非空字符不能转换为数字时就会返回NaN。    

**特殊示例**
```
parseInt(0.0000005)    // 5  实际为parseInt('5e-7')
parseInt(9999999999)     // 1
parseInt('546', 2)     // NaN
```
<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt" target="_blank">MDN_parseInt</a>     

## this
基本上可以归为以下几种情况:    
全局 this 是 window    
函数 this 是调用者(该函数的执行上下文)    
构造函数的 this 是 new 之后的新对象     
call 和 apply bind 的 this 第一个参数     
箭头函数不会改变函数的指向(指向上一级的执行上下文)    

以下都摘自：<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this">MDN_this</a>     
在绝大多数情况下，函数的调用方式决定了 this 的值（运行时绑定）。this 不能在执行期间被赋值，并且在每次函数被调用时 this 的值也可能会不同。ES5 引入了 bind 方法来设置函数的 this 值，而不用考虑函数如何被调用的。ES2015 引入了箭头函数，箭头函数不提供自身的 this 绑定（this 的值将保持为闭合词法上下文的值）。    

**值：**当前执行上下文（global、function 或 eval）的一个属性，在非严格模式下，总是指向一个对象，在严格模式下可以是任意值。    

### 全局上下文
无论是否在严格模式下，在全局执行环境中（在任何函数体外部）this 都指向全局对象。
```
console.log(this === window)
```
注意：globalThis可以直接获取全局对象window     
### 


# DOM
## attribute和property
### 区别
**property**   
* 是DOM中的属性，是JavaScript里的对象   
* 可以读取标签自带属性，包括没有写出来的   
* 不能读取attribute设置的属性   
* 获取方式：读：element.property;&emsp;&emsp;如：p.className;  
* 设置方式：element.property = 'xxx';&emsp;&emsp;如：p.className = 'xiao';   
* 是元素（对象）的属性   
 
**attribute**  
* 是HTML标签的属性,即直接在html标签添加的都是attribute属性，只能是字符串  
* attributes是属于property的一个子集
* 不能读取property设置的属性  
* 读取方式：element.getAttribute('属性名','属性值');  如：a.getAttribute('href');  
* 设置方式：element.setAttribute('属性名','属性值');  如：a.getAttribute('href','xiaowan.jpg');  
* 直接在html标签上添加的和使用setAttribute添加的情况一致   

### 详细说明   
简单理解，Attribute就是dom节点自带的属性，例如html中常用的id、class、title、align等。   
而Property是这个DOM元素作为对象，其附加的内容，例如childNodes、firstChild等。    
```
<div id="div1" class="divClass" title="divTitle" title1="divTitle1"></div>
let oDiv = document.getElementById("div1");
```
html自带的dom属性会自动转换成property，property不能输出自定义属性（title1），查看选择该DOM元素，查看Properties。       
对于id为div1的div，它的property内容如下：（部分）     

![property](./toc/images/js/题库-其它01.png)   
![property](./toc/images/js/题库-其它02.png)   

可以发现有一个名为“attributes”的属性，类型是NamedNodeMap，同时有“id”和“className”、”title“等基本的属性，但没有“title1”这个自定义的属性。    
这是由于，每一个DOM对象都会有它默认的基本属性，在创建的时候，只会创建这些基本属性，在标签中自定义的属性是不会直接放到DOM中。    
从这里就可以看出，attributes是属于property的一个子集，它保存了HTML标签上定义属性。    

![property](./toc/images/js/题库-其它03.png)   

attitudes中的每一个属性，会发现它们并不是简单的对象，它是一个Attr类型的对象，拥有NodeType、NodeName等属性。    
注意，打印attribute属性不会直接得到对象的值，而是获取一个包含属性名和值的字符串。
```
console.log(oDiv.attributes.title1);    // title1="divTitle1"
console.log(oDiv.attributes.title1.name);    // title1
console.log(oDiv.attributes.title1.value);    // divTitle1
```
最后注意：**“class”变成Property之后叫做“className”，因为“class”是ECMA的关键字**。
### 赋值和取值
**1、attribute赋值**   
```
oDiv.setAttribute('title', 'b');
oDiv.setAttribute('title1', 'c');   //自定义特性
```
setAttribute()的两个参数，都必须是字符串。   

**2、attribute取值**   
```
let class = oDiv.getAttribute("class");
let title1 = oDiv.getAttribute("title1");
```

**3、Property赋值**   
```
oDiv.className = 'a';
oDiv.AAAAA = true;
```
对属性Property可以赋任何类型的值。   
对于属性Property的赋值在IE中可能会引起循环引用，内存泄漏。    

**4、property取值**   
```
let className = oDiv.className;
let childNodes = oDiv.childNodes;
```
### 更改property和attribute其中一个值
```
oDiv.value = 'new value of prop';
console.log(oDiv.value);               // 'new value of prop'
console.log(oDiv.attributes.value);         // 'value="1"'

oDiv.setAttribute('value1', 'ni')
console.log(oDiv.value1);              //ni
console.log(oDiv.attributes.value1);        //value='ni'
```
* property能够从attribute中得到同步；  
* attribute不会同步property上的值；   
* attribute和property之间的数据绑定是单向的，attribute->property；   
* 更改property和attribute上的任意值，都会将更新反映到HTML页面中；   

参考文章：[JS中attribute和property的区别](https://www.cnblogs.com/lmjZone/p/8760232.html)

# ES6+
## promise
## async/await
await只能在async函数里使用    
await后面最好接Promise，如果后面接的是普通函数则会直接执行    
async函数返回的是一个Promise    
```
function fn1 () {
  return new Promise((resolve, reject) => {
    api.getList1(res => {
      resolve(res)
    }, err => {
      reject(err)
    })
  })
}

function fn2 (data) {
  return new Promise((resolve, reject) => {
    api.getList2(res => {
      resolve(res)
    }, err => {
      reject(err)
    })
  })
}

async function req () {
  try {
    const data1 = await fn1()
    const data2 = await fn2(data1)
  } catch(err) {
    console.log(err)
  }
}
req()
```

# 其它（含一些静态方法）
## 严格模式
"use strict" 指令在 JavaScript 1.8.5 (ECMAScript5) 中新增。  
它不是一条语句，但是是一个**字面量表达式**，在 JavaScript 旧版本中会被忽略。  
"use strict" 的目的是指定代码在严格条件下执行。   
支持严格模式的浏览器:Internet Explorer 10 +、 Firefox 4+ Chrome 13+、 Safari 5.1+、 Opera 12+。  

**声明**   
在脚本或函数的头部添加 use strict; 表达式来声明。
```
<script>
  "use strict";
  console.log(1);
</script>
```
```
<script>
  function test() {
    "use strict";
    console.log(1);
  }
  test();
</script>
```

**优点**   
1、消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为；   
2、消除代码运行的一些不安全之处，保证代码运行的安全；   
3、提高编译器效率，增加运行速度；   
4、为未来新版本的Javascript做好铺垫。   

**限制**   
1、不允许使用未声明的变量
```
"use strict";
x = 3.14;   // 报错 (x 未定义)
```
2、不允许删除变量或对象(包括函数)
```
"use strict";
var x = 3.14;
delete x;   // 报错
```
3、不允许变量重名
```
"use strict";
function x(p1, p1) {};   // 报错
```
4、不允许使用八进制
```
"use strict";
var x = 010;   // 报错
```
5、不允许使用转义字符
```
"use strict";
var x = \010;   // 报错
```
6、不允许对只读属性赋值
```
"use strict";
var obj = {};
Object.defineProperty(obj, "x", {value:0, writable:false});
obj.x = 3.14;   // 报错
```
7、不允许对一个使用getter方法读取的属性进行赋值
```
"use strict";
var obj = {get x() {return 0} };
obj.x = 3.14;   // 报错
```
8、不允许删除一个不允许删除的属性
```
"use strict";
delete Object.prototype;   // 报错
```
9、变量名不能使用 "eval、arguments" 字符串
```
"use strict";
var eval = 3.14;         // 报错
var arguments = 3.14;    // 报错
```
10、不允许使用以下这种语句
```
"use strict";
with (Math){x = cos(2)}; // 报错
```
11、由于一些安全原因，在作用域 eval() 创建的变量不能被调：
```
"use strict";
eval ("var x = 2");
alert (x);               // 报错
```
12、禁止this关键字指向全局对象。
```
function test() {
  console.log(this);   // window对象
}
function test1() {
  "use strict";
  console.log(this);   // undefined
}
```
13、为了向将来Javascript的新版本过渡，严格模式新增了一些保留关键字
```
implements  
interface  
let
package
private
protected
public
static
yield
```
```
"use strict";
var public = 1500;      // 报错
```
## pc端获取地理位置信息
### navigator.geolocation.getCurrentPosition
```
if(navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    console.log(position);
  }, err =>  {
    console.log(err.message);
  }) 
}
else {
  alert('您的浏览器不支持使用HTML5获取位置信息')
}
```
使用html5自带的api获取信息，但是试过之后发现在浏览器中获取不到，错误信息 ==> Network location provider at 'https://www.googleapis.com/' : ERR_CONNECTION_RESET. 似乎是因为信息由谷歌提供，国内访问被墙，需要挂vpn。且根据查看的一些信息和我们使用的经纬度信息不一致，需要转换。
### 使用百度地图api中定位
```
// 先引入
// 第一种：js引入 <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=密钥"></script>
// 第二种：npm 引入 npm install vue-baidu-map -s

const geolocation = new BMap.Geolocation();
const gc = new BMap.Geocoder();
const _this = this;
geolocation.getCurrentPosition(res => {
  // 获取经纬度
  gc.getLocation(res.point, info => {
    // 获取位置信息
    console.log(res, info);
  })
})
```
但是在使用之后发现似乎只能获取到市区，加上精准定位和sdk定位也不行。
### 使用百度地图自己的api
<a href="https://map.baidu.com/?qt=ipLocation&t=1636537181641" target="_blank">https://map.baidu.com/?qt=ipLocation&t=1636537181641</a>   
可以当接口调用，注意：会跨域。t是当前时间戳，在vue中使用同样需要配置
```
let time = new Date().getTime();
$.ajax({
  type: "GET",
  url: "https://map.baidu.com/?qt=ipLocation&t=" + time,
  dataType: "jsonp",   // 解决跨域
  success: function (result) {
      console.log(result);
  },
});
```
偶尔还是会存在定位不精准，但与百度地图位置完全一致。   

## 金额
### 金额转大写
```
numberFun: function(n = 0) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  const head = n < 0 ? '欠' : '';   // 负数抬头
  n = Math.abs(n);
  let s = '';
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = '';
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return head + s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}
```
### decimal(val, intLength, fLength)
```
/**
  * 数据过滤，保持 length - 2 位整数，两位小数
  * @param { String } val 需要过滤的数值 
  * @param { Number } intLength 整数位数 
  * @param { Number } fLength 整数位数 
  * @returns { String } 过滤后的值
*/
decimal: function(val = '0', intLength = 10, fLength = 2) {
  val = val.replace(/^0*(0\.|[1-9])/, "$1");
  val = val.replace(/[^\d.]/g, "");     // 清除非数字和0
  val = val.replace(/^\./g, "");      // 第一个字符不能为.
  val = val.replace(/\.{1,}/g, ".");     // 只保留第一个. 清除多余的
  val = val
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".");
  // val = val.replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3");    // 两位小数
  val = val.indexOf(".") > 0
    ? val.split(".")[0].substring(0, intLength) + "." + val.split(".")[1].substring(0, fLength)
    : val.substring(0, intLength);
  return val;
}
```
### Format money
```
const ThousandNum = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
console.log(ThousandNum(1000000))    // 1,000,000  不适用于浮点数
```
## webRTC
在做web推流时了解到这个，查了很多资料，在web端几乎无延迟，在这篇文章下初始并了解，代码亲测可用。    
<a href="https://juejin.cn/post/6884851075887661070" target="_blank">https://juejin.cn/post/6884851075887661070</a>   
此链接代码整合，在一个页面实现推拉流 

### 普通js
```
// index.html   
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo</title>
    <style>
        video {
            width: 320px;
        }
    </style>
</head>
<body>
    <video id="localVideo" autoplay playsinline></video>
    <video id="remoteVideo" autoplay playsinline></video>
    <div>
        <button id="startBtn" onclick="startHandle()">打开本地视频</button>
        <button id="callBtn" onclick="callHandle()">建立连接</button>
        <button id="hangupBtn" onclick="hangupHandle()">断开连接</button>
    </div>
    <!-- 适配各浏览器 API 不统一的脚本 -->
    <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
    <script src="./jq.js"></script>   <!-- jquery -->
    <script src="./webrtc.js"></script>
</body>
</html>
```
```
// webrtc.js

// 本地流和远端流
let localStream;
let remoteStream;

// 本地和远端连接对象
let localPeerConnection;
let remotePeerConnection;

// 本地视频和远端视频
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

// 设置约束
const mediaStreamConstraints = {
    video: true
}

// 设置仅交换视频
const offerOptions = {
    offerToReceiveVideo: 1
}

function startHandle() {
  startBtn.disabled = true;
  // 1.获取本地音视频流
  // 调用 getUserMedia API 获取音视频流
  navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
      .then(gotLocalMediaStream)
      .catch((err) => {
          console.log('getUserMedia 错误', err);
      });
}

function callHandle() {
  callBtn.disabled = true;
  hangupBtn.disabled = false;

  // 视频轨道
  const videoTracks = localStream.getVideoTracks();
  // 音频轨道
  const audioTracks = localStream.getAudioTracks();
  // 判断视频轨道是否有值
  if (videoTracks.length > 0) {
      console.log(`使用的设备为: ${videoTracks[0].label}.`);
  }
  // 判断音频轨道是否有值
  if (audioTracks.length > 0) {
      console.log(`使用的设备为: ${audioTracks[0].label}.`);
  }
  const servers = null;

  // 创建 RTCPeerConnection 对象
  localPeerConnection = new RTCPeerConnection(servers);
  // 监听返回的 Candidate
  localPeerConnection.addEventListener('icecandidate', handleConnection);
  // 监听 ICE 状态变化
  localPeerConnection.addEventListener('iceconnectionstatechange', handleConnectionChange)

  remotePeerConnection = new RTCPeerConnection(servers);
  remotePeerConnection.addEventListener('icecandidate', handleConnection);
  remotePeerConnection.addEventListener('iceconnectionstatechange', handleConnectionChange);
  remotePeerConnection.addEventListener('track', gotRemoteMediaStream);

  // 将音视频流添加到 RTCPeerConnection 对象中
  // 注意：新的协议中已经不再推荐使用 addStream 方法来添加媒体流，应使用 addTrack 方法
  // localPeerConnection.addStream(localStream);
  // 遍历本地流的所有轨道
  localStream.getTracks().forEach((track) => {
      localPeerConnection.addTrack(track, localStream)
  })

  // 2.交换媒体描述信息
  localPeerConnection.createOffer(offerOptions)
  .then(createdOffer).catch((err) => {
      console.log('createdOffer 错误', err);
  });
}

function hangupHandle() {
  // 关闭连接并设置为空
  localPeerConnection.close();
  remotePeerConnection.close();
  localPeerConnection = null;
  remotePeerConnection = null;
  hangupBtn.disabled = true;
  callBtn.disabled = false;
}

// getUserMedia 获得流后，将音视频流展示并保存到 localStream
function gotLocalMediaStream(mediaStream) {
  // console.log(mediaStream);
  localVideo.srcObject = mediaStream; 
  localStream = mediaStream; 
  callBtn.disabled = false;
}

function createdOffer(description) {
  console.log(`本地创建offer返回的sdp:\n${description.sdp}`)
  // 本地设置描述并将它发送给远端
  // 将 offer 保存到本地
  localPeerConnection.setLocalDescription(description) 
      .then(() => {
          console.log('local 设置本地描述信息成功');
      }).catch((err) => {
          console.log('local 设置本地描述信息错误', err)
      });
  // 远端将本地给它的描述设置为远端描述
  // 远端将 offer 保存
  remotePeerConnection.setRemoteDescription(description) 
      .then(() => { 
          console.log(description);
          console.log('remote 设置远端描述信息成功');
      }).catch((err) => {
          console.log('remote 设置远端描述信息错误', err);
      });
  // 远端创建应答 answer
  remotePeerConnection.createAnswer() 
      .then(createdAnswer)
      .catch((err) => {
          console.log('远端创建应答 answer 错误', err);
      });

}

function createdAnswer(description) {
  console.log(`远端应答Answer的sdp:\n${description.sdp}`)
  // 远端设置本地描述并将它发给本地
  // 远端保存 answer
  remotePeerConnection.setLocalDescription(description)
      .then(() => { 
          console.log(description);
          console.log('remote 设置本地描述信息成功');
      }).catch((err) => {
          console.log('remote 设置本地描述信息错误', err);
      });
  // 本地将远端的应答描述设置为远端描述
  // 本地保存 answer
  localPeerConnection.setRemoteDescription(description) 
      .then(() => { 
          console.log('local 设置远端描述信息成功');
      }).catch((err) => {
          console.log('local 设置远端描述信息错误', err);
      });
}

// 3.端与端建立连接
function handleConnection(event) {
  // 获取到触发 icecandidate 事件的 RTCPeerConnection 对象 
  // 获取到具体的Candidate
  const peerConnection = event.target;
  const iceCandidate = event.candidate;

  if (iceCandidate) {
      // 创建 RTCIceCandidate 对象
      const newIceCandidate = new RTCIceCandidate(iceCandidate);
      // 得到对端的 RTCPeerConnection
      const otherPeer = getOtherPeer(peerConnection);

      // 将本地获得的 Candidate 添加到远端的 RTCPeerConnection 对象中
      // 为了简单，这里并没有通过信令服务器来发送 Candidate，直接通过 addIceCandidate 来达到互换 Candidate 信息的目的
      otherPeer.addIceCandidate(newIceCandidate)
          .then(() => {
              handleConnectionSuccess(peerConnection);
          }).catch((error) => {
              handleConnectionFailure(peerConnection, error);
          });
  }
}

// 4.显示远端媒体流
function gotRemoteMediaStream(event) {
    console.log(event);
  if (remoteVideo.srcObject !== event.streams[0]) {
      remoteVideo.srcObject = event.streams[0];
      remoteStream = event.streams[0];
      console.log('remote 开始接受远端流')
  }
}


function handleConnectionChange(event) {
  const peerConnection = event.target;
  console.log('ICE state change event: ', event);
  console.log(`${getPeerName(peerConnection)} ICE state: ` + `${peerConnection.iceConnectionState}.`);
}

function handleConnectionSuccess(peerConnection) {
  console.log(`${getPeerName(peerConnection)} addIceCandidate 成功`);
}

function handleConnectionFailure(peerConnection, error) {
  console.log(`${getPeerName(peerConnection)} addIceCandidate 错误:\n`+ `${error.toString()}.`);
}

function getPeerName(peerConnection) {
  return (peerConnection === localPeerConnection) ? 'localPeerConnection' : 'remotePeerConnection';
}

function getOtherPeer(peerConnection) {
  return (peerConnection === localPeerConnection) ? remotePeerConnection : localPeerConnection;
}

```

### 修改为vue下    
```
<template>
  <div id="app">
    
    <video id="localVideo" autoplay width="320" height="240" style="background: #333;" controls></video>
    <video id="remoteVideo" autoplay width="320" height="240" style="margin-left: 5px;"></video>    

    <div style="margin-top: 20px;">
      <el-button type="primary" :disabled="callBtn" @click="startHandle">建立连接</el-button>
      <el-button type="primary" :disabled="hangupBtn" @click="hangupHandle">断开连接</el-button>
    </div>

  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      // 本地流和远端流
      localStream: "",
      remoteStream: "",

      // 本地和远端连接对象
      localPeerConnection: "",
      remotePeerConnection: "",

      // 本地视频和远端视频
      localVideo: document.getElementById("localVideo"),
      remoteVideo: document.getElementById("remoteVideo"),

      // 设置约束
      mediaStreamConstraints: {
        video: true,
        audio: true
      },

      // 设置仅交换视频
      offerOptions: {
        offerToReceiveVideo: 1,
      },

      callBtn: false,
      hangupBtn: true,
    };
  },
  methods: {
    startHandle() {
      // 1.获取本地音视频流
      // 调用 getUserMedia API 获取音视频流
      navigator.mediaDevices.getUserMedia(this.mediaStreamConstraints)
        .then(mediaStream => {
          // getUserMedia 获得流后，将音视频流展示并保存到 localStream
          this.localVideo.srcObject = mediaStream;
          this.localStream = mediaStream;

          this.callHandle();
        })
        .catch(err => {
          this.$message.error(`摄像头打开失败：${err}`);
        });
    },

    callHandle() {
      this.callBtn = true;
      this.hangupBtn = false;

      // 视频轨道
      const videoTracks = this.localStream.getVideoTracks();
      // 音频轨道
      const audioTracks = this.localStream.getAudioTracks();

      // 判断视频轨道是否有值
      if (videoTracks.length > 0) {
        console.log(`使用的设备为: ${videoTracks[0].label}.`);
      }
      // 判断音频轨道是否有值
      if (audioTracks.length > 0) {
        console.log(`使用的设备为: ${audioTracks[0].label}.`);
      }
      
      // 创建 RTCPeerConnection 对象
      this.localPeerConnection = new RTCPeerConnection();
      // 监听返回的 Candidate
      this.localPeerConnection.addEventListener(
        "icecandidate",
        this.handleConnection
      );
      // 监听 ICE 状态变化
      this.localPeerConnection.addEventListener(
        "iceconnectionstatechange",
        this.handleConnectionChange
      );

      this.remotePeerConnection = new RTCPeerConnection();
      this.remotePeerConnection.addEventListener(
        "icecandidate",
        this.handleConnection
      );
      this.remotePeerConnection.addEventListener(
        "iceconnectionstatechange",
        this.handleConnectionChange
      );
      this.remotePeerConnection.addEventListener(
        "track",
        this.gotRemoteMediaStream
      );

      // 将音视频流添加到 RTCPeerConnection 对象中
      // 注意：新的协议中已经不再推荐使用 addStream 方法来添加媒体流，应使用 addTrack 方法
      // localPeerConnection.addStream(localStream);
      // 遍历本地流的所有轨道
      this.localStream.getTracks().forEach((track) => {
        this.localPeerConnection.addTrack(track, this.localStream);
      });

      // 2.交换媒体描述信息
      this.localPeerConnection
        .createOffer(this.offerOptions)
        .then(this.createdOffer)
        .catch((err) => {
          this.$message.error(`createdOffer 错误：${err}`);
        });
    },

    hangupHandle() {
      // 关闭连接并设置为空
      this.localPeerConnection.close();
      this.remotePeerConnection.close();
      this.localPeerConnection = null;
      this.remotePeerConnection = null;
      this.hangupBtn = true;
      this.callBtn = false;
    },

    createdOffer(description) {
      console.log(`本地创建offer返回的sdp:\n${description.sdp}`);
      // 本地设置描述并将它发送给远端
      // 将 offer 保存到本地
      this.localPeerConnection
        .setLocalDescription(description)
        .then(() => {
          console.log("local 设置本地描述信息成功");
        })
        .catch((err) => {
          console.log("local 设置本地描述信息错误", err);
        });
      // 远端将本地给它的描述设置为远端描述
      // 远端将 offer 保存
      this.remotePeerConnection
        .setRemoteDescription(description)
        .then(() => {
          console.log("remote 设置远端描述信息成功");
        })
        .catch((err) => {
          console.log("remote 设置远端描述信息错误", err);
        });
      // 远端创建应答 answer
      this.remotePeerConnection
        .createAnswer()
        .then(this.createdAnswer)
        .catch((err) => {
          console.log("远端创建应答 answer 错误", err);
        });
    },

    createdAnswer(description) {
      console.log(`远端应答Answer的sdp:\n${description.sdp}`);
      // 远端设置本地描述并将它发给本地
      // 远端保存 answer
      this.remotePeerConnection
        .setLocalDescription(description)
        .then(() => {
          console.log("remote 设置本地描述信息成功");
        })
        .catch((err) => {
          console.log("remote 设置本地描述信息错误", err);
        });
      // 本地将远端的应答描述设置为远端描述
      // 本地保存 answer
      this.localPeerConnection
        .setRemoteDescription(description)
        .then(() => {
          console.log("local 设置远端描述信息成功");
        })
        .catch((err) => {
          console.log("local 设置远端描述信息错误", err);
        });
    },


    handleConnection(event) {
      // 3.端与端建立连接
      // 获取到触发 icecandidate 事件的 RTCPeerConnection 对象
      // 获取到具体的Candidate
      const peerConnection = event.target;
      const iceCandidate = event.candidate;

      if (iceCandidate) {
        // 创建 RTCIceCandidate 对象
        const newIceCandidate = new RTCIceCandidate(iceCandidate);
        // 得到对端的 RTCPeerConnection
        const otherPeer = this.getOtherPeer(peerConnection);

        // 将本地获得的 Candidate 添加到远端的 RTCPeerConnection 对象中
        // 为了简单，这里并没有通过信令服务器来发送 Candidate，直接通过 addIceCandidate 来达到互换 Candidate 信息的目的
        otherPeer
          .addIceCandidate(newIceCandidate)
          .then(() => {
            this.handleConnectionSuccess(peerConnection);
          })
          .catch((error) => {
            this.handleConnectionFailure(peerConnection, error);
          });
      }
    },


    gotRemoteMediaStream(event) {
      // 4.显示远端媒体流
      if (this.remoteVideo.srcObject !== event.streams[0]) {
        this.remoteVideo.srcObject = event.streams[0];
        this.remoteStream = event.streams[0];
        console.log("remote 开始接受远端流");
      }
    },

    handleConnectionChange(event) {
      const peerConnection = event.target;
      console.log("ICE state change event: ", event);
      console.log(
        `${this.getPeerName(peerConnection)} ICE state: ` +
          `${peerConnection.iceConnectionState}.`
      );
    },
    handleConnectionSuccess(peerConnection) {
      console.log(`${this.getPeerName(peerConnection)} addIceCandidate 成功`);
    },
    handleConnectionFailure(peerConnection, error) {
      console.log(
        `${this.getPeerName(peerConnection)} addIceCandidate 错误:\n` +
          `${error.toString()}.`
      );
    },
    getPeerName(peerConnection) {
      return peerConnection === this.localPeerConnection
        ? "localPeerConnection"
        : "remotePeerConnection";
    },
    getOtherPeer(peerConnection) {
      return peerConnection === this.localPeerConnection
        ? this.remotePeerConnection
        : this.localPeerConnection;
    },
  },
  mounted() {
    this.localVideo = document.getElementById("localVideo");
    this.remoteVideo = document.getElementById("remoteVideo");

    this.localVideo.addEventListener('pause', this.hangupHandle);
    this.localVideo.addEventListener('play', this.callHandle);
  }
};
</script>
```

### vue中和后端配合实现推流
在项目实践中主要针对推流，推流之后调用后端接口，实现应答。    
![流程简析](./toc/images/js/其它01.png)    

在vue中用推流
```
// 因为大多数方法都返回 promise ，封装一个async awite 方法    awaitWrap.js
export default (promise) => {
  return promise
    .then(data =>[data, null])
    .catch(err =>[null, err])
}


// 推流页
<template>
  <div>
    
    <video id="localVideo" autoplay width="320" height="240" style="background: #333;"></video>

    <div style="margin-top: 20px;">
      <el-button type="primary" :disabled="callBtn" @click="startHandle">建立连接</el-button>
      <el-button type="primary" :disabled="hangupBtn" @click="hangupHandle">断开连接</el-button>
    </div>

  </div>
</template>

<script>
import request from "@/api/request";
import awaitWrap from '@/utils/awaitWrap';
export default {
  name: "App",
  data() {
    return {
      // 本地流
      localStream: "",

      // 本地连接对象
      localPeerConnection: "",

      // 本地视频
      localVideo: document.getElementById("localVideo"),

      // 设置约束
      mediaStreamConstraints: {
        audio: true,
        video: {
            width: {ideal: 320, max: 576}
        }
      },

      // 设置交换视频
      offerOptions: {
        offerToReceiveVideo: true,
        offerToReceiveAudio: true
      },
      
      // 按钮状态
      callBtn: false,
      hangupBtn: true,
    };
  },
  methods: {
    async startHandle() {
      // 1.获取本地音视频流
      // 调用 getUserMedia API 获取音视频流
      const [mediaStream, mediaStreamErr] = await awaitWrap(navigator.mediaDevices.getUserMedia(this.mediaStreamConstraints));
      if(mediaStreamErr) {
        this.$message.error(`摄像头打开失败：${mediaStreamErr}`);
        return;
      }
      console.log(mediaStream);
      this.localVideo.srcObject = mediaStream;
      this.localStream = mediaStream;

      // 2. 建立连接  
      this.callBtn = true;
      this.hangupBtn = false;

      // 创建 RTCPeerConnection 对象
      this.localPeerConnection = new RTCPeerConnection(null);

      // 将音视频流添加到 RTCPeerConnection 对象中
      // 注意：新的协议中已经不再推荐使用 addStream 方法来添加媒体流，应使用 addTrack 方法
      // localPeerConnection.addStream(localStream);
      // 遍历本地流的所有轨道
      this.localStream.getTracks().forEach(track => {
        this.localPeerConnection.addTrack(track, this.localStream);
      });

      // 3.交换媒体描述信息，创建offer，返回description
      const [description, descriptionErr] = await awaitWrap(this.localPeerConnection.createOffer(this.offerOptions));
      if(descriptionErr) {
        this.$message.error(`createdOffer 错误：${descriptionErr}`);
        return;
      }
      console.log(`本地创建offer成功`);

      // 4. 本地设置描述
      const [localDescription, localDescriptionErr] = await awaitWrap(this.localPeerConnection.setLocalDescription(description));
      if(localDescriptionErr) {
        this.$message.error(`local 设置本地描述信息错误：${localDescriptionErr}`);
        return;
      }
      console.log(`local 设置本地描述信息成功：${localDescription}`);

      // 调取接口连接远端，获取远端应答
      const [anwser, anwserErr] = await awaitWrap(request.post("/rtc/v1/publish/", {
        clientip: null,
        sdp: description.sdp,
        streamurl: "webrtc://192.168.0.149/live/livestream",
        tid: Number(parseInt(new Date().getTime()*Math.random()*100)).toString(16).substr(0, 7)
      }));
      if(anwserErr) {
        this.$message.error(`远端连接失败：${anwserErr}`);
        return;
      }

      // 本地将远端的应答描述设置为远端描述
      // 本地保存 answer
      this.localPeerConnection.setRemoteDescription({type: 'answer', sdp: anwser.sdp}).then(() => {
        console.log("local 设置远端描述信息成功");
      }).catch(err => {
        console.log("local 设置远端描述信息错误", err);
      });

    },

    hangupHandle() {
      // 关闭连接并设置为空
      this.localPeerConnection.close();
      this.localPeerConnection = null;
      this.localVideo.srcObject = null;
      this.localStream = null;
      this.hangupBtn = true;
      this.callBtn = false;
    }
  },
  mounted() {
    this.localVideo = document.getElementById("localVideo");

    // this.localVideo.addEventListener('pause', this.hangupHandle);
    // this.localVideo.addEventListener('play', this.callHandle);
  }
};
</script>
```
## 压缩图片
```
// 将base64码转为图片文件类型
function dataURLtoFile(dataurl: any, fileName: string) {
  const base64 = window.atob(dataurl.split(',')[1]);   // 去掉dataUrl头部，取到base64
  const type = dataurl.split(',')[0].match(/:(.*?);/)[1];   // 从dataUrl头部获取文件类型
  // 处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(base64.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < base64.length; i++) {
    ia[i] = base64.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: type }); // Blob对象
  const file = new File([blob], fileName + '.gif'); // file对象
  return file;
}

// 压缩图片(尽量2M)
function compressImg(file: File) {
  const fileSize: number = Number(parseFloat((file['size'] / 1024 / 1024).toString()).toFixed(2))
  const read = new FileReader()
  read.readAsDataURL(file)
  return new Promise(function(resolve, reject) {
    read.onload = function(e) {
      const img = new Image()
      img.src = <any>e.target?.result
      img.onload = function() {
        // 默认按比例压缩
        const w = img.width
        const h = img.height
        // 这三行防止部分ios会因为canvas宽高导致后续生成空白base64
        const scale = w / h
        const rw = w > 1400 ? 1400 : w
        const rh = rw / scale
        // 生成canvas
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let base64
        // 创建属性节点  
        canvas.setAttribute('width', rw.toString())
        canvas.setAttribute('height', rh.toString())
        ctx?.drawImage(img, 0, 0, rw, rh)
        let quality = 1
        switch(Math.ceil(fileSize / 2)) {
          case 1: quality = 0.9; break;
          case 2: quality = 0.45; break;
          case 4: quality = 0.2; break;
          case 5: quality = 0.15; break;
          default: quality = 0.1
        }
        base64 = canvas.toDataURL(file['type'], quality)
        // 回调函数返回file的值（将base64编码转成file）
        resolve(dataURLtoFile(base64, file.name))
      }
    }
  })
}
```

# 项目中的一些问题
## 根据数组某个元素循环请求api，按顺序获得相应值
![项目图片](./toc/images/js/项目01.png)
![项目图片](./toc/images/js/项目02.png)
描述：获取详情页，内部含有一个申请表格，根据表格内部项目id按顺序再生成对应的表格。相当于是先请求了一个接口获得一个数组，后需要再根据这个数组内的各个id获取相应的值整合成为新数组，循环展示表格。    
思路：api请求是异步操作，直接按数组id循环请求，push到新数组中，很可能和原数组顺序不一致，在需要保证先后值的前提下，将请求放入数组中，考虑用promise.all或者async。    
**1、直接push**     
顺序随机  
```
projectList: [
  {id: 0, name: 'aaa'},
  {id: 1, name: 'bbb'}
]
_.forEach(projectList, item => {
  api.getList({ id: item.id }).then(res => {
    this.list.push(res.data)
  })
})
```
**2、promise.all**    
将api请求循环放入数组中，通过promise.all执行     
```
let atemp = _.map(projectList, item => 
  // 使用Promise用于异步计算
  new Promise((resolve, reject) => {
    api.getList({ id: item.id }).then(res => {
      resolve(res)
    }, err => {
      reject(err)
    })
  })
)
Promise.all(atemp).then(res => {
  // 全部执行结束，保证执行顺序
  console.log(res);
  res是两个api返回数据组成得数组
  //数据处理
  ···
}).catch(err => {
  console.log('error', err)
})
```
**3、单个表格还需要分页**      
需要一个对应的分页数组，切换分页时需要判断是哪一个表格，再调取接口修改相应的一个表格数据
```
// 拼接请求参数
this.reimburseRecords = _.map(projectList, item => {
  return {
    project_id: item.project_id,
    limit: 10,
    page: 1
  }
})
// 拼接请求顺序
let atemp = _.map(projectList, (item, index) => this.getHistoryReim(index));
// 全部执行结束，保证执行顺序
Promise.all(atemp).then(res => {
  this.reimburseRecordsList = res;
}).catch(err => {
  console.log('error', err)
})
getHistoryReim(index) {
  // 获取记录
  return new Promise((resolve, reject) => {
    ApplyApi.getHistoryReim(this.reimburseRecords[index]).then(res => {
      if(res.data.data.length !== 0) {
        // 如果需要在最后一行添加一些内容
        res.data.data.push({
          id: 'sum',
          contract_number: '项目签约金额',
          party_a: res.data.meta.custom.signed_money + '万元',
          project_name: '已报销金额总计',
          project_type: res.data.meta.custom.reimburse_money + '万元',
          reimburse_fee: -1,
          reimburse_fee_type_name:  res.data.meta.custom.loan_strike_a_balance_money_not + '万元',
          created_at: ' '
        })
      }
      resolve(res.data.data);
    }, err => {
      this.$message.error(err.data.message)
      reject(err)
    })
  })
}
handleSizeChange (val, index) {
  // 切换每页条数
  this.reimburseRecords[index].limit = val;
  this.getHistoryReim(index).then(res => {
    this.$set(this.reimburseRecordsList, index, res);
  })
},
handleCurrentChange (val, index) {
  // 切换当前页
  this.reimburseRecords[index].page = val;
  this.getHistoryReim(index).then(res => {
    this.$set(this.reimburseRecordsList, index, res);
  })
},
```
## 平级数组转化多层父子级
```
function delTreeData(treeArr, id, parentId, childrenList) {
  let cloneData = JSON.parse(JSON .stringify(treeArr));
  return cloneData.filter(fatherItem => {
      let warpArr = cloneData.filter(sonItem => fatherItem[id] === sonItem[parentId]);
      warpArr.length ? fatherItem[childrenList] = warpArr : null;
      return !fatherItem[parentId];
  })
}

console.log(delTreeData([
  { id: '1', number: '1', parentId: '' },
  { id: '2', number: '2', parentId: '' },
  { id: '3', number: '3', parentId: '' },
  { id: '1-1', number: '1-1', parentId: '1' },
  { id: '1-1-1', number: '1-1-1', parentId: '1-1' },
  { id: '3-1', number: '3-1', parentId: '3' },
  { id: '1-2', number: '1-2', parentId: '1' }
], 'id', 'parentId', 'children'));
```
## 替换数组对象key值
**1. 无子级嵌套，id替换为value，name替换为label**
```
function replaceKey(arr) {
  const arrCopy = JSON.parse(JSON.stringify(arr));
  return arrCopy.map(o => {
    const { id: value, name: label } = o;
    delete o.id;
    delete o.name;
    return { label, value, ...o }
  })
}
const arr = [
  { id: 1, name: 1, age: 11, height: 1.1 },
  { id: 2, name: 2, age: 12, height: 1.2 },
  { id: 3, name: 3, age: 13, height: 1.3 }
]
console.log(replaceKey(arr));
```
**2. 含子级嵌套，id替换为value，name替换为label**
```
function replaceKey(arr) {
  const arrCopy = JSON.parse(JSON.stringify(arr));
  return arrCopy.map(item => {
    Object.keys(item).forEach(key => {
      if(Object.prototype.toString.call(item[key]) === '[object Array]') {
        item[key] = replaceKey(item[key]);
      }
      // 如果 arr 中含有其它数组，只替换 children 中 key 值，最好以这种形式判断，当然 children 可以传参形式判断
      // if(key === 'children') {
      //   item[key] = replaceKey(item[key]);
      // }
    })
    const { id: value, name: label } = item;
    delete item.id;
    delete item.name;
    return { label, value, ...item }
  })
}
const arr = [
  { id: '1', name: '1', age: '11', height: '1.1' },
  { id: '2', name: '2', age: '12', height: '1.2', children: [
    { id: '2-1', name: '2-1', age: '12-1', height: '1.2-1' },
    { id: '2-2', name: '2-2', age: '12-2', height: '1.2-2', children: [
      { id: '2-2-1', name: '2-2-1', age: '12-2-1', height: '1.2-2-1', children: [
        { id: '2-2-1-1', name: '2-2-1-1', age: '12-2-1-1', height: '1.2-2-1-1'}
      ]}
    ]},
    { id: '2-3', name: '2-3', age: '12-3', height: '1.2-3' }
  ]},
  { id: '3', name: '3', age: '13', height: '1.3' },
  { id: '4', name: '4', age: '14', height: '1.4', children: [
    { id: '4-1', name: '4-1', age: '14-1', height: '1.4-1' }
  ]}
]
console.log(replaceKey(arr), arr);
```
**3. 含子级嵌套，自定义更换的key值**
```
/**
* @function 替换数组对象key
* @params arr {Array} 原数组
* @params obj {Object} 替换配置  sub => 子级嵌套也需要替换的
* @return {Array} 替换后的数组
*/
function replaceKey(arr, obj) {
  const arrCopy = JSON.parse(JSON.stringify(arr));
  return arrCopy.map(item => {
    Object.keys(item).forEach(key => {
      if(obj.sub.includes(key)) {
          item[key] = replaceKey(item[key], obj);
      }
      // Object.keys(obj.replaceKeys).forEach(replaceKey => {
      //   if(key === replaceKey) {
      //     item[obj.replaceKeys[replaceKey]] = item[key];
      //     delete item[key];
      //   }
      // })
      for(let replaceKey in obj.replaceKeys) {
        if(key === replaceKey) {
          item[obj.replaceKeys[replaceKey]] = item[key];
          delete item[key];
          break;
        }
      }
    })
    return item;
  })
}
const arr = [
  { id: '1', name: '1', age: '11', height: '1.1', books: ['a', 'b'] },
  { id: '2', name: '2', age: '12', height: '1.2', children: [
    { id: '2-1', name: '2-1', age: '12-1', height: '1.2-1' },
    { id: '2-2', name: '2-2', age: '12-2', height: '1.2-2', children: [
      { id: '2-2-1', name: '2-2-1', age: '12-2-1', height: '1.2-2-1', children: [
        { id: '2-2-1-1', name: '2-2-1-1', age: '12-2-1-1', height: '1.2-2-1-1'}
      ]}
    ]},
    { id: '2-3', name: '2-3', age: '12-3', height: '1.2-3' }
  ]},
  { id: '3', name: '3', age: '13', height: '1.3' },
  { id: '4', name: '4', age: '14', height: '1.4', children: [
    { id: '4-1', name: '4-1', age: '14-1', height: '1.4-1', child: [
      { id: '4-1-1l', name: '4-1-1l', age: '14-1-1l', height: '1.4-1-1l' }
  ]}
  ], child: [
      { id: '4-1l', name: '4-1l', age: '14-1l', height: '1.4-1l' }
  ], childC: [
      { id: '4-1c', name: '4-1c', age: '14-1c', height: '1.4-1c' }
  ]},
]
console.log(replaceKey(arr, { 
  replaceKeys: { id: 'value', name: 'label' },
  sub: ['children', 'child']
}));
```

# 题库
## 小测试
### 简单运算
```
true + false      // 1
[,,,].length      // 3
[1, 2, 3] + [4, 5, 6]      // "1,2,34,5,6"
0.2 + 0.1 === 0.3       // false
10,2      // 2
!!""      // false
+!![]      // 1
!!!true      // false
true == "true"       // false
010 - 03      // 5
```
```
"" - - ""      // 0
null + 0       // 0
0/0            // NaN
1/0 > Math.pow(10, 1000)       // false
true++       // SyntaxError
"" - 1        // -1
(null - 0) + "0"      // "00"
true + ("true" - 0)      // NaN
!5 + !5       // 0
[] + []       // ""
```
```
+0 === -0      // true
```
### 解释以下代码
```
[].forEach.call($$("*"), function(a){ 
  a.style.outline = "1px solid #" + (~~(Math.random()*(1<<24))).toString(16) 
})

表示 给DOM元素添加不同颜色的边框
[].forEach.call() => 调用引用数组的forEach方法
$$('*') => document.querySelectorAll('*')
~~a => parseInt(a)
1<<24 => 对二进数1小数点右移24位
(parseInt(Math.random()*(1<<24)).toString(16)) => 获得了一个位于0-16777216之间的随机整数，也就是随机颜色，再使用toString(16)将它转化为十六进制数

注意：在控制台测试生效，在js中报错 $$未定义
```
## 数字
### 将-0转换成字符串输出
```
const a = -0;
console.log(a);  //-0（Number）
console.log(a.toString());  // 0
console.log(a.toLocaleString());   //-0
```
## 字符串
### 去除字符串中最后一个指定字符   
注意：不是字符串最末尾的字符   
初步想法
```
function PopStr(str, char) {
  if(typeof(str) !== 'string') {
    return '非字符串';
  }
  if(str.indexOf(char) === -1) {
    return `不含${char}字符`;
  }
  const index = str.lastIndexOf(char);   
  // return str.substring(0, index) + str.substring(index + 1, str.length);    // 提取字符串中两个指定的索引号之间的字符。
  // return str.substr(0, index) + str.substr(index + 1, str.length - index);   // 从起始索引号提取字符串中指定数目的字符。
                                                                                // ECMAscript 没有对该方法进行标准化，因此反对使用它
  return str.slice(0, index) + str.slice(index + 1, str.length);   // 提取字符串的片断(两个索引)，并在新的字符串中返回被提取的部分。
}
console.log(PopStr('abcsdfdsf', 's'));  //abcsdfdf
console.log(PopStr(1, 's'));  //非字符串
console.log(PopStr('abcsdfdsf', 'z'));  //不含z字符
```
看到的别人的解法
```
function delLast(str, target) {
  return str.split('').reverse().join('').replace(target, '').split('').reverse().join('');
}
console.log(delLast('asdfghhj', 'h'))   // asdfghj
console.log(delLast('asdfghhj', 'z'))   // asdfghhj
console.log(delLast(1, 'a'))   // 报错，str.split is not a function
```
```
function delLast(str,target) {
  let reg =new RegExp(`${target}(?=([^${target}]*)$)`)
  return str.replace(reg,'')
}
console.log(delLast('asdfghhj', 'h'))   // asdfghj
console.log(delLast('asdfghhj', 'z'))   // asdfghhj
console.log(delLast(1, 'a'))   // 报错，str.replace is not a function
```
后面相关示例不再判断类型   
### 把下划线命名转成驼峰命名  
```
function toUp(name) {
  return name.split('_').map((o, i) => {
    if(i === 0) {
      return o;
    }
    else {
      return o.charAt(0).toUpperCase() + o.substring(1, o.length);
    }
  }).join('');
}
console.log(toUp('first_name_abc'));   //firstNameAbc 
``` 
### 把字符串中的字符切换大小写   
```
function strConvert(str) {
  return str.split('').map(o => {
    if(o.charCodeAt() < 97) return o.toLowerCase();
    else return o.toUpperCase();
  }).join('');
}
console.log(strConvert('AbCddzGg'));  //aBcDDZgG
```
### 统计一个字符串中另一个字符串出现的次数
```
function sumStr(str, subStr) {
  return str.split(subStr).length - 1;
}
console.log(sumStr('abcfgfhbcskdfbcbc', 'bc'));  //4
console.log(sumStr('abcfgfhbcskdfbcbc', 'qqq'));  //0
console.log(sumStr('abcfgfhbcskdfbcbc', 'f'));  //3
```
### 简单的字符串加密解密
```
<script type="text/javascript">
  var oStr = "中国人";
  var obj = compileStr(oStr);
  console.log(obj);
  var objStr = uncompileStr(obj);
  console.log(objStr);
  //对字符串进行加密   
  function compileStr(code){
      var c=String.fromCharCode(code.charCodeAt(0)+code.length);  
      for(var i=1;i<code.length;i++){        
          c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));  
      }     
      return escape(c);
  }
  //字符串进行解密   
  function uncompileStr(code){
      code = unescape(code);        
      var c=String.fromCharCode(code.charCodeAt(0)-code.length);        
      for(var i=1;i<code.length;i++){        
          c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));        
      }        
      return c;
  }  
</script>
```

## 数组
### 递归实现数组长度为5且元素为2-32间不重复的值   
> 1. 生成一个长度为5的空数组arr。
> 2. 生成一个（2－32）之间的随机整数rand。
> 3. 把随机数rand插入到数组arr内，如果数组arr内已存在与rand相同的数字，则重新生成随机数rand并插入到arr内，**需要使用递归实现，不能使用for/while等循环**
> 4. 最终输出一个长度为5，且内容不重复的数组arr   

代码演示
```
let length = 5, i = 0;
let arr = new Array(length);
function build() {
  let rand = Math.floor(Math.random() * 31 + 2);  //31 => 32-2+1
  if(!arr.includes(rand)) {
    arr[i] = rand;
    i++;
  }
  return arr[length-1] ? arr : build();
}
console.log(build());
```
### 获取数组最大值最小值
```
// 初步想法
function getMaxMin(arr) {
  return { 
    max: arr.reduce((r1, r2) => r1 > r2 ? r1 : r2 ), 
    min: arr.reduce((r1, r2) => r1 < r2 ? r1 : r2 )
  }
}
console.log(getMaxMin([1, 6, 0, 9, 2]));   // { max: 9, min: 0 }
```
```
// 学习别人的
function getMaxMin(arr) {
  return { 
    max: Math.max.apply(Array, arr), 
    min: Math.min.apply(Array, arr)
  }
}
```
## 对象
### 修改对象属性
```
const obj = {
  name: 'T',
  height: 170
}
console.log(obj);
console.log(obj.height);
obj.height = 180;
```  
![项目图片](./toc/images/js/题库编程-基础01.png)   
* 不展开对象看时，console.log()是按照代码执行顺序，同步地输出了对象当时的快照（只输出一个对象的引用）。所以我们看到的是预期的值。   
* 展开对象时，它其实是重新去内存中读取对象的属性值，此时对象属性已被更改，所以展开对象后，可能看到的不是预期值了。   
* console.log()在控制台输出引用值时确实是当时的值，但是你点开箭头的时候它会重新获取这些引用的值。    

当我们在输出对象时我们看到的数据是异步处理最终的值，**但是当我们仅输出对象中的某一key时，输出的值就是当前的值**，从中我们可以看出实际上不同的浏览器实际异步处理的是对象的引用，当我们console.log输出对象时调用的是一个引用，如果我们仅输出其中的值，浏览器就不会进行异步处理输出最终的调用值。同理使用JSON.stringfy一样，浏览器仅仅异步处理对象，并不会处理序列化JSON字符串，所有输出的数据是当前的值，而不是最终值。  

console.log()打印出来的内容并不是一定百分百可信的内容。一般对于基本类型number、string、boolean、null、undefined的输出是可信的，但对于Object等引用类型来说，则就会出现上述异常打印输出。    
**将对象序列化JSON.stringify为字符串**
```
const obj = {
  name: 'T',
  height: 170
}
console.log(JSON.parse(JSON.stringify(obj)));
obj.height = 180;
```
![项目图片](./toc/images/js/题库编程-基础02.png)   

## 其他
### 获取URL地址栏参数
> url: baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=js获取url参数   

```
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
          var pair = vars[i].split("=");
          if(pair[0] == variable){return pair[1];}
  }
  return(false);
}
console.log(getQueryVariable('ie'));    // utf-8
console.log(getQueryVariable('name'));  // false
```
```
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}
console.log(getQueryVariable('ie'));    // utf-8
console.log(getQueryVariable('name'));  // null
```
```
let params = new URLSearchParams(location.search);
console.log(params.get('ie'))    // utf-8
console.log(params.get('name'))  // null
```
### 网页应用从服务器主动推送数据到客户端
例如订单方面，实时推送消息给商家或者用户    

**1、comet：基于HTTP长连接的服务器推送技术**  
comet是一种用于Web的推送技术，能使服务器实时地将更新的信息传送到客户端，而无须客户端发出请求。  
 
**（1）、ajax轮询**   
用定时器每隔一段时间就轮询一次（重新调取接口），更新信息，相当于客户端不断的向服务器发起请求。   

实现简单，但这是通过模拟服务器发起的通信，不是实时通信，无论应用状态是否改变，都会更新，导致服务器资源的浪费，且会加重网络负载，拖累服务器。  

**（2）、长轮询**  
长轮询 (long polling)：在打开一条连接以后保持，等待服务器推送来数据再关闭，可以采用HTTP长轮询和XHR长轮询两种方式。

HTTP 和JSONP方式的长轮询: 把 script 标签附加到页面上以让脚本执行。服务器会挂起连接直到有事件发生，接着把脚本内容发送回浏览器，然后重新打开另一个 script 标签来获取下一个事件，从而实现长轮询的模型。  
XHR长轮询：客户端打开一个到服务器端的 AJAX 请求然后等待响应；服务器端需要一些特定的功能来允许请求被挂起，只要一有事件发生，服务器端就会在挂起的请求中送回响应并关闭该请求。客户端 JavaScript 响应处理函数会在处理完服务器返回的信息后，再次发出请求，重新建立连接；如此循环。   

现在浏览器已经支持CROS的跨域方式请求，因此HTTP和JSONP的长轮询方式是慢慢被淘汰的一种技术，建议采用XHR长轮询。  

客户端很容易实现良好的错误处理系统和超时管理，实现成本与Ajax轮询的方式类似。但需要服务器端有特殊的功能来临时挂起连接。当客户端发起的连接较多时，服务器端会长期保持多个连接，具有一定的风险。HTTP 1.1 规范中规定，客户端不应该与服务器端建立超过两个的 HTTP 连接， 新的连接会被阻塞，在IE浏览器中严格遵守了这种规定。  

**（3）、iframe**  
通过在 HTML 页面里嵌入一个隐蔵帧，然后将这个隐蔵帧的 SRC 属性设为对一个长连接的请求，服务器端就能源源不断地往客户端输入数据。  

这种方式每次数据传送不会关闭连接，连接只会在通信出现错误时，或是连接重建时关闭（一些防火墙常被设置为丢弃过长的连接， 服务器端可以设置一个超时时间， 超时后通知客户端重新建立连接，并关闭原来的连接）。   

**2、websocket**  
WebSocket是HTML5开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。WebSocket通讯协议于2011年被IETF定为标准RFC 6455，WebSocketAPI被W3C定为标准。在WebSocket API中，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一条快速通道。两者之间就直接可以数据互相传送。但是兼容性不高，很多浏览器不支持。

### 返回页面顶部
[Js实现返回页面顶部（从实现到增强）](https://www.cnblogs.com/art-poet/p/13755083.html)

### 判断设备来源
```
// 判断移动端设备
function deviceType() {
  const ua = navigator.userAgent;
  const agent = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
  for (let i = 0, len = agent.length; i < len; i++) {
    if (ua.indexOf(agent[i]) > 0) {
      return agent[i];
      break;
    }
  }
}
console.log(`您当前使用的是：${deviceType()}`);

// 判断微信浏览器
function isWeixin(){
  const ua = navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i)=='micromessenger'){
    return true;
  }else{
    return false;
  }
}
```
