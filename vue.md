# 代码规范
## v-for和v-if一起使用
当 v-if 与 v-for 一起使用时，v-for 具有比 v-if 更高的优先级，这意味着 v-if 将分别重复运行于每个 v-for 循环中。所以，不推荐v-if和v-for同时使用。   
```
plans: [
  { id: 0, stage: '预付款', due_money: 0 },
  { id: 1, stage: '待付款', due_money: 2 },
  { id: 2, stage: '已付款', due_money: -1 },
  { id: 3, stage: '啦啦啦', due_money: 30 },
  { id: 4, stage: '其它', due_money: 10 },
]
```
```
<div v-for="item in plans" :key="item.id" v-if="item.due_money > 0">
  <span>{{type.stage + ' ' + type.due_money}}</span>
</div>
```
如果是按照条件渲染相应div，其实这样写对页面没问题，但在vue3中调整了优先级，对维护有麻烦，还是不太建议这么做。   
可以用计算属性过滤不符合的元素。
```
<div v-for="item in plansData" :key="item.id">
  <span>{{type.stage + ' ' + type.due_money}}</span>
</div>

computed: {
  plansData() {
    return plans.filter(o => o.due_money > 0);
  }
}
```
如果是在表格中，每行元素不确定的情况下，可用计算属性传参。
```
<el-table-column>
  <template slot-scope="scope">
    <div v-for="item in Plans(scope.row.plans)" :key="item.id">
      <span>{{type.stage + ' ' + type.due_money}}</span>
    </div>
  </template>
</el-table-column>

computed: {
  plansData() {
    return data => data.filter(o => o.due_money > 0);
  }
}
```
# 相关模块引用
## async
<a href="https://www.npmjs.com/package/async" target="_blank">npm更新(https://www.npmjs.com/package/async)</a><br />
<a href="https://caolan.github.io/async/v3/" target="_blank">文档(https://caolan.github.io/async/v3/)</a><br />

可用于解决异步操作顺序问题，可以代替promise的部分操作，比promise简洁    

> func(tasks,[callback])    
> tasks-函数名列表，callback里面一般含两个参数(err, res)，参数顺序似乎不可以修改，res如果返回结果数组，按函数列表顺序组成数组。      
> 函数如果需要返回错误或者结果，函数传参，内部调用callback(err, res)；无错误返回callback(null, res)；callback(arg)表示返回了一个错误提示。   
### parallel(tasks,[callback])
函数之间并行进行，互不干扰。
```
fun1(cb) {
  console.log('a');
  setTimeout(() => {
    cb(null, 'a');
  }, 1000)
},
fun2(cb) {
  console.log('b');
  setTimeout(() => {
    cb(null, 'b');
  }, 200)
},
fun3(cb) {
  console.log('c');
  setTimeout(() => {
    cb(null, 'c');
  }, 300)
}

created() {
  parallel([
    this.fun1,
    this.fun2,
    this.fun3
  ], (err, result) => {
    console.log(result);
  })
}

a
b
c    // a，b，c顺序几乎同时输出 
['a', 'b', 'c']
```     
如果中途出错，则立即将err和值传到最终的回调函数，后面的函数执行，parallel回调的result取决于其他函数是否执行完毕。
```
fun2(cb) {
  console.log('b');
  setTimeout(() => {
    cb('err', 'b');   // 有一个错误
  }, 200)
}

parallel([
  this.fun1,
  this.fun2,
  this.fun3,
], (err, result) => {
  if(err) {
    console.log(err);
    // return;   // 只要有一个返回失败，直接进行错误提示
  }
  console.log(JSON.parse(JSON.stringify(result)));
})

a
b
c
err
[null, 'b']   // 三个函数延时（1000，200，300） 抛错时其它函数还在执行 (按顺序在抛错前的函数还未执行完用null占位，后面省略)
              // 如果不用JSON转换，导致展开时显示完成后的 [a, b, c]

//  ['a', 'b', 'c']   //    （100，200，100）  抛错时其它函数执行完成
```
### series(tasks,[callback])
函数从上到下依次执行，需要等待，相互之间没有数据交互
```
fun2(cb) {
  console.log('b');
  setTimeout(() => {
    cb(null, 'b');
  }, 200)
}

created() {
  parallel([
    this.fun1,
    this.fun2,
    this.fun3
  ], (err, result) => {
    console.log(result);
  })
}

a
b
c    // a，b，c按延时时间输出  
['a', 'b', 'c']
```  
如果中途出错，则立即将err和值传到最终的回调函数，后面的函数不再执行。
```
fun2(cb) {
  console.log('b');
  setTimeout(() => {
    cb('err', 'b');   // 有一个错误
  }, 200)
}

parallel([
  this.fun1,
  this.fun2,
  this.fun3,
], (err, result) => {
  if(err) {
    console.log(err);
  }
  console.log(result);
})

a
b
err
['a', 'b']   // (1000, 200, 300)
```
### waterfall(tasks,[callback])
函数从上到下依次执行，需要等待，前一个函数callback的result为后一个函数的参数(result在前，cb在后)，可用    
waterfall回调里的result不再是函数resList数组，而是最后一个函数返回的结果
```
fun1(cb) {
  console.log('func1', 'a');
  setTimeout(() => {
    cb(null, 'a');
  }, 500)
},
fun2(data, cb) {
  console.log('func2', 'b', data);
  setTimeout(() => {
    cb(null, 'b');
  }, 200)
},
fun3(data, cb) {
  console.log('func3', 'c', data);
  setTimeout(() => {
    cb(null, 'c');
  }, 300)
}

waterfall([
  this.fun1,
  this.fun2,
  this.fun3,
], (err, result) => {
  if(err) {
    console.log(err);
  }
  console.log('waterfall', result);
})

func1 a
func2 b a
func3 c b
waterfall c
```
如果中途出错，则立即将err和值传到最终的回调函数，后面的函数不再执行。
```
fun2(data, cb) {
  console.log('func2', 'b', data);
  setTimeout(() => {
    cb('err', 'b');
  }, 200)
}

func1 a
func2 b a
err
waterfall b
```
项目中调取接口引用    
模拟一个需要先调取一个接口的结果为参数再调取一个接口赋值
```
methods: {
  getInfo(cb) {
    api.get1().then(res => {
      cb(null, res)
    }, err => {
      cb(err)
    })
  },
  getData(params, cb) {
    api.get2(params).then(res => {
      this.list = res;
      cb();
    }, err => {
      cb(err)
    })
  }
}

created() {
  tis.loading = true;
  waterfall([
    this.getInfo,
    this.getData
  ], (err, result) => {
    tis.loading = false;
    if(err) {
      this.$message.error(err);
      return;
    }
    // 如果成功之后有一些其它操作，也可以放在这里
  })
}
```
## vue-pdf
主要是pdf预览放大缩小，看了一个博主的介绍，觉得很不戳，下满整合了部分代码         
<a href="https://blog.csdn.net/weixin_43837268/article/details/103746743" target="_blank">https://blog.csdn.net/weixin_43837268/article/details/103746743</a>

```
<template>
  <div class="home">
    {{ parseInt(this.scale) +"%" }}
    <button @click="scaleD">放大</button> 
    <button @click="scaleX">缩小</button>

    <pdf ref="pdf" :src="url"></pdf>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
export default {
  components:{
      pdf
  },
  data(){
      return {
          url: './JavaScript设计模式与开发实践.pdf',   // 本低测试时将pdf放入public下，后面可替换为api路径
          scale: 100,
          idx: -1
      }
  },
  methods: {
    scaleD() {
      this.scale += 10;
      this.$refs.pdf.$el.style.width = parseInt(this.scale) +"%";
    },
    scaleD() {
      this.scale -= 10;
      this.$refs.pdf.$el.style.width = parseInt(this.scale) +"%";
    }
  }
};
</script>
```

# 项目中遇到的一些问题
## props传参时，父组件数据改变，子组件未更新
在父组件创建的时候，已经创建了相关的子组件，该子组件已经缓存在内存中，在通过其他事件改变父组件传给子组件的值时就会不生效
parent.vue
```
<template>
  <child :info="info"></child>
</template>
<script>
  export defalt {
    data() {
      info: []
    },
    getList() {
      api.getDetail().then(res => {
        // 通常是调取后端接口修改数据后子组件没有及时更新
        // 尤其是内部数据多，多重数组和对象嵌套时，内部数据更新问题
        this.info = res.data
      })
    }
  }
</script>
```
child.vue
```
<template>
  <div>
    <el-table :props="info.table>
      <el-table-column :props="name></el-table-column>
      ···
    </el-table>
    <div>
      <!-- 内部多次嵌套组件，更容易出现这种情况 -->
      ··· info.other.other.data ···
    </div>
  </div>
</template>
<script>
  export defalt {
    props: {
      info: Object
    }
  }
</script>
```
**1、子组件加上v-if，等父组件数据获取后再渲染**    
如果提交信息时含有必填项目或者某些表格至少填一项，可用获取到数据的某一项对子组件用v-if判断渲染
```
<child v-if="info.table.length !== 0" :info="info"></child>
// 如果有报错类似info下没有table, 修改父组件定义变量
info: { 
  table: [] 
}
```
**2、用$nextTick()**   
在赋值时使用，可以先赋值，后渲染或者更新DOM
```
getList() {
  api.getDetail().then(res => {
    this.$nextTick(() => {
      this.info = res.data
    })
  })
}
```
**3、利用watch监听**     
多次看到这种方法，但是有时候监听不到变化，或者出现监听到也没有更新DOM
```
//修改子组件
<script>
  export defalt {
    props: {
      info: Object
    },
    data() {
      return {
        infoChild: this.info
      }
    },
    watch: {
      info(val) {
        this.infoChild = val;
      },
      infoChild(val) {
        // 这里的监听是看到了，但是没有实践过
        this.$emit('info', val);
      }
    }
  }
</script>
```
**4、1和2相结合**  
```
<child v-if="flag" :info="info"></child>
···
getList() {
  这种方式不局限于api请求，包括赋值情况也可这么做
  this.flag = false;
  api.getDetail().then(res => {
    this.$nextTick(() => {
      this.info = res.data
      this.flag = true;
    })
  })
}
```
**如果有子组件调用父组件方法（子组件点击事件，父组件需要执行一些相关操作），与平时无异**
## 对整个data赋值
有时候需要对几乎整个页面数据做缓存，创建页面时赋初始值需要对整个data赋值，不能直接用this.$data = ···，考虑循环赋值   
```
// 存储
localStorage.setItem('count', JSON.stringify(this.$data));

//创建赋初始值
created() {
  const data = JSON.parse(localStorage.getItem('count));
  for(let prop in data) {   // 循环赋值
    this.$set(this, [prop], data[prop]);
  }
}
```
## elementUI组件
### el-table
#### 拆分单元格     
数组中嵌套数组（多级分类），需要拆分单元格来展示表格数据的情况    
具体表现为一行对应多行的格式  
```
list: [   // 三级分类实例数据，第一层是申请表格，可填多个物品信息，第二层为物品信息，第三层为物品下的入库记录
  {
    id: 1, 
    purchase: [  //物品
      {
        name: '物品1', 
        type: '科目1',
        number: 2,
        purchaseIn: [   //入库
          { person: '小红', time: '2021-4-15', number: 1},
          { person: '小明', time: '2021-4-16', number: 2}
        ]
      },
      {
        name: '物品2', 
        type: '科目2',
        number: 10,
        purchaseIn: [
          { person: '小王', time: '2021-4-17', number: 3},
          { person: '小赵', time: '2021-4-18', number: 4},
          { person: '小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴', time: '2021-4-18', number: 4}
        ]
      },
    ]
  }, {
    id: 2, 
    purchase: [
      {
        name: '物品1', 
        type: '科目1',
        number: 2,
        purchaseIn: [
          { person: '小红', time: '2021-4-15', number: 1},
        ]
      },
      {
        name: '物品2', 
        type: '科目2',
        number: 10,
        purchaseIn: [
          { person: '小王', time: '2021-4-17', number: 3},
          { person: '小赵', time: '2021-4-18', number: 4},
          { person: '小吴', time: '2021-4-18', number: 4}
        ]
      },
    ]
  }, {
    id: 2, 
    purchase: [
      {
        name: '物品1', 
        type: '科目1',
        number: 2,
        purchaseIn: []
      },
      {
        name: '物品2', 
        type: '科目2',
        number: 10,
        purchaseIn: [
          { person: '小王', time: '2021-4-17', number: 3},
          { person: '小赵', time: '2021-4-18', number: 4},
          { person: '小吴', time: '2021-4-18', number: 4}
        ]
      },
    ]
  }
]
```
**1、只嵌套了一层（无内部purchaseIn）**    
当时参考了之前的代码，用嵌套table的方式来实现拆分展示
```
<template>
  <el-table :data="List" border class="launch-purchase-l-t">
    <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
    <el-table-column label="物品名称" class-name="none-padding" align="center">
      <template slot-scope="scope">
        <el-table :data="scope.row.purchase" :show-header="false">
          <el-table-column prop="name" align="center"></el-table-column>
        </el-table>
      </template>
    </el-table-column>
    <el-table-column label="科目" class-name="none-padding" align="center">
      <template slot-scope="scope">
        <el-table :data="scope.row.purchase" :show-header="false">
          <el-table-column prop="type" align="center"></el-table-column>
        </el-table>
      </template>
    </el-table-column>
  <el-table>
</template>
<style>
.launch-purchase-l-t {
  // 去除内部嵌套表格的边框
  .none-padding .cell {
    padding: 0;
    .el-table {
      border: none;
    }
    .el-table::before, .el-table::after {
      background-color: #FFFFFF;
    }
  }
  td {
    height: 44px;
  }
}
</style>
```
如果没有分页，且数据不多，不考虑固定列的情况下可以直接使用原生table，进行合并单元格（ele 1.4版本不支持，后新版本的可合并单元格，但分页仍不适用），可支持表格外层嵌套div用于表格过宽，scroll展示，且不用考虑td内部数据过长的问题，会自动换行
```
<table class="span-table" border cellspacing="0" style="width: 100%">
  <thead>
    <th style="width: 80px;">序号</th>
    <th style="width: 160px;">ID</th>
    <th style="width: 240px;">姓名</th>
    <th style="width: 320px;">数量</th>
  </thead>
  <tbody>
    <template v-if="list.length > 0">
      <template v-for="(item, index) in list"> 
        <tr v-for="(good, i) in item.purchase" :key="i">
          <td :rowspan="item.purchase.length" v-if="i === 0">{{index + 1}}</td>
          <td :rowspan="item.purchase.length" v-if="i === 0">{{item.id}}</td>
          <td>{{good.name}}</td>
          <td>{{good.number}}</td>
        </tr>
      </template>
    </template>
    <template v-else>
      <!-- 没有数据展示为一行提示 -->
      <tr>
        <td colspan="7"></td>   
      </tr>
    </template>
  </tbody>
</table>
```
![运行结果展示](./toc/images/vue/项目01.png)    
**2、三层（内部含有purchaseIn）**     
内部嵌套div，这种方式应该也可用于两层嵌套，且不用考虑单元格高度（自动撑开）和去除内部单元格边框
```
<template>
  <el-table :data="list" border style="width: 100%"> 
    <el-table-column label="序号" type="index" width="200" fixed align="center"></el-table-column>
    <el-table-column label="姓名" prop="name" width="200" fixed align="center">
      <template slot-scope="scope">
        <!-- 第二层div的高度需要根据第三层数据判断，且考虑第三层有空数据的情况 -->
        <div v-for="(item, index) in scope.row.purchase" 
          class="internal-td internal-td-middle" 
          :style="{ height: 40 * (scope.row.purchase[index].purchaseIn.length || 1) + scope.row.purchase[index].purchaseIn.length + 'px' }">
          {{ item.name }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="采购人" prop="number" width="400" align="center">
      <template slot-scope="scope">
        <div v-for="item in scope.row.purchase" class="internal-td">
          <div v-if="item.purchaseIn.length === 0" class="internal-td" style="height: 39px;"></div>
          <div v-else v-for="item1 in item.purchaseIn" class="internal-td internal-td-middle" style="line-height: 40px;">
            <span>{{ item1.person }}</span>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="科目" prop="type" width="400"></el-table-column>
    <el-table-column label="数量" prop="number" width="400"></el-table-column>
    <el-table-column label="采购时间" prop="number" width="400"></el-table-column>
    <el-table-column label="采购数量" prop="number" width="400"></el-table-column>
    <el-table-column label="操作" width="200" fixed="right">
      <template>
        查看
      </template>
    </el-table-column>
  </el-table>
</template>
<style>
  // 消除单元格内边距，内部div需要添加边框，判断数据长度和鼠标移入效果
  .el-table .cell {
    padding: 0;
  }
  .internal-td {
    border-bottom: 1px solid #dfe6ec;
    background-color: white;
    transition: background-color .25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex-wrap: wrap;
  }
  .internal-td:hover {
    background-color: #EEF1F6;
  }
  .internal-td:last-child {
    border-bottom: 1px solid white;
  }
  .internal-td-middle span {
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
```
合并单元格方式
```
<div style="width: 100%; overflow-x: scroll;">
  <table class="span-table" border cellspacing="0" style="width: 200%">
    <thead>
      <th style="width: 80px;">序号</th>
      <th style="width: 160px;">ID</th>
      <th style="width: 240px;">姓名</th>
      <th style="width: 320px;">采购人</th>
      <th style="width: 2000px;">数量</th>
    </thead>
    <tbody>
      <template v-if="list.length > 0">
        <template v-for="(item, index) in list"> 
          <template v-for="(good, goodIndex) in item.purchase"> 
            <tr v-for="(purchaseIn, purchaseIndex) in good.purchaseIn">
              <td 
                :rowspan="item.purchase.reduce((m, n) => { return m.purchaseIn.length + n.purchaseIn.length })"
                v-if="goodIndex === 0 && purchaseIndex === 0"
              >{{ index + 1 }}</td>
              <td
                :rowspan="item.purchase.reduce((m, n) => { return m.purchaseIn.length + n.purchaseIn.length })"
                v-if="goodIndex === 0 && purchaseIndex === 0"
              >{{item.id}}</td>
              <td :rowspan="good.purchaseIn.length" v-if="purchaseIndex === 0">{{good.name}}</td>
              <td>{{purchaseIn.person}}</td>
              <td :rowspan="good.purchaseIn.length" v-if="purchaseIndex === 0">{{good.number}}</td>
            </tr>
          </template>
        </template>
      </template>
      <template v-else>
        <tr>
          <td colspan="7"></td>   
        </tr>
      </template>
    </tbody>
  </table>
</div>
```
![运行演示](./toc/images/vue/项目02.png)     

**上述实例部分代码，引入elementUI和vue可直接测试使用**
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>element表格三级分类</title>
  <link rel="stylesheet" href="./elementui@1.4.css">
  <style>
    .el-table {
      border: none;
    }
    .el-table .cell {
      padding: 0;
    }
    .el-table::after, .el-table::before {
      background: white;
    }
    .internal-td {
      border-bottom: 1px solid #dfe6ec;
      background-color: white;
      transition: background-color .25s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      flex-wrap: wrap;
    }
    .internal-td:hover {
      background-color: #EEF1F6;
    }
    .internal-td:last-child {
      border-bottom: 1px solid white;
    }
    .internal-td-middle span {
      height: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .span-table {
      border-color: #DFE6EC;
    }
    .span-table th, .span-table td {
      text-align: center;
      height: 44px;
      border-color: #DFE6EC;
    }
    .span-table th {
      background: #EEF1F6;
    }
  </style>
</head>
<body>
  <div id="app">
    <el-table :data="list" border style="width: 100%"> 
      <el-table-column label="序号" type="index" width="200" fixed align="center"></el-table-column>
      <el-table-column label="姓名" prop="name" width="200" fixed align="center">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.purchase" 
            class="internal-td internal-td-middle" 
            :style="{ height: 40 * (scope.row.purchase[index].purchaseIn.length || 1) + scope.row.purchase[index].purchaseIn.length + 'px' }">
            {{ item.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="采购人" prop="number" width="400" align="center">
        <template slot-scope="scope">
          <div v-for="item in scope.row.purchase" class="internal-td">
            <div v-if="item.purchaseIn.length === 0" class="internal-td" style="height: 39px;"></div>
            <div v-else v-for="item1 in item.purchaseIn" class="internal-td internal-td-middle" style="line-height: 40px;">
              <span>{{ item1.person }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="科目" prop="type" width="400"></el-table-column>
      <el-table-column label="数量" prop="number" width="400"></el-table-column>
      <el-table-column label="采购时间" prop="number" width="400"></el-table-column>
      <el-table-column label="采购数量" prop="number" width="400"></el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template>
          查看
        </template>
      </el-table-column>
    </el-table>

    <div style="margin: 30px 0; height: 1px; background: #ddd;"></div>

    <table class="span-table" border cellspacing="0" style="width: 100%">
      <thead>
        <th style="width: 80px;">序号</th>
        <th style="width: 160px;">ID</th>
        <th style="width: 240px;">姓名</th>
        <th style="width: 320px;">数量</th>
      </thead>
      <tbody>
        <template v-if="list.length > 0">
          <template v-for="(item, index) in list"> 
            <tr v-for="(good, i) in item.purchase" :key="i">
              <td :rowspan="item.purchase.length" v-if="i === 0">{{index + 1}}</td>
              <td :rowspan="item.purchase.length" v-if="i === 0">{{item.id}}</td>
              <td>{{good.name}}</td>
              <td>{{good.number}}</td>
            </tr>
          </template>
        </template>
        <template v-else>
          <!-- 没有数据展示为一行提示 -->
          <tr>
            <td colspan="7"></td>   
          </tr>
        </template>
      </tbody>
    </table>

    <div style="margin: 30px 0; height: 1px; background: #ddd;"></div>

    <div style="width: 100%; overflow-x: scroll;">
      <table class="span-table" border cellspacing="0" style="width: 200%">
        <thead>
          <th style="width: 80px;">序号</th>
          <th style="width: 160px;">ID</th>
          <th style="width: 240px;">姓名</th>
          <th style="width: 320px;">采购人</th>
          <th style="width: 2000px;">数量</th>
        </thead>
        <tbody>
          <template v-if="list.length > 0">
            <template v-for="(item, index) in list"> 
              <template v-for="(good, goodIndex) in item.purchase"> 
                <tr v-for="(purchaseIn, purchaseIndex) in good.purchaseIn">
                  <td 
                    :rowspan="item.purchase.reduce((m, n) => { return m.purchaseIn.length + n.purchaseIn.length })"
                    v-if="goodIndex === 0 && purchaseIndex === 0"
                  >{{ index + 1 }}</td>
                  <td
                    :rowspan="item.purchase.reduce((m, n) => { return m.purchaseIn.length + n.purchaseIn.length })"
                    v-if="goodIndex === 0 && purchaseIndex === 0"
                  >{{item.id}}</td>
                  <td :rowspan="good.purchaseIn.length" v-if="purchaseIndex === 0">{{good.name}}</td>
                  <td>{{purchaseIn.person}}</td>
                  <td :rowspan="good.purchaseIn.length" v-if="purchaseIndex === 0">{{good.number}}</td>
                </tr>
              </template>
            </template>
          </template>
          <template v-else>
            <tr>
              <td colspan="7"></td>   
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div style="margin: 30px 0 100px; height: 1px; background: #ddd;"></div>
  </div>

  <script src="./vue-min.js"></script>
  <script src="./elementui@1.4.js"></script>
  <script>
    new Vue({
      el: '#app',
      data() {
        return { 
          list: [
            {
              id: 'AZ10000000', 
              purchase: [
                {
                  name: 'aaa', 
                  type: '科目1',
                  number: 2,
                  purchaseIn: [
                    { person: '小红', time: '2021-4-15', number: 1},
                    { person: '小明', time: '2021-4-16', number: 2}
                  ]
                },
                {
                  name: 'bbb', 
                  type: '科目2',
                  number: 10,
                  purchaseIn: [
                    { person: '小王', time: '2021-4-17', number: 3},
                    { person: '小赵', time: '2021-4-18', number: 4},
                    { person: '小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴小吴', time: '2021-4-18', number: 4}
                  ]
                },
              ]
            }, {
              id: 'AZ10000001', 
              purchase: [
                {
                  name: 'aaa', 
                  type: '科目1',
                  number: 2,
                  purchaseIn: [
                    { person: '小红', time: '2021-4-15', number: 1},
                  ]
                },
                {
                  name: 'bbb', 
                  type: '科目2',
                  number: 10,
                  purchaseIn: [
                    { person: '小王', time: '2021-4-17', number: 3},
                    { person: '小赵', time: '2021-4-18', number: 4},
                    { person: '小吴', time: '2021-4-18', number: 4}
                  ]
                },
              ]
            }, {
              id: 'AZ10000002', 
              purchase: [
                {
                  name: 'aaa', 
                  type: '科目1',
                  number: 2,
                  purchaseIn: [{ person: '小王', time: '2021-4-17', number: 3}]
                },
                {
                  name: 'bbb', 
                  type: '科目2',
                  number: 10,
                  purchaseIn: [
                    { person: '小王', time: '2021-4-17', number: 3},
                    { person: '小赵', time: '2021-4-18', number: 4},
                    { person: '小吴', time: '2021-4-18', number: 4}
                  ]
                },
              ]
            }
          ]
         }
      }
    })
  </script>
</body>
</html>
```
#### 根据状态值展示相应状态
最简单的一种方法：根据状态值用v-if进行渲染数据
```
<el-table :data="list>
  <el-table-column label="项目状态" align="center" prop="status">
    <template slot-scope="{ row }">
      <span v-if="row.status === '1'">意向项目</span>
      <span v-if="row.status === '2'">接触中</span>
      ······
    </template>
  </el-table-column>
</el-table>
```
使用函数进行赋值
```
<el-table-column label="项目状态" align="center" prop="status">
  <template slot-scope="{ row }">
    {{ getProjectStatus(row.status) }}
    ······
  </template>
</el-table-column>

methods: {
  getProjectStatus(status) {

    // 1. 用switch返回
    let st = '';
    switch(status) {
      case '1': st = '意向项目'; break;   // 不能直接return '意向项目'
      ····
    }
    return st;

    // 2. 封装对象返回
    const statusObj = {
      '1': ': '意向项目',
      ·····
    }
    return statusObj[status];

  }
}
```
使用计算属性，内部也可以使用switch和对象赋值
```
<el-table-column label="项目状态" align="center" prop="status">
  <template slot-scope="{ row }">
    {{ getProjectStatus(row.status) }}
    ······
  </template>
</el-table-column>

computed: {
  getProjectStatus() {
    return (status) => {
      return this.statusObj[status]
    }
  },
}
```
**推荐**使用过滤器
```
<el-table-column label="项目状态" align="center" prop="status">
  <template slot-scope="{ row }">
    <el-tag :type="{{ row.status | filterStatus }}">{{ row.status | filterStatusText }}</el-tag>
  </template>
</el-table-column>

filters: {
  filterStatus(val) {
    switch(val) {
      case 1: return 'success';
      ····
    }
  },
  filterStatusText(val) {
    switch(val) {
      case 1: return '通过';
      ····
    }
  }
}
```
#### 有排序时重置搜索
表格列表有选项，有排序，重置清空所有选项和排序，主要是针对1.4版本，后续版本有重置方法可以调用。    
![示例图片](./toc/images/vue/项目08.png)
```
handelReset(){
  // 重置
  // 清空搜索选项
  this.searchParams.star = '';
  this.searchParams.keyword = '';
  // 清空排序，具体根据排序方法判断
  this.sort({ column: null, order: null, p: null})
  // 清除排序样式
  let asceTh = document.querySelector('th.ascending');
  if(asceTh) {
    let asceThClass = asceTh && asceTh.className;
    asceTh.className = asceThClass && asceThClass.replace(/ascending /, '');
  } 
  let dsceTh = document.querySelector('th.descending');
  if(dsceTh) {
    let dsceThClass = dsceTh && dsceTh.className;
    dsceTh.className = dsceThClass && dsceThClass.replace(/descending /, '');
  } 
}
```   

#### 某一行高亮显示
**1、row-class-name属性：为行设置className（按钮点击设置行高亮）**   
```
<el-table border :data="process" :row-class-name="tableRowClassName">
  <el-table-column type="index" align="center" label="编号" width="80"></el-table-column>
  <el-table-column align="center" label="询价单位/个人" prop="company"></el-table-column>
  <el-table-column align="center" label="协作费用" prop="money"></el-table-column>
  <el-table-column align="center" label="操作" width="80">
    <template slot-scope="{ $index }">
      <el-button type="text" @click="handleRow($index)">选择</el-button>
    </template>
  </el-table-column>
</el-table>

process: [
  { id: 11, company: '11', money: 11, is_selected: false},
  { id: 22, company: '22', money: 22, is_selected: false},
  { id: 33, company: '33', money: 33, is_selected: false}
]

tableRowClassName (row) {
  // 高亮(通过 is_selected 判断是否返回行class设置)
  if(row.is_selected) {
    return 'select-row';
  }
},
handleRow(index) {
  // 选择某行询价
  this.process.forEach(item => {
    item.is_selected = false;
  })
  this.process[index].is_selected = true;
}

/deep/ .el-table {
  .select-row td {
    background: #EEF1F6 !important;
    ····
  }
}
```
**2、row-class-name属性（单选选择设置行高亮）**  
```
<el-table border :data="process" :row-class-name="tableRowClassName">
  <el-table-column type="index" align="center" label="编号" width="80"></el-table-column>
  <el-table-column align="center" label="询价单位/个人" prop="company"></el-table-column>
  <el-table-column align="center" label="协作费用" prop="money"></el-table-column>
  <el-table-column align="center" label="操作" width="80">
    <template slot-scope="{ $index }">
      <el-radio v-model="selectedIndex" :label="$index"><span></span></el-radio>  <!-- 空span不可少 -->
    </template>
  </el-table-column>
</el-table>


selectedIndex: -1,    // 选中的下标
process: [
  { id: 11, company: '11', money: 11, is_selected: false},
  { id: 22, company: '22', money: 22, is_selected: false},
  { id: 33, company: '33', money: 33, is_selected: false}
]

tableRowClassName (row) {
  // 高亮(通过 is_selected 判断是否返回行class设置)
  if(row.is_selected) {
    return 'select-row';
  }
}

/deep/ .el-table {
  .select-row td {
    background: #EEF1F6 !important;
    ····
  }
}
```
**上面两种方式回显**   
返回的数据类型与上述一致，也需要循环找出对 selectedIndex 赋值，不一致则需要循环对 process 内的 is_selected 赋值。   

**3、highlight-current-row属性（是否要高亮当前行）** 
```
<el-table ref="singleTable" class="select-project-table" border highlight-current-row :data="projectList" @current-change="handleCurrentChange">
  <el-table-column type="index" align="center" label="编号" width="80"></el-table-column>
  <el-table-column align="center" label="询价单位/个人" prop="company"></el-table-column>
  <el-table-column align="center" label="协作费用" prop="money"></el-table-column>
  <el-table-column align="center" label="操作" width="80">
    <template slot-scope="{ $index }">
      <el-radio v-model="selectProjectId" :label="scope.row.id"><span></span></el-radio>
    </template>
  </el-table-column>
</el-table>

selectProjectId: -1,
projectList: [
  { id: 11, company: '11', money: 11},
  { id: 22, company: '22', money: 22},
  { id: 33, company: '33', money: 33}
]

handleCurrentChange (row) {
  // 选择行
  if(row) {
    // 防止重置数据时row被置为null
    this.selectProject = row;
    this.selectProjectId = row.id;
  }
}

/deep/ .select-project-table .current-row {
  color: #ff4949;
}
```


### el-form
#### rules判断select value为数值检测失效
通过rules验证表单规则，el-select => options绑定的是数值类型时，会监测不到。   
```
<template>
  <el-form :model="formData" :rules="rules" ref="ruleForm">
    <el-form-item prop="progress_status" label="项目进度状态">
      <el-select v-model="dataForm.progress_status" placeholder="请选择">
        <el-option v-for="item in progress" :value="item.id" :label="item.name" :key="item.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <el-button @click="handleSave('ruleForm')>提交</el-button>
</template>
<script>
  data() {
    return {
      dataForm: {
        progress_status
      },
      progress: [
        { id: 1, name: '按计划进行' },
        { id: 2, name: '比计划提前' },
        { id: 3, name: '落后计划' }
      ],
      rules: {
        progress_status: [
          { required: true, message: "请选择项目进度状态", trigger: "blur" }
        ],
      }
    }
  },
  methods: {
    handleSave(formName) {
      // 提交
      this.$refs[formName].validate((valid) => {
        if(!valid) {
          return;
        }
      })
    }
  }
</script>
```
提交之后   
![展示](./toc/images/vue/项目04.png)   
```
// 判断类型增加字符型（其它绑定数组等用相应类型判断）
rules: {
  progress_status: [
    { required: true, type: 'number', message: "请选择项目进度状态", trigger: "blur" }
  ],
}
```
提交之后   
![展示](./toc/images/vue/项目05.png)

#### el-select远程搜索赋初始值
使用远程搜索时可能会有编辑页面，需要先赋初始值，可能会造成初始值显示的不是值，而是id。
```
<el-form-item prop="project_owner" label="目前负责人">
  <el-select
    v-model="dataForm.project_owner"
    placeholder="请输入姓名"
    clearable
    :multiple="false"
    filterable
    remote
    :remote-method="remoteMethod"
    :loading="userLoading"
    style="width: 100%">
    <el-option
      v-for="user in userList"
      :key="user.user.data.id"
      :label="user.user.data.name"
      :value="user.user.data.id">
      <span style="float: left">{{ user.user.data.name }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ user.user.data.mobile }}</span>
    </el-option>
  </el-select>
</el-form-item>

<script>
  data() {
    dataForm: {},
    userLoading: false,
    userList: []
  },
  methods: {
    getDetail() {
      api.getDetail().then(res => {
        this.dataForm = res.data;   //里面含有负责人id--project_owner
      })
    },
    remoteMethod (query) {
      // 搜索负责人
      let that = this;
      if(!query) {
        this.userList = [];
        return;
      }
      setTimeout(() => {
        that.userLoading = true;
        userApi.getUserList({
          limit: 0, 
          search: query
        }).then(response => {
          that.userList = response.body.data;
          that.userLoading = false;
        }, err => {
          that.$message.error(err.body.message);
          that.userLoading = false;
        })
      }, 200);
    },
  }
</script>
```
直接这样写的话，由于v-model绑定值变化就会搜索一次，导致第一次是id值，并且会搜索一次。     
![展示](./toc/images/vue/项目06.png)   

**解决办法：获取详情后，拼接一个userList，第一次不进行搜索**    
1、如果是多选情况，绑定的值会是一个数组，可以通过这个在搜索时进行判断   
```
:multiple="true"

getDetail() {
  api.getDetail().then(res => {
    this.dataForm = res.data;
    this.userList = res.data.data.owner.data;   // 如果结构不一致，需要拼接
  })
},
remoteMethod (query) {
  if(typeof(query) !== 'string') {  //新输入搜索的是字符串，初次获取会是数组
    return;
  }
  if(!query) {
    this.userList = [];
    ······
  }, 200);
},
```
2、单选时，可以在获取详情时放一个变量，表示是否为需要搜索的情况，第一次赋值不进行搜索。
```
data() {
  isSearchUser: true,   //是否需要搜索
},
methods: {
  getDetail() {
    this.isSearchUser = false;   // 赋值只能放在调用接口外（内部好像因为异步性会导致没有效果）
    api.getDetail().then(res => {
      this.dataForm = res.data; 
      this.userList.push({   // 拼接userList
        user: {
          data: {
            'id': this.dataForm.project_owner,
            'name': this.dataForm.project_owner_name,
            'mobile': this.dataForm.project_owner_mobile,
          }
        }
      })
    })
  },
  remoteMethod (query) {
    let that = this;
    if(!this.isSearchUser) {
      this.isSearchUser = true;
      return;
    }
    if(!query) {
      this.userList = [];
      ······
    }, 200);
  },
}
```
3、单选时，拼接失效   
与第二种方法相似，但是搜索时进行判断，首次赋值。
```
data() {
  isSearchUser: true,   //是否需要搜索
},
methods: {
  getDetail() {
    this.isSearchUser = false;   // 赋值只能放在调用接口外（内部好像因为异步性会导致没有效果）
    api.getDetail().then(res => {
      this.dataForm = res.data; 
    })
  },
  remoteMethod (query) {
    let that = this;
    if(!this.isSearchUser) {
      this.isSearchUser = true;
      query = this.dataForm.project_owner_name;  //用名字进行一次赋值搜索
    }
    if(!query) {
      this.userList = [];
      ······
    }, 200);
  },
}
```
#### select value绑定对象
有时候可能需要联动处理，select选择时返回的是绑定的value值，但是想要点击时的对象值，如下  
![展示联动](./toc/images/vue/项目07.png)   

有一个用户对象，选择某个用户时，联系电话更新为相应用户的电话
```
<el-form-item prop="part_a_contacts" label="甲方联系人"> 
  <!-- value为对象时，必须绑定value-key值 -->
  <el-select v-model="partAContacts" @change="changeContactA" value-key="contact_name">
    <el-option v-for="item in contactAList" :key="item.id" :label="item.contact_name" :value="item"></el-option>
  </el-select>
</el-form-item>
<el-form-item prop="part_a_tel" label="甲方联系电话">
  <el-input v-model="dataForm.part_a_tel" name="part_a_tel"></el-input>
</el-form-item>

data() {
  return {
    dataForm: {
      part_a_contacts: '',  //联系人
      part_a_tel: '',  //电话
    }
    partAContacts: {},   // 不直接绑定dataform里的数据
    contactAList: []  // 联系人列表
  }
},
methods: {
  getList() {
    // 一般需要调接口获取初始值
    this.contactAList = [
      { contact_mobile: "15512341234", contact_name: "张一旦", id: "7mpykzrqm5lq48v3" },
      { contact_mobile: "17712341234", contact_name: "张二旦", id: "7mpykzrqm5lq48v4" }
    ]
    // 如果需要默认选中第一个
    this.dataForm.part_a_contacts = this.contactAList[0].contact_name;
    this.dataForm.part_a_tel = this.contactAList[0].contact_mobile;
  },
  changeContactA(e) {
    this.$set(this.dataForm, 'part_a_contacts', e.contact_name);
    this.$set(this.dataForm, 'part_a_tel', e.contact_mobile);
  },
},
created() {
  this.getList();
}
```
这种方法可能编辑这种需要赋初始值的需要另作修改。
#### 封装一个简易版的el远程搜索
需求：输入的时候进行搜索，可以选择搜索到的值，如果没有搜索到，就用输入的值。   
如果直接使用el远程搜索，没有搜索到时或者说没有选择搜索到的值时，失去焦点输入内容会是输入前的，不能满足没有搜索到使用输入的值。   
思路：搜索部分直接使用el-input，下面用远程搜索的DOM元素，引入el之后，class可以公用，可以不考虑css部分。
```
<template>
  <div class="SearchUser">
    <el-input
      v-model="dataForm.party_a"
      :placeholder="placeholder"
      style="width: 100%"
      @change="changePartAInput"
      @click.native="handleInput"
      @blur="blur"
    ></el-input>
    <!-- 搜索后的列表展示 -->
    <div class="el-select-dropdown" v-show="isShowDropdown">
      <div v-if="customerList.length" class="el-scrollbar" style="">
        <div class="el-select-dropdown__wrap el-scrollbar__wrap" style="margin-bottom: -16px; margin-right: -16px">
          <ul class="el-scrollbar__view el-select-dropdown__list" style="position: relative">
            <div class="resize-triggers">
              <div class="expand-trigger">
                <div style="width: 324px; height: 1165px"></div>
              </div>
              <div class="contract-trigger"></div>
            </div>
            <li 
              class="el-select-dropdown__item" 
              :class="{selected: activeIndex === index}"
              v-for="(item, index) in customerList" 
              :key="item.id"
              @click="handlePartyA(index)"
            >
              <span>{{ item.company}}</span>
            </li>
          </ul>
        </div>
      </div>
      <p v-else class="el-select-dropdown__empty" style="line-height: 22px;">{{searchInfo}}</p>
    </div>
  </div>
</template>
<script>
import customerApi from "@/api/customer";
export default {
  props: {
    dataForm: {
      type: Object,
      default() {
        return {};
      },
    },
    placeholder: {
      type: String,
      default: "请输入单位名称",
    },
  },
  data() {
    return {
      customerList: [],   // 搜索列表
      activeIndex: -1,   // 选择列表的下标
      isShowDropdown: false,   // 是否展示列表
      searchInfo: '无数据',   // 加载中/无数据
      timer: ''   //定时器
    };
  },
  methods: {
    handleInput() {
      // 点击时
      this.isShowDropdown = !this.isShowDropdown;
    },
    changePartAInput(e) {
      // 甲方内容改变时处理
      this.isShowDropdown = true;
      this.customerList = [];
      this.activeIndex = -1;
      if(e === '') {
        this.$emit("updatePartyA", e);
        this.searchInfo = '无数据';
        return;
      }
      this.searchInfo = '加载中';
      clearTimeout(this.timer);
      // 添加定时器延时搜索，防止可能搜索两次
      this.timer = setTimeout(() => {
        customerApi.getVipCustomerList({
          keyword: e,
          include: 'contacts,industry',
          limit: 0
        }).then(res => {
          this.customerList = res.data.data;
          if(!this.customerList.length) {
            this.searchInfo = '无数据';
          }
        }, err => {
          this.$message.error(err.data.message);
        })
      }, 200);
      // this.$emit("updatePartyA", e);   //这里可以传给父组件一个方法，进行一些其它操作，如判断输入值是否合法
    },
    handlePartyA(index) {
      // 选择列表内容
      this.isShowDropdown = false;
      this.activeIndex = index;
      this.dataForm.party_a = this.customerList[index].company;
      this.$emit("handlePartyA", this.customerList[index]);   // 选择之后可能会返回信息处理其他输入
    },
    blur() {
      // 延时隐藏，否则选择列表无效
      setTimeout(() => {
        this.isShowDropdown = false;
      }, 300)
    }
  },
};
</script>
<style scoped lang="scss">
.SearchUser {
  display: inline-block;
  position: relative;
  .el-select-dropdown {
    width: 100%;
  }
}
</style>
```
#### 封装一个搜索姓名组件，可回显
经常在创建表单时需要搜索选择人物，然后可编辑，这时候就需要回显，如上述远程搜索赋初始值，最好用的还是用拼凑userList。
```
<!-- 如果有回显，拼一个userList传入 -->
<!-- 可能回显存在检测不到的情况，用$nextTick或者ref可解决 -->
<template>
  <el-select
    v-model="userId"
    filterable
    clearable
    remote
    :placeholder="placeholder"
    :multiple="multiple"
    :style="{ width: width}"
    :remote-method="remoteMethod"
    :loading="remoteLoading">
    <el-option
      v-for="user in userList"
      :key="user.user.data.id"
      :label="user.user.data.name"
      :value="user.user.data.id">
      <span style="float: left">{{user.user.data.name }}</span>
      <span style="float: right;color: #8492a6;font-size: 13px">{{user.user.data.mobile }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { debounce } from 'lodash'
import userApi from '@/api/user'
export default {
  props: {
    placeholder: {
      type: String,
      default: '请输入'
    },
    width: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    pUserId: {   // 父组件传来的需要绑定的id
      type: String | Array
    },
    pUserList: {   // 父组件传来的搜索到的用户列表
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      userId: this.pUserId,
      userList: this.pUserList,
      remoteLoading: false,
    }
  },
  methods: {
    remoteMethod: debounce(function(keyword) {
      // 搜索申请人
      if (!keyword) {
        this.userList = [];
        return;
      }
      userApi.getUserList({
        limit: 0,
        search: keyword
      }).then(res => {
        this.userList = res.data.data;
        this.remoteLoading = false;
      }, err => {
        this.$message.error(err.data.message);
        this.remoteLoading = false;
      })
    }, 500)
  },
  watch: {
    userId(val) {
      // 选择了用户
      this.$emit('change', val);
    },
    pUserId(val) {
      // 父组件传来的id改变
      this.userId = val;
    },
    pUserList(val) {
      // 父组件传来的列表改变
      this.userList = val;
    }
  }
}
</script>
```
使用：      
&emsp;1、仅用于搜索
```
<search-param-user :pUserId="searchParams.user_id" width="90%" @change="changeUser"></search-param-user>

changeUser(val) {
  this.searchParams.user_id = val;
},
```
&emsp;2、回显
```
<search-param-user ref="searchUser" :pUserId="searchParams.user_id" :pUserList="userList" width="90%" @change="changeUser"></search-param-user>

changeUser(val) {
  this.searchParams.user_id = val;
},
getInfo() {
  api.get().then(res => {

    // 普通使用
    this.userList = [
      { id: res.id, name: res.name, ··· }
    ]

    // 回显不显示解决方法1 
    this.$nextTick(() => {
      this.userList = [
        { id: res.id, name: res.name, ··· }
      ]
    })

    // 回显不显示解决方法2
    this.$refs.searchUser.userList = [
      { id: res.id, name: res.name, ··· }
    ]
  })
}
```
### others
#### el-dialog封装为子组件时，弹窗关闭
例如列表有编辑功能，将dialog封装为子组件时，由于显隐值通过props传参，关闭dialog相当于直接修改props值，会报错。
![示例展示](./toc/images/vue/项目09.png)   
点击编辑展示弹窗   
![示例展示](./toc/images/vue/项目10.png)    
```
// parent.vue
<template>
  <el-button @click="handleEdit(scope.row)>编辑</el-button>
  <edit-dialog :isShow.sync="isShowEdit" :editData="editData"></edit-dialog>
</template>

data() {
  return {
    isShowEdit: false,
    editData: {}
  }
},
methods: {
  handleEdit(row) {
    this.editData = row;
    this.isShow = true;
  }
}
```
```
// edit.vue
<template>
  <el-dialog 
    :visible.sync="isShow" 
    :show-close="false"
    :close-on-click-modal="false"
    :before-close="handleClose" 
  >
    <el-button @click="handleClose">取消</el-button>
  </el-dialog>
</template>

props: {
  isShow: Boolean,
  editData: {
    type: Object,
    default() {
      return {}
    }
  }
},
methods: {
  handleClose() {
    // 关闭
    this.$emit("update:isShow",!this.isShow);
  }
}
```
#### el-dialog自定义拖拽
**1、新建src/utils/dialog.js**
```
import Vue from 'vue'
// v-dialogDrag: 弹窗拖拽属性
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style.cssText += ';cursor:grab;'   // 这里修改拖拽鼠标形状
    dragDom.style.cssText += `;top:${(binding.value && binding.value.height) || '15%'};`   // 默认初始高度15%

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = (function () {
      if (document.body.currentStyle) {
        // 在ie下兼容写法
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr]
      }
    })()

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      const screenWidth = document.body.clientWidth // body当前宽度
      const screenHeight = document.documentElement.clientHeight // 可见区域高度(应为body高度，可某些环境下无法获取)

      const dragDomWidth = dragDom.offsetWidth // 对话框宽度
      const dragDomheight = dragDom.offsetHeight // 对话框高度

      const minDragDomLeft = dragDom.offsetLeft
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

      const minDragDomTop = dragDom.offsetTop
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight

      // 获取到的值带px 正则匹配替换
      let styL = sty(dragDom, 'left')
      // 为兼容ie　
      if (styL === 'auto') styL = '0px'
      let styT = sty(dragDom, 'top')

      // console.log(styL)
      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100)
        styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100)
      } else {
        styL = +styL.replace(/px/g, '')
        styT = +styT.replace(/px/g, '')
      };

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX
        let top = e.clientY - disY
        // 边界处理(全部使用为只能在可视区内拖拽)
        // if (-(left) > minDragDomLeft) {
        //   left = -(minDragDomLeft)
        // } else if (left > maxDragDomLeft) {
        //   left = maxDragDomLeft
        // }

        if (-(top) > minDragDomTop) {
          top = -(minDragDomTop)
        } 
        // else if (top > maxDragDomTop) {
        //   top = maxDragDomTop
        // }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
      }

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
      return false
    }
  }
})
```
**2、mian.js中进入**
```
import './utils/dialog.js'
```
**3、el-dialog中使用**
```
<el-dialog v-dialogDrag><el-dialog>
<el-dialog v-dialogDrag="{ height: '10%' }"><el-dialog>
```

# 打包调整
## 打包去除所有的log和debugger
```
// vue.config.js
module.exports = {
  publicPath: './',
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false;
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true;
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ["console.log"];
    }
  }
}
```
如果需要在开发测试版就去除的话不适用，可以暴力修改log方法
```
// main.js
window['console']['log'] = () => {}
```

# vue2.x原理部分
根据学习开课吧-杨老师的视频整理相关笔记。
## 工作机制  
![原理图片演示](./toc/images/vue/2-原理部分01.png)        

**1、初始化**   
在 new Vue() 之后，Vue会调用init进行初始化，会初始化生命周期、事件、props、methods、data、computed 与 watch 等，其中最重要的是通过 Object.defineProperty 设置 setter 和 getter ，用来实现**响应式**和**依赖收集**。   

初始化后调用$mount挂载组件，在main.js中   

**2、编译**   
编译模块快分为三个阶段   
1 parse: 使用正则解析template中的vue的指令 ( v-xxx ) 变量等等形成抽象语法树AST。   
2 optimize: 标记一些静态节点，用作后面的性能优化，在diff的时候直接忽略。   
3 generate: 把一部分AST转化为渲染函数 render()。   

**3、响应式**   
响应式原理为数据劫持，通过Object.definedProperty()定义对象getter和setter，设置通知机制，当编译生成的渲染函数被实际渲染的时候会触发getter进行依赖收集，在数据变化的时候，触发setter进行更新。   

**4、虚拟DOM**   
用js对象描述dom结构，数据修改的时候，先修改虚拟dom的数据，然后做diff，尽量减少对真实DOM的操作，进而提高效率。   

**5、更新视图**    
数据修改触发setter，然后监听器会通知进行修改，通过patch对比两个虚拟dom，得到修改的地方，更新dom。

**注意：**    
1、 mount生命周期函数就是在虚拟dom渲染完成后执行的    
2、 上边的watcher和组件中写的watch不相同，那是小的独立的watch，和渲染watcher不同，每个组件只存在一个上边的渲染watcher     
3、 Created只是有组件中的数据还没有生成虚拟dom，所以在页面中初始化相关的数据最好放在created中，那样就不会触发两个mounted     
4、 Vue2中的响应式的原理是Object.defineProperty,通过get和set来触发的获取数据和重新设置数据。Vue3中使用的更底层的proxy，性能更好      
   
## 响应式原理
简化版本   
![原理图片演示](./toc/images/vue/2-原理部分02.png)    

**Object.defineProperty**
```
<div id="app">
  <p id="name"></p>
</div>

<script>
  let obj = {};
  Object.defineProperty(obj, 'name', {
    get() {
      // 调用时
      console.log(1);
      return document.querySelector('#name').innerHTML;
    },
    set(val) {
      // 给name赋值时
      document.querySelector('#name').innerHTML = val;
    } 
  })

  obj.name = 'Jerry';
  console.log(obj.name);
</script>
```
页面渲染 p 标签里包含 Jerry，由于 log 里调用了 obj.name，会执行 get，控制台打印 1。    

**实现简单的vue响应功能**   
> kvue.js    

```
// 使用：new KVue({ data: { ··· } })

class KVue {
  constructor(options) {
    this.$options = options;

    // 数据响应化
    this.$data = options.data;
    this.observe(this.$data);
  }

  observe(value) {
    if(!value || typeof value !== 'object') {
      return;
    }
    // 遍历对象
    Object.keys(value).forEach(key => {
      this.defineReactive(value, key, value[key]);
    })
  }

  // 数据响应化
  defineReactive(obj, key, val) {

    // 递归解决数据嵌套问题（data中含有对象）
    this.observe(val);

    Object.defineProperty(obj, key, {
      get() {
        return val;
      },
      set(newVal) {
        if(newVal === val) return;
        val = newVal;
        console.log(`${key}属性更新了，值为${val}`);
      }
    })
  }
}
```
> index.html    

```
<script src="./kvue.js"></script>
<script>
  const app = new KVue({
    data: {
      test: 'I am test',
      foo: {
        bar: 'bar'
      }
    }
  })
  app.$data.test = 'hello, xiaohui~';
  app.$data.foo.bar = 'oh my bar';
```
打印：test属性更新了，值为hello, xiaohui~      
&emsp;&emsp;&emsp;bar属性更新了，值为oh my bar~      
## 依赖收集与追踪
## 编译compile
