<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand>Header</b-navbar-brand>
      <b-navbar-nav class="c-header-menu-btn">
        <b-nav-item id="menu-btn" v-on:click="onClickMenu">
          <i class="glyphicon glyphicon-th-list"></i>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <b-container fluid>
      <b-row>
        <b-col id="layout-menu" sm="3">
          <LeftMenu />
        </b-col>
        <b-col>
          <router-view></router-view>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import LeftMenu from './layout/LeftMenu.vue'

var sizec = function(){
      var wsize = window.innerWidth;
      var mbtn = document.getElementById("menu-btn");
      var lmenu = document.getElementById("layout-menu");
      if(wsize > 575){
        mbtn.style.display = "none";
        lmenu.style.display = "block";
      }else{
        mbtn.style.display = "block";
        lmenu.style.display = "none";
      }
      
    document.getElementById("app").style.visibility = "visible";
    }
export default {
  data: function(){
    return {
      isMenu : false
    }
  },
  components:{
    LeftMenu
  },
  mounted: function () {
    window.onload = sizec;
    window.onresize = sizec;
  },
  methods : {
    onClickMenu : function(){
      this.isMenu = this.isMenu ? false :true;
      var lmenu = document.getElementById("layout-menu");
      if(this.isMenu){
        lmenu.style.display = "block";
      }else{
        lmenu.style.display = "none";
      }
    }
  }
}
</script>

<style>
.c-header-menu-btn{
    position: absolute;
    right:0.5rem;
}
#menu-btn{
    font-size:1.25em;
}
</style>
