<!--
 * @Author: Deng Yuhang
 * @Date: 2022-07-25 11:04:29
 * @LastEditors: Deng Yuhang
 * @LastEditTime: 2022-08-14 21:09:57
 * @Description: 
-->
<template>
  <div  :style="{transition: 'width 0.2s', width:leftMenuActiveKey === ''? '0px' : '300px', overflow: 'hidden'}">
  <div class="menu" v-if="!isSelectBook">
    <div class="header" @contextmenu="(e)=>{onContextMenu(e,'book', currentBookIndex)}" >
      <i class="el-icon-collection"></i>
      <el-input
        v-if="isEdit && editKey == 'book'"
        placeholder="请输入内容"
        v-model="bookList[currentBookIndex].title"
        @blur="isMouseOnInput = false"
        @focus="isMouseOnInput = true"
      >
      </el-input>
      <span @click="isSelectBook = !isSelectBook" v-else>{{ bookList[currentBookIndex].title }}</span>
      <i @click="isSelectBook = !isSelectBook" class="el-icon-arrow-down"></i>
    </div>

    <div class="content">
      <div class="left">
        <div v-for="(item, index ) in bookList[currentBookIndex].noteList"  @contextmenu="(e)=>{onContextMenu(e,'note', index)}"
          :class="{ 'active': currentNoteIndex === index }" class="item">
          <i class="el-icon-notebook-1"></i>     
           <el-input
            v-if="isEdit && editKey == 'note' &&  editIndex == index"
            placeholder="请输入内容"
            v-model="bookList[currentBookIndex].noteList[currentNoteIndex].title"
            ref="note"
            @blur="isMouseOnInput = false"
            @focus="isMouseOnInput = true"
             > </el-input>  <span class="title" @click="changeNote(index)" v-else>{{ item.title }}</span>
        </div>
      </div>

      <div class="right">
        <div v-for="(item, index ) in bookList[currentBookIndex].noteList[currentNoteIndex].chapterList"  @contextmenu="(e)=>{onContextMenu(e,'chapter', index)}"
          :class="{ 'active': currentChapterIndex === index }" class="item">
          <el-input
            v-if="isEdit && editKey == 'chapter' &&  editIndex == index"
            placeholder="请输入内容"
            v-model="bookList[currentBookIndex].noteList[currentNoteIndex].chapterList[currentChapterIndex].title"
            ref="chapter"
            @blur="isMouseOnInput = false"
            @focus="isMouseOnInput = true"
             > </el-input>  <span class="title" @click="changeChapter(index)" v-else>{{ item.title }}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="button">添加分区</div>
      <div class="button">添加页面</div>
    </div>
  </div>

  <div class="menu" v-else>
    <div class="header" @click="isSelectBook = !isSelectBook">
      <i class="el-icon-collection"></i>
      <span>{{ bookList[currentBookIndex].title }}</span>
      <i class="el-icon-arrow-up"></i>
    </div>

    <div class="content">
      <div class="bookOptions">
        <div v-for="(item, index ) in bookList" :key="item.id" @contextmenu="(e)=>{onContextMenu(e,'book', index)}"
          :class="{ 'active': currentBookIndex === index }" class="item">
          <i class="el-icon-collection"></i>
          <el-input
            v-if="isEdit && editKey == 'book' &&  editIndex == index"
            placeholder="请输入内容"
            v-model="bookList[index] .title"
            @blur="isMouseOnInput = false"
            @focus="isMouseOnInput = true"
          >
           </el-input>
          <span class="title" @click="changeBook(index)" v-else>{{ item.title }}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="button">添加笔记本</div>
    </div>
  </div>
  <ContextMenu></ContextMenu>
  </div>
</template>

<script>
import { store } from "@/config";
import ShortCutBar from "./ShortCutBar.vue";
import ContextMenu from "./ContextMenu.vue"
import Vue from "vue";
import { mapState, mapActions, mapMutations } from "vuex";
/**
 * @Author: 王林
 * @Date: 2021-06-24 22:54:25
 * @Desc: 侧边栏容器
 */
export default {
  name: "Menu",
  props: {
    mindMap: {
      type: Object,
    },
  },
  computed: {
    ...mapState({
      leftMenuActiveKey:'leftMenuActiveKey'
    })
  },
  components: {
    ShortCutBar,
    ContextMenu
  },
  data() {
    return {
      bookList: [{ title: '计算机基础', id: '12', 
      noteList: [ 
      { title: 'css基础', id: '1', chapterList: [{ title: '块元素', id: '1', content:null }, { title: '动画', id: '3' }, { title: '布局', id: '4' }] },
      { title: 'html基础', id: '2', chapterList: [{ title: 'dom事件', id: '2' }, { title: '语义话节点', id: '4' }, { title: '节点树渲染', id: '5' }] },
      { title: 'web基础', id: '3',  chapterList: [{ title: '浏览器原理', id: '3' }, { title: ' worker并行', id: '2' }, { title: 'http协议', id: '5' }] }]}, 
      { title: '数据库基础', id: '123', noteList:[] },
      { title: '网络安全基础', id: '124' }],
      currentBookIndex: 0,
      currentChapterIndex: 0,
      currentNoteIndex: 0,
      isSelectBook: false,
      input: '',
      isEdit:false,
      editKey: '',
      editIndex: 0,
      isMouseOnInput: true,
      isRename:false,
      copyData:{key:'', index:0, data:null}
    };
  },
  watch: {
    isEdid:function() { 
      this.isEdit ? this.mindMap.keyCommand.removeShortcut('Del|Backspace') :  this.mindMap.keyCommand.addShortcut('Del|Backspace', this.removeNodeWrap)
    },
    isMouseOnInput:function() {
      console.log('isMouseOnInput')
      if(!this.isEdit) return
      if(this.isMouseOnInput){
        this.$bus.$off("draw_click", this.finishEdit);  
         this.$bus.$off("node_click", this.finishEdit); 
         this.$bus.$off("expand_btn_click", this.finishEdit);
      }else{
          this.$bus.$on("draw_click", this.finishEdit);
          this.$bus.$on("node_click", this.finishEdit);
          this.$bus.$on("expand_btn_click", this.finishEdit);
      }
    }
  },
  created() {
      this.$bus.$on("leftMenu_rename", this.reName);
      this.$bus.$on("leftMenu_create", this.create);
      this.$bus.$on("leftMenu_remove", this.delete);
      this.$bus.$on("leftMenu_copy", this.copy);
      this.$bus.$on("leftMenu_paste", this.paste);
      this.$bus.$on("leftMenu_cut", this.cut);

  },
    beforeDestroy() {
      this.$bus.$off("leftMenu_rename", this.reName);
      this.$bus.$off("leftMenu_create", this.create);
      this.$bus.$off("leftMenu_remove", this.delete);
      this.$bus.$off("leftMenu_copy", this.copy);
      this.$bus.$off("leftMenu_paste", this.paste);
      this.$bus.$off("leftMenu_cut", this.cut);
    },
        mounted(){
      this.changeChapter(0)
    },
  methods: {
    ...mapMutations(['updateState']),
    ...mapActions(['changeMindMapDataById']),
    changeNote(ind) {
      this.currentNoteIndex = ind;
      this.changeChapter(0)
      // this.chapterList = this.noteList[ind].chapterList
    },
    changeChapter(ind) {
      this.currentChapterIndex = ind;
      this.changeMindMapDataById(this.bookList[this.currentBookIndex].noteList[this.currentNoteIndex].chapterList[this.currentChapterIndex].id)
    },
    changeBook(ind) {
      // this.currentBook = this.bookList[ind]
      this.currentBookIndex = ind;
      this.changeNote(0)
      this.isSelectBook = false
    },
    onContextMenu(e, key,ind){
      switch (key) {
        case "chapter":
          this.currentChapterIndex = ind;
          break;
        case 'book':
          this.currentBookIndex = ind;
          break;
        case 'note':
          this.currentNoteIndex = ind;
          break;
        default:
          console.log("unknown key: " + key)
      }
      e.preventDefault()
      this.$bus.$emit("menu_contextmenu", key,ind, e.pageX, e.pageY)
    },
    create(key,ind) {
      switch(key){
          case 'chapter':
            this.bookList[this.currentBookIndex]?.noteList[this.currentNoteIndex]?.chapterList.splice(ind+1,0, {title:'新增无标题页面', id:Math.random(10, 100).toFixed(4) * 10000});
            // const note = this.noteList[this.currentNoteIndex]
            this.currentChapterIndex = ind+1
            // this.noteList.splice(this.currentNoteIndex,1, {...note,chapterList:this.chapterList });
            // TODO: 网络请求新增chapter
            this.reName('chapter', ind+1)
            break;
          case 'note':
            this.bookList[this.currentBookIndex]?.noteList.splice(ind+1, 0 ,{title:'新增无标题页面', id:Math.random(10, 100).toFixed(4) * 10000,chapterList: [{ title: '新增无标题页面', id:Math.random(10, 100).toFixed(4) * 10000}]  });
            this.currentNoteIndex = ind+1;
            this.currentChapterIndex = 0;
            this.reName('note', ind+1);
            // TODO: 网络请求新增note，并且在该note下新增一个chapter
            break;
          case 'book':
            this.bookList.splice(ind+1,0, {title:"新增笔记", id:Math.random(10, 100).toFixed(4) * 10000, noteList:[]})
            this.currentBookIndex = ind+1;
            this.currentNoteIndex = 0;
            this.currentChapterIndex = 0;
            this.reName('book', ind+1);
            break
          default:
            console.log(key)
        }
    },

    delete(key, ind){
      console.log('delete ' + key)
      switch(key){
        case 'chapter':
          this.bookList[this.currentBookIndex]?.noteList[this.currentNoteIndex]?.chapterList.splice(ind,1);
          this.currentChapterIndex = (ind -1) || 0
          break;
        case 'note':
          this.bookList[this.currentBookIndex]?.noteList.splice(ind, 1 );
          this.currentNoteIndex = (ind -1) || 0
          this.currentChapterIndex = 0
          break
        default:
          console.log(key)
      }
    },
    reName(key, ind){
      this.isEdit = true;
      this.editKey = key;
      this.editIndex = ind;
      this.isRename = true;
       Vue.nextTick(()=>{
          this.$refs[key][0].focus()
           this.$refs[key][0].select()
      })
    },
    cut(key, ind){
      this.copy(key, ind);
      this.delete(key,ind)
    },
    copy(key, ind){
      let data = null;
      switch(key){
        case 'chapter':
          data =  this.bookList[this.currentBookIndex]?.noteList[this.currentNoteIndex]?.chapterList[ind];
          break;
        case 'note':
          data = this.bookList[this.currentBookIndex]?.noteList[ind]
          break;
        default:
          console.log(key)
      }
      this.copyData = {
        key: key,
        ind: ind,
        data: data
      }
    },

    paste(key,ind){
      switch(key){
        case 'chapter':
          this.bookList[this.currentBookIndex]?.noteList[this.currentNoteIndex]?.chapterList.splice(ind+1,0, this.copyData.data);
          this.currentChapterIndex = ind+1;
          break;
        case 'note':
          this.bookList[this.currentBookIndex]?.noteList.splice(ind+1,0, this.copyData.data);
          this.currentNoteIndex = ind+1;
          this.currentChapterIndex = 0;
          break;
        default:
          console.log(key)
      }
    },

    finishEdit() {
      console.log('finishEdit')
      this.$bus.$off("draw_click", this.finishEdit);  
      this.$bus.$off("node_click", this.finishEdit); 
      this.$bus.$off("expand_btn_click", this.finishEdit);
      if(this.isEdit){
        this.isEdit = false;
      }else{
        return
      }
      if(this.isRename ){
        switch(this.editKey){
          case 'book':
            try{
              // this.bookList[this.currentBookIndex] = this.currentBook
              this.isRename = false;
              // TODO 网络请求更新，更新item name
              }catch(e){
                console.log('error',e)
              }
            break;
          case 'note':
           try{
              // this.noteList[this.editIndex]
              this.isRename = false;
              // TODO 网络请求更新，更新item name
              }catch(e){
                console.log('error',e)
              }
            break;
          case 'chapter':
            try{
              // this.noteList[this.editIndex]
              this.isRename = false;
              // TODO 网络请求更新，更新item name
              }catch(e){
                console.log('error',e)
              }
            break;
          default:
            console.log('')
        }
        this.isMouseOnInput = true;
      }


    } 
  }
};
</script>

<style lang="less" scoped>
.menu {
  position: relative;
  height: 100%;
  width: 300px;
  border-right: 1px solid rgb(99, 97, 97);
  ;

  .header {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 12px 8px;
    border-bottom: 1px solid rgba(81, 84, 84, 0);

    &:hover {
      background-color: rgb(232, 241, 236);
    }
  }

  .content {
    display: flex;
    border-top: 1px solid rgb(99, 97, 97);
    height: calc(100% - 45px);

    .active {
      background-color: rgb(206, 224, 206);
    }

    .bookOptions {
      width: 100%;
    }

    .left {
      flex: 1 1 50%;
      border-right: 1px solid rgb(99, 97, 97);
    }

    .right {
      flex: 1 1 50%;
    }
    .title{
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;;
      height: 100%;
      width: 120px;
    }
    .item {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 4px 8px;

      &:hover {
        background-color: rgb(232, 241, 236);
      }
    }
  }

  .footer {
    position: absolute;
    bottom: 0;
    display: flex;
    width: 100%;
    ;


    .button {
      border-top: 1px solid rgb(99, 97, 97);
      padding: 12px;
      flex: 1 1 auto;
      cursor: pointer;

      &:hover {
        background-color: rgb(232, 241, 236);
      }
    }
  }

  .el-input{
    width: auto;
 /deep/ .el-input__inner {
      height: 30px;
      line-height: 30px ;
      padding: 0 5px;
    }
  }


}
</style>
