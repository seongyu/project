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
// import $ from 'jquery'

export default {
  name: 'Default',
  components:{TableLayout},
  data() {
    return {
      title: "Default",
      search:'',
      lists:{title:[

      ],
      tpage:1,
      page:1,
      item:[

      ]}
    };
  }
}
</script>

<style scoped>

</style>