<template>
  <TableLayout :name="name" :lists="lists">
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
        <th v-for="title in lists.title" v-bind:key="title.title">{{loc[title]}}</th>
      </tr>
      <tr v-for="(item, i) in lists.item" v-bind:key="item.tag">
        <td>{{i+1}}</td>
        <td>{{item.tag}}</td>
        <td>{{item.mac_address}}</td>
        <td>{{item.replace_date}}</td>
        <td>{{item.status==1?'사용':'미사용'}}</td>
        <td>{{item.registerer}}</td>
        <td>{{item.registered_date}}</td>
        <td>{{item.edit_date}}</td>
        <td>{{item.etc}}</td>
        <td><router-link :to="'/Beacon/'+item.tag"><i class="
glyphicon glyphicon-info-sign"></i></router-link><router-link :to="'/Beacon/'+item.tag+'?type=update'"><i class="
glyphicon glyphicon-pencil"></i></router-link></td>
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
// import _util from "../assets/util.js";
import localize from "../assets/localization.json";
import $ from "jquery";

export default {
  name: 'Beacon',
  components:{TableLayout},
  data() {
    return {
      name: "Beacon",
      search:'',
      loc: localize,
      lists:{
        title: [
          "index",
          "tag",
          "mac_address",
          "replace_date",
          "status",
          "registerer",
          "registered_date",
          "edit_date",
          "etc",
          "exec"
        ],
      tpage:1,
      page:1,
      item:[{
        tag:'A0001',
        mac_address:'some mac addr',
        replace_date:moment(new Date()).format("YYYY-MM-DD"),
        status:1,
        registerer:'someone',
        registered_date:moment(new Date()).format("YYYY-MM-DD"),
        edit_date:moment(new Date()).format("YYYY-MM-DD"),
        etc:''
      }
      ]}
    };
  },
  // async mounted() {
  //   var _url = [this.$apiUrl,'/device?type=Scanner'].join("");
  //   var _rtn = await this.$http.get(_url);

  //   if(_rtn.status!=200 & _rtn.data.length<=0){
  //       console.log('No device registed');
  //       return null;
  //   }
  //   var items = [];
  //   try{
  //       for(var i in _rtn.data.data){
  //           var _it = _rtn.data.data[i];
  //           var item = {
  //               tag : _it['device_model_name'],
  //               mac_address : _it['device_id'],
  //               registered_date : moment(_util.timeparser(_it.registered_time)).format("YYYY-MM-DD"),
  //               edit_date : _it['modified_time'] ? moment(_util.timeparser(_it.modified_time)).format("YYYY-MM-DD") : null
  //           }

  //           if(_it.data){
  //               var _parse = JSON.parse(_it['data']);
  //               _parse.registerer ? item.registerer = _parse.registerer : null;
  //               _parse.ip_address ? item.ip_address = _parse.ip_address : null;
  //               _parse.editor ? item.editor = _parse.editor : null;
  //               _parse.installed_date ? item.installed_date = _parse.installed_date : null;
  //               _parse.installed_location ? item.installed_location = _parse.installed_location : null;
  //           }
            
  //           items.push(item);
  //       }
        
  //   }catch(e){
  //       console.log(e);
  //   }
    

  //   this.lists.item = items;
  // },
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