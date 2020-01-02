<template>
  <TableLayout :title="title" :lists="lists">
    <template v-slot:cbody>
      <div>
        <b-card v-for="map in maps" v-bind:key="map.tag" 
          :title=map.title
          :img-src=map.src
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 15rem;"
          class="mb-2"
        >
          <b-card-text>
            {{map.desc}}
          </b-card-text>

          <b-button class="btn btn-sm" href="#" variant="dark">Go Detail</b-button>
        </b-card>
      </div>
    </template>
    <template v-slot:cfoot>Footer area</template>
  </TableLayout>
</template>

<script>
import TableLayout from "../layout/TableLayout.vue";
import $ from "jquery";

export default {
  name: "Map",
  components: { TableLayout },
  data() {
    return {
      title: "Map",
      search: "",
      lists: { title: [], tpage: 1, page: 1, item: [] },
      maps : [{
        tag : '',
        title : '1F',
        src : 'https://picsum.photos/600/300/?image=25',
        desc : 'some description here'
      }]
    };
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
article{
  margin:1em;
}
</style>