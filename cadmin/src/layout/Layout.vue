<template>
  <div>
    <b-navbar id="header" toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand>Sparkling <span>RTLS</span></b-navbar-brand>
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
            <router-view id="checkout"></router-view>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
 
<script>
import $ from 'jquery'
import LeftMenu from './LeftMenu.vue'

var sizec = function(){
      var wsize = window.innerWidth;
    var mbtn = $('#menu-btn');
    var lmenu = $('#layout-menu');
    var mheight = $('#checkout').height() > $(window).height() ? $(document).height() : $(window).height();
      if(wsize > 575){
          mbtn.hide();
          lmenu.show(); 
          lmenu.height(mheight-$('#header').outerHeight())
      }else{
          lmenu.hide();
          mbtn.show();
      }
      
    // document.getElementById("app").style.visibility = "visible";
    }

export default {
  name: 'Layout',
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
  updated (){
    sizec();
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
<style scoped>
span {
    color:orange
}
.c-header-menu-btn{
    position: absolute;
    right:0.5rem;
}
#menu-btn{
    font-size:1.25em;
}
#layout-menu{
    
  background-color:#343a40
}
.container-fluid{
    background-color:#d3d3d3;
}
</style>