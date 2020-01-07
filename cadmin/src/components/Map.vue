<template>
  <TableLayout :title="title" :lists="lists">
    <template v-slot:cbody>
      <div>
        <b-card
          v-for="map in maps"
          v-bind:key="map.map_id"
          :title="map.name"
          :img-src="map.image_url"
          img-alt="Image"
          style="max-width: 20rem;text-align:center"
          img-top
          tag="article"
          class="mb-3"
          v-show="map.map_id"
        >
          <b-card-text>
            {{loc['enabled']}}{{loc['status']}} : {{map.enabled}}<br>
            {{loc['created_time']}} : {{map.created_time}}<br>
            {{loc['modified_time']}} : {{map.modified_time}}
          </b-card-text>
        <b-modal id="modal-1" :title="map.name" size="xl">
            <img :src="map.image_url" alt="Image" style="max-width:100%">
          </b-modal>
          <b-button class="btn btn-sm" v-b-modal.modal-1 variant="dark">Go Detail</b-button>
        </b-card>
      </div>
    </template>
    <template v-slot:cfoot></template>
  </TableLayout>
</template>

<script>
import TableLayout from "../layout/TableLayout.vue";
import moment from "moment";
import _util from "../assets/util.js";
import localize from "../assets/localization.json";
import $ from "jquery";

export default {
  name: "Map",
  components: { TableLayout },
  data() {
    return {
      title: "Map",
      search: "",
      loc: localize,
      lists: { title: [], tpage: 1, page: 1, item: [] },
      maps: [
        {
          map_id: null,
          created_time: null,
          modified_time: null,
          enabled: null,
          image_url: null,
          name: null,
          distance: null
        }
      ]
    };
  },
  async mounted() {
    var i,
      _url,
      _rt,
      items = [],
      item;
    _url = [this.$apiUrl, "/map"].join("");
    _rt = await this.$http.get(_url);
    _rt = _rt.data.data;
    for (i in _rt) {
      item = {
        map_id: _rt[i].map_id,
        created_time: moment(_util.timeparser(_rt[i].created_time)).format(
          "YYYY-MM-DD"
        ),
        modified_time: _rt[i].modified_time
          ? moment(_util.timeparser(_rt[i].modified_time)).format("YYYY-MM-DD")
          : null,
        enabled: _rt[i].enabled ? "활성" : "비활성",
        image_url: _rt[i].image_url,
        name: _rt[i].name,
        distance: _rt[i].real_distance_factor
      };
      items.push(item);
    }
    this.maps = items;
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
article {
  margin: 1em;
}
</style>