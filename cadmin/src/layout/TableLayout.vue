<template>
  <table class="table table-sm table-bordered">
    <thead>
      <tr>
        <th
          v-bind:colspan="lists.title.length"
          style="padding:1.2em;background-color:#ababab"
        >{{title}}</th>
      </tr>
      <tr>
        <th v-bind:colspan="lists.title.length" style="padding:.8em;background-color:white">
          <slot name="cheader"></slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <slot name="cbody"></slot>
    </tbody>
    <tfoot>
      <tr>
        <td v-bind:colspan="lists.title.length" style="padding-top:1.2em">
          <slot name="cfoot"></slot>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
export default {
  name: "TableLayout",
  //   data (){return {
  //       title : ''
  //   }},
  props: {
    lists: Object,
    title: {
      type: String,
      default: ""
    }
  },
  // created() {
  //   console.log(this.lists);
  // }
};
</script>
