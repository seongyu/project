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
      <tr v-for="(item, i) in lists.item" v-bind:key="item.tag">
        <td>{{i+1}}</td>
        <td>{{item.tag}}</td>
        <td>{{item.macaddr}}</td>
        <td>{{item.chgDt}}</td>
        <td>{{item.useYN=='Y'?'사용':'미사용'}}</td>
        <td>{{item.insertor}}</td>
        <td>{{item.insertDt}}</td>
        <td>{{item.editDt}}</td>
        <td>{{item.etc}}</td>
        <td>EXECUTE</td>
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
  name: 'Beacon',
  components:{TableLayout},
  data() {
    return {
      title: "Beacon",
      search:'',
      lists:{title:[
        '순번','태그','맥어드레스','베터리 교체일','사용여부','등록자','등록일','갱신일','비고','실행'
      ],
      tpage:1,
      page:1,
      item:[{
        tag:'A0001',
        macaddr:'some mac addr',
        chgDt:moment(new Date()).format("YYYY-MM-DD"),
        useYN:'Y',
        insertor:'someone',
        insertDt:moment(new Date()).format("YYYY-MM-DD"),
        editDt:moment(new Date()).format("YYYY-MM-DD"),
        etc:'test'
      }
      ]}
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
}
</script>

<style scoped>

</style>