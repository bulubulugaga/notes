# 数组

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

# 深浅拷贝
## js数据类型及其存储
1、 基本数据类型：数值(number)、字符串(string)、布尔(boolean)、null、undefined   
2、 引用数据类型：对象(数组、正则表达式、日期、函数)   

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
>浅拷贝只复制指向某个对象的指针，而不复制对象本身，新旧对象还是共享同一块内存。但深拷贝会另外创造一个一模一样的对象，新对象跟原对象不共享内存，修改新对象不会改到原对象。

1、浅拷贝    
浅拷贝只是拷贝基本类型的数据，如果父对象的属性等于数组或另一个对象，那么实际上，子对象获得的只是一个内存地址，因此存在父对象被篡改的可能，浅拷贝只复制指向某个对象的指针，而不复制对象本身，新旧对象还是共享同一块内存。

浅拷贝函数
```
function simpleClone(initalObj) {    
  var obj = {};    
  for ( var i in initalObj) {
    obj[i] = initalObj[i];
  }    
  return obj;
}
```

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

## 深拷贝实现方式
1、以上深拷贝函数    

2、JSON.stringify 和 JSON.parse   
> 可以转成 JSON 格式的对象才能使用这种方法，如果对象中包含 function 或 RegExp 这些就不能用这种方法了。 

```
function deepClone(obj) {
  let _obj = JSON.stringify(obj);
  let objClone = JSON.parse(_obj);
  return objClone;
}
或者
copy = JSON.parse(JSON.stringify(obj));
```

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
