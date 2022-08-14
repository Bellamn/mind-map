<!--
 * @Author: Deng Yuhang
 * @Date: 2022-07-25 11:04:29
 * @LastEditors: Deng Yuhang
 * @LastEditTime: 2022-08-14 16:57:44
 * @Description: 
-->
<template>
  <div class="shortCutBar">
    <div @click="changeActive('menu')" key="menu" class="imgWrapper" :class="{ 'active': activeKey === 'menu' }"><i
        class="el-icon-s-order img"></i></div>
    <div @click="changeActive('search')" key="search" class="imgWrapper" :class="{ 'active': activeKey === 'search' }"><i
        class="el-icon-search img"></i></div>
  </div>
</template>

<script>
import { store, colorList } from '@/config';
import { mapState, mapActions, mapMutations } from "vuex";
/**
 * @Author: 王林
 * @Date: 2021-06-24 22:54:25
 * @Desc: 侧边栏容器
 */
export default {
  name: "Sidebar",
  props: {

  },
  data() {
    return {
      activeKey: 'menu'
    };
  },
  methods: {
    ...mapMutations(['updateState']),
    changeActive(key) {
      this.activeKey = (this.activeKey === key ? '' : key);
      this.updateState({leftMenuActiveKey: this.activeKey})
    }
  }
};
</script>

<style lang="less" scoped>
.shortCutBar {
  height: 100%;
  width: 50px;
  background-color: rgb(237, 242, 244);
  border-right: 1px solid rgb(99, 97, 97);

  .imgWrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: rgb(232, 241, 236);
    }

    cursor: pointer;

    .img {
      font-size: 32px;
      padding: 5px;
    }
  }

  .active {
    border-left: 4px solid green;
    background-color: rgb(206, 224, 206);
  }

}
</style>
