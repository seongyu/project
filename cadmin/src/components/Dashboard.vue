<template>
  <TableLayout :title="title" :lists="lists">
    <template v-slot:cheader>
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text" id="inputGroup-sizing-default">
            <i class="glyphicon glyphicon-search"></i>
          </span>
        </div>
        <input
          type="text"
          class="form-control"
          aria-label="Default"
          placeholder="Search"
          aria-describedby="inputGroup-sizing-default"
          v-model="search"
        />
      </div>
    </template>
    <template v-slot:cbody>
      <tr>
        <th v-for="title in lists.title" v-bind:key="title.title">{{title}}</th>
      </tr>
      <tr v-for="item in lists.item" v-bind:key="item.$id">
        <td>{{item.tag}}</td>
        <td>{{item.loc}}</td>
        <td>{{item.status}}</td>
        <td>{{item.date}}</td>
        <td>{{item.eng}}</td>
        <td>{{item.str}}</td>
        <td>{{item.dis}}</td>
      </tr>
    </template>
    <template v-slot:cfoot>
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          
          <li class="page-item" v-for="n in lists.tpage" v-bind:key="n">
            <a class="page-link" href="#" v-on:click="pageEvent(n)">{{n}}</a>
          </li>
        </ul>
      </nav>
    </template>
  </TableLayout>
</template>

<script>
import TableLayout from "../layout/TableLayout.vue";
import moment from "moment";
import $ from 'jquery';

export default {
  name: "Dashboard",
  components: { TableLayout },
  data() {
    return {
      title: "Dashboard",
      search: "",
      lists: {
        title: [
          "태그",
          "감지 위치",
          "상태",
          "갱신일시",
          "송출전력",
          "신호세기",
          "거리(M)"
        ],
      tpage:1,
      page:1,
        item: [
          {
            tag: "AOOO1",
            loc: "somewhere",
            status: "IN",
            date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            eng: 40,
            str: 52,
            dis: 2.5
          }
        ]
      }
    };
  },
  methods : {
    pageEvent : (n)=>{
      var pgl = $('li.page-item');
      if(pgl.length==0){
        return null;
      }else{
        for(var i in pgl){
        if(i==n-1){
            $(pgl[i]).addClass('active')
          }else{
            $(pgl[i]).removeClass('active')
          }
        }
      }
      
    }
  }
};
</script>

<style scoped>
</style>