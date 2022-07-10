<!--
 * @Author: Deng Yuhang
 * @Date: 2022-07-08 22:28:08
 * @LastEditors: Deng Yuhang
 * @LastEditTime: 2022-07-11 00:59:42
 * @Description: 
-->
<template>
  <div
    class="noteContentViewer"
    ref="noteContentViewer"
    @click="handleMouseEnter"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :style="{ left: this.left + 'px', top: this.top + 'px', visibility: show ? 'visible' : 'hidden' }"
  ></div>
</template>

<script>
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

/**
 * @Author: 王林
 * @Date: 2021-06-24 22:53:54
 * @Desc: 节点备注内容显示
 */
export default {
  name: "NodeNoteContentShow",
  data() {
    return {
      editor: null,
      show: false,
      left: 0,
      top: 0,
      isMouseOver:false,
    };
  },
  created() {
    this.$bus.$on("showNoteContent", (content, left, top) => {
      this.editor.setMarkdown(content);
      this.left = left;
      this.top = top;
      this.show = true;
    });
    this.$bus.$on("hideNoteContent", () => {
      !this.isMouseOver && (this.show = false)
    });
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    /**
     * @Author: 王林25
     * @Date: 2022-05-09 11:37:05
     * @Desc: 初始化编辑器
     */
    initEditor() {
      if (!this.editor) {
        this.editor = new Viewer({
          el: this.$refs.noteContentViewer
        });
      }
    },

    handleMouseEnter(){  
      console.log('mouseenter')
      this.isMouseOver = true 
      this.show = true
    },
    handleMouseLeave(){
      console.log('mouseleave')
      this.isMouseOver = false;
      this.show = false
    }
  },
};
</script>

<style lang="less" scoped>
.noteContentViewer {
  position: fixed;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
}
</style>
