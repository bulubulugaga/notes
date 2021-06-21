


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
// 将progress的id替换为字符串形式，即可
progress: [
  { id: '1', name: '按计划进行' },
  { id: '2', name: '比计划提前' },
  { id: '3', name: '落后计划' }
],
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