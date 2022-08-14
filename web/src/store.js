/*
 * @Author: Deng Yuhang
 * @Date: 2022-07-04 13:15:10
 * @LastEditors: Deng Yuhang
 * @LastEditTime: 2022-08-14 17:33:57
 * @Description: 
 */
import Vue from 'vue'
import Vuex from 'vuex'
import exampleData from 'simple-mind-map/example/exampleData';
import {exeample1, exeample2,exeample3,exeample4,exeample5} from  'simple-mind-map/example/exampleData';
Vue.use(Vuex) 

const store = new Vuex.Store({
    state: {
        mindMapData: null, // 思维导图数据,
        leftMenuActiveKey:'menu',
        dataMap:{1:exeample1, 2:exeample2, 3:exeample3, 4:exeample4, 5:exeample5}
    },
    mutations: {
        /** 
         * @Author: 王林 
         * @Date: 2021-04-10 14:50:01 
         * @Desc: 设置思维导图数据 
         */
        setMindMapData(state, data) {
            state.mindMapData = data
        },
        /**
         * @Date: 2022-08-09
         * @Author: Deng Yuhang
         * @description: 更新state
         * @param {*} state
         * @param {*} data
         * @return {*}
         */
        updateState(state, data){
            Object.keys(data).forEach(key=>{
                state[key] = data[key]
            })
        }
    },
    actions: {
        /** 
         * @Author: 王林 
         * @Date: 2021-04-10 14:50:40 
         * @Desc: 设置初始思维导图数据 
         */
        getUserMindMapData(ctx) {
            try {
                let {
                    data
                } = {
                    data: {
                        data: {
                            mindMapData: exeample1
                        }
                    }
                }
                ctx.commit('setMindMapData', data.data)
            } catch (error) {
                console.log(error)
            }
        },
        async changeMindMapDataById(ctx, id) {
            try{
                if(ctx.state.dataMap[id]) {
                    console.log(ctx.state.dataMap[id])
                    ctx.commit('setMindMapData', ctx.state.dataMap[id])
                }
            }catch(error){
                console.log(error)
            }
        }

    }
})

export default store