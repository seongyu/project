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
        <th v-for="title in lists.title" v-bind:key="title.title">{{loc[title]}}</th>
      </tr>
      <tr v-for="item in lists.item" v-bind:key="item.$id">
        <td>{{item.tag}}</td>
        <td>{{item.rssi}}</td>
        <td>{{item.version}}</td>
        <td>{{item.battery_level}}</td>
        <td>{{item.location}}</td>
        <td>{{item.collect_time}}</td>
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
import moment from 'moment';
import _util from "../assets/util.js";
import localize from "../assets/localization.json";
import $ from 'jquery';

export default {
  name: 'Stat',
  components:{TableLayout},
  data() {
    return {
      title: "Statistics",
      search:'',
      loc: localize,
      sub : location.pathname.split('/')[2],
      lists:{title:[
        'tag','rssi','version','battery_level', 'location','collect_time'
      ],
      tpage:1,
      page:1,
      item:[
        {
          tag : null,
          rssi : null,
          version:null,
          battery_level:null,
          location : null,
          collect_time : null
        }
      ]}
    };
  },
  async mounted (){
    this.title = String(this.sub).toUpperCase() + ' ' + this.title;
    var _url, _raw, _it, items=[], item, i, _r;

    _url = [this.$apiUrl, "/anchor/raws"].join("");
    _raw = await this.$http.get(_url);
    for(i in _raw.data){  
      _it = _raw.data[i];
      item = {
        tag : _it.mac,
        rssi : _it.rssi,
        version : _it.majorVer + ':' + _it.minorVer,
        battery_level : _it.battLevel + '%',
        location : 'wait',
        collect_time : 'wait'
      }
      items.push(item);
    }
    this.lists.item = items;

    for(i in items){
      _it = items[i];
      _url = [this.$apiUrl, "/map/tag/position/"+_it['tag']].join("");
      try{
        _raw = await this.$http.get(_url);
        if(_raw&&_raw.data&&_raw.data.length>0){
          _r = _raw.data[0];
          items[i].location = _r['x']+', '+_r['y'];
          items[i].collect_time = moment(_util.timeparser(_r.collect_time)).format("YYYY-MM-DD")
        }
      }catch(e){
        continue;
      }
    }
    this.lists.item = items;
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