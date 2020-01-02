<template>
  <div>
    <b-nav vertical>
      <b-nav-item >
                <router-link to="/Dashboard">대시보드</router-link>
              </b-nav-item>
              <b-nav-item>
                <router-link to="/Beacon">비콘</router-link>
              </b-nav-item>
              <b-nav-item >
                <router-link to="/Scanner">스캐너</router-link>
              </b-nav-item>
              <b-nav-item>
                <router-link to="/Zone">존</router-link>
              </b-nav-item>
              <b-nav-item >
                <router-link to="/Map">맵</router-link>
              </b-nav-item>
              <b-nav-item>
                <div id="m" v-on:click="submenuEvent('m')">모니터
                  <i class="glyphicon glyphicon-minus"></i>
                </div>
              </b-nav-item>

              <b-nav-item class="monitorSub">
                <router-link to="/Monitor/realtime">실시간위치 모니터링</router-link>
              </b-nav-item>
              <b-nav-item class="monitorSub">
                <router-link to="/Monitor/beacon">비콘 모니터링</router-link>
              </b-nav-item>

              <b-nav-item >
                <div id='s' v-on:click="submenuEvent('s')">통계
                  <i class="glyphicon glyphicon-minus"></i></div>
              </b-nav-item>
              <b-nav-item class="statSub">
                <router-link to="/Stat/beacon">비콘 위치 로그</router-link>
              </b-nav-item>
              <b-nav-item>
                <router-link to="/Default">기본정보</router-link>
              </b-nav-item>
              <!-- <b-nav-item >
                <router-link to="/Main">Main</router-link>
              </b-nav-item>
              <b-nav-item>
                <router-link to="/Default">Default</router-link>
              </b-nav-item> -->
            </b-nav>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'LeftMenu',
  data (){
    return {
      monitor : false,
      stat : false
    }
  },
  methods : {
    submenuEvent : function(id) {
      if(id=='m'){
        if(!this.monitor){
          $('.monitorSub').show();
          this.monitor = true;
          $('#m i').removeClass('glyphicon-minus').addClass('glyphicon-plus')
        }else{
          $('.monitorSub').hide();
          this.monitor = false;
          $('#m i').removeClass('glyphicon-plus').addClass('glyphicon-minus')
        }
      }
      if(id=='s'){
        if(!this.stat){
          $('.statSub').show();
          this.stat = true;
          $('#s i').removeClass('glyphicon-minus').addClass('glyphicon-plus')
        }else{
          $('.statSub').hide();
          this.stat = false;
          $('#s i').removeClass('glyphicon-plus').addClass('glyphicon-minus')
        }
      }
    }
  }
}
</script>
<style lang="css" scoped>
.nav-item a {color:white;text-decoration: none}
.nav-item .active{color:#b0ff47}
.monitorSub, .statSub {
  display : none;
  padding-left: 1.5em;
}
div i{
    float: right;
    position: relative;
}
</style>