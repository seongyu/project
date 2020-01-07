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
          placeholder="Search by Device ID"
          aria-describedby="inputGroup-sizing-default"
          v-model="search"
        />
      </div>
    </template>
    <template v-slot:cbody>
      <tr>
        <th v-for="title in lists.title" v-bind:key="title.title">{{loc[title]}}</th>
      </tr>
      <tr v-for="item in lists.item" v-bind:key="item.$id" v-show="item.device_id.startsWith(search)">
        <td>{{item.device_id}}</td>
        <td>{{item.device_model_name}}</td>
        <td>{{item.device_type}}</td>
        <td>{{item.registered_time}}</td>
        <td>{{item.modified_time}}</td>
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
  name: "Dashboard",
  components: { TableLayout },
  data() {
    return {
      title: "Dashboard",
      search: "",
      loc : localize,
      lists: {
        title: [
          "device_id",
          "device_model_name",
          "device_type",
          "registered_time",
          "modified_time"
        ],
        tpage: 1,
        page: 1,
        item: [
          {
            device_id: "AOOO1",
            device_model_name: "somewhere",
            device_type: "IN",
            registered_time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            modified_time: 40
          }
        ]
      }
    };
  },
  async mounted() {
        var _url, _rtn, _items;
        _url = [this.$apiUrl,'/device'].join("");
        _rtn = await this.$http.get(_url);
        _items = _rtn.data.data;

        this.lists.item = _items;
  },
  methods: {
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