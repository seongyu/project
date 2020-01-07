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
        <button v-b-modal.modal-1>ADD NEW ZONE</button>
        <b-modal id="modal-1" title="ADD ZONE" @ok="onAddEvent">
            <b-form-input class="text" type="text" v-model="target.zone_id" placeholder="INPUT ZONE ID"/>
            <br/>
            <b-form-input class="input" type="text" v-model="target.map_id" placeholder="INPUT MAP ID" />
        </b-modal>
        <!-- <button v-on:click="onAddEvent">ADD NEW ZONE</button> -->
      </div>
    </template>
    <template v-slot:cbody>
      <tr>
        <th v-for="title in lists.title" v-bind:key="title.title">{{loc[title]}}</th>
      </tr>
      <tr v-for="(item,i) in lists.item" v-bind:key="item.$id">
        <td>{{i+1}}</td>
        <td>{{item.zone_id}}</td>
        <td>{{item.map_name}}</td>
        <td>{{item.enabled}}</td>
        <td>{{item.distance}}</td>
        <td>{{item.installed_date}}</td>
        <td>{{item.edit_date}}</td>
        <td>
          <button v-on:click="onDelEvent(item.zone_id,item.map_id)">
            <i class="glyphicon glyphicon-remove"></i>
          </button>
        </td>
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
import _util from "../assets/util.js";
import localize from "../assets/localization.json";
import $ from "jquery";

export default {
  name: "Zone",
  components: { TableLayout },
  data() {
    return {
      title: "Zone",
      search: "",
      loc: localize,
      target : {map_id:null,zone_id:null},
      lists: {
        title: [
          "index",
          "zone_id",
          "map_name",
          "enabled",
          "distance",
          "installed_date",
          "edit_date",
          "func"
        ],
        tpage: 1,
        page: 1,
        item: [
          {
            zone_id: null,
            map_id : null,
            map_name: null,
            enabled: null,
            distance: null,
            installed_date: null,
            edit_date: null
          }
        ]
      }
    };
  },
  async mounted() {
    var _url = [this.$apiUrl, "/map/zone"].join("");
    var _rtn = await this.$http.get(_url);

    if ((_rtn.status != 200) & (_rtn.data.length <= 0)) {
      return null;
    }
    var items = [],
      item,
      _it,
      i;
    try {
      for (i in _rtn.data) {
        _it = _rtn.data[i];
        item = {
          zone_id: _it.zone_id,
          map_id: _it.map_id,
          map_name: _it.name,
          enabled: _it.enabled ? "활성" : "비활성",
          distance: _it.real_distance_factor,
          installed_date: _it.created_time
            ? moment(_util.timeparser(_it.created_time)).format("YYYY-MM-DD")
            : null,
          edit_date: _it.modified_time
            ? moment(_util.timeparser(_it.modified_time)).format("YYYY-MM-DD")
            : null
        };
        items.push(item);
      }
    } catch (e) {
      console.log(e);
    }
    this.lists.item = items;
  },
  methods: {
    onAddEvent: async function() {
        if(!!this.target.map_id||!!this.target.zone_id){
            alert('Fill require fields all.');
            return;
        }
      var _url = [this.$apiUrl, "/map/zone"].join("");
      var _rtn = await this.$http.post(_url, {
        map_id: this.target.map_id,
        zone_id: this.target.zone_id
      });
      if (_rtn.data) {
        location.reload();
      } else {
        console.log(_rtn);
        alert("Fail to add zone");
      }
    },
    onDelEvent: async function(zone_id,map_id) {
      var _url = [this.$apiUrl, "/map/zone/",map_id,'/',zone_id].join("");
      var _rtn = await this.$http.delete(_url);
      if (_rtn.data) {
        location.reload();
      } else {
        console.log(_rtn);
        alert("Fail to delete zone");
      }
    },
    pageEvent: n => {
      var pgl = $("li.page-item");
      if (pgl.length == 0) {
        return null;
      } else {
        for (var i in pgl) {
          if (i == n - 1) {
            $(pgl[i]).addClass("active");
          } else {
            $(pgl[i]).removeClass("active");
          }
        }
      }
    }
  }
};
</script>
<style scoped>
</style>