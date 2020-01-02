<template>
    <b-container>
    <b-row class="my-1" v-for="title in titles" :key="title">
      <b-col sm="3" style="text-align:right">
        <label>{{ loc[title] }}:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input v-model="target[title]" v-bind:readonly="title=='registrater' || title=='registered_date'? false : readonly" v-bind:placeholder="title!='registered_date'? title : 'YYYY-MM-DD'"/>
      </b-col>
    </b-row>
    <b-button class="btn btn-block" v-show="!readonly" v-on:click="onSubmit">REGISTER</b-button>
  </b-container>
</template>

<script>
// import $ from 'jquery';
import moment from "moment";
import localize from "../assets/localization.json"

export default {
    name:'Detail',
    data(){
      return {
        vuetype:'read',
        readonly : false,
        type : location.pathname.split('/')[1],
        titles:[],
        loc:localize,
        target : {
          device_id:null,
          mac_address:null,
          ip_address:null,
          registrater:null,
          registered_date: null,

          // if it need to use, that time will be added
          // installDt:moment(new Date()).format("YYYY-MM-DD"),
          // installLoc:'somewhere',
          // editor:'someone',
          // editDt:moment(new Date()).format("YYYY-MM-DD"),
          // etc:'test',
          // maxBuffer:10,
          // rssi:-54,
          // avlDistence:3,
          // envPoint : 3,
          // method : 1
        }
    }},
    async mounted (){
      this.titles = Object.keys(this.target);
      //var _url = [this.$apiUrl,'/device/',this.$route.params.id].join("");
      //var result = await this.$http.get(_url);
      //console.log(result);
      if(this.$route.params.id=='new'){
        this.vuetype = 'write';

        // delete this.target.etc; 
        delete this.target.registered_date;

        this.target.device_id = null;
        this.target.mac_address = null;
        this.target.ip_address = null;
        this.target.registrater = null;
        this.target.registered_date = null;

        return null;
      }else if(location.search.indexOf('update')<=0){
        this.readonly = true
      }
      

    },
    methods : {
      onSubmit () {
        var item = this.target;
        
        if(!item.mac_address||!item.registrater||!item.registered_date||!item.device_id){
          return alert("YOU SHOULD INSERT ALL FEILD!")
        }

        var _data = {
          ip_address : item.ip_address,
          registrater : item.registrater,
          registered_date : item.registered_date
        };

        var _send_data = {
          device_id : item.mac_address,
          device_type : this.type,
          device_model_name : item.device_id,
          data : JSON.stringify(_data)
        }

        console.log(_send_data)
      }
    }
}
</script>

<style scoped>
label{
        text-align: right;
    line-height: 2.2em;
}
</style>