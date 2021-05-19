


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

## vue+elementUI拆分单元格     
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
## el-table根据状态值展示相应状态
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


