<!--
 * @Author: Deng Yuhang
 * @Date: 2022-07-25 11:04:29
 * @LastEditors: Deng Yuhang
 * @LastEditTime: 2022-08-14 16:57:27
 * @Description: 
-->
<template>
  <div
    class="leftSidebarContainer"
    @click="onClick"
    :class="{ show: show }"
    :style="{zIndex: zIndex,transition: 'width 0.2s', width:leftMenuActiveKey === ''? '50px' : '350px', overflow: 'hidden'}"
  >
  <ShortCutBar ref="butBar" :mindMap="mindMap"></ShortCutBar>
  <Menu :mindMap="mindMap"></Menu>

  </div>
</template>

<script>
import { store } from "@/config";
import ShortCutBar from "./ShortCutBar.vue";
import Menu from "./Menu.vue"
import { mapState, mapActions, mapMutations } from "vuex";
/**
 * @Author: 王林
 * @Date: 2021-06-24 22:54:25
 * @Desc: 侧边栏容器
 */
export default {
  name: "Sidebar",
  props: {
    mindMap: {
      type: Object,
    },
  },
  components: {
    ShortCutBar,
    Menu
  },
  computed: {
    ...mapState({
      leftMenuActiveKey:'leftMenuActiveKey'
    })
  },
  data() {
    return {
      show: false,
      zIndex: 0,
      activeKey:''
    };
  },
  updated() {
    this.activeKey = this.$refs.butBar.activeKey;
  },

  watch: {
    show(val, oldVal) {
      if (val && !oldVal) {
        this.zIndex = store.sidebarZIndex++;
      }
    },
  },
  methods: {
    onClick(){
      this.$bus.$emit('draw_click')
    },
  }
};
</script>

<style lang="less" scoped>
.leftSidebarContainer {
  position: fixed;
  left: 0px;
  top: 110px;
  bottom: 0;
  width: 350px;
  background-color: #fff;
  border-left: 1px solid #e8e8e8;
  display: flex;
  flex-direction: row;
  transition: all 0.3s;
}
</style>
