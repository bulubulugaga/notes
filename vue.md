


# 项目中遇到的一些问题
## props传参时，父组件数据改变，子组件未更新
在父组件创建的时候，已经创建了相关的子组件，该子组件已经缓存在内存中，在通过其他事件改变父组件传给子组件的值时就会不生效
parent.vue
```
<templete>
  <child :info="info"></child>
</templete>
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
<templete>
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
</templete>
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
