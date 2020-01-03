<template>
    <b-container>
    <b-row class="my-1" v-for="title in titles" :key="title" v-show="target[title]==null?false:true">
      <b-col sm="3" style="text-align:right">
        <label>{{ loc[title] }}:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input v-model="target[title]" 
        v-bind:readonly="!readonly ? title=='registerer' || title=='mac_address' || title=='registered_date'? true : readonly : readonly" 
        v-bind:placeholder="title!='status'? title!='registered_date'? title : 'YYYY-MM-DD' : 'Y/N'"/>
      </b-col>
    </b-row>
    <b-button class="btn btn-block" v-show="!readonly" v-on:click="onSubmit">REGISTER</b-button>
  </b-container>
</template>

<script>
// import $ from 'jquery';
import moment from "moment";
import _util from '../assets/util.js';
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
          registerer:null,
          registered_date: null,

          // if it need to use, that time will be added
          status : null,
          installed_date:null,
          installed_location:null,
          editor:null,
          edit_date:null,
          etc:null,
          maxBuffer:null,
          rssi:null,
          avlDistence:null,
          envPoint : null,
          method : null
        }
    }},
    async mounted (){
      this.titles = Object.keys(this.target);
      
      if(this.$route.params.id=='new'){
        this.vuetype = 'write';

        this.target.device_id = '';
        this.target.mac_address = '';
        this.target.ip_address = '';
        this.target.registerer = '';

        this.target.installed_date = '';
        this.target.installed_location = '';
        this.target.status = 'Y';
        return null;
      }
      
      try{
        var _url = [this.$apiUrl,'/device/',this.$route.params.id].join("");
        var result = await this.$http.get(_url);
        var _data = result.data.data[0];
        
        this.target.device_id = _data.device_model_name;
        this.target.mac_address = _data.device_id;
        this.target.status = _data.status == 1 ? 'Y' : 'N';
        this.target.registered_date = moment(_util.timeparser(_data.registered_time)).format("YYYY-MM-DD");
        if(_data.data && _data.data!=''){
          var _parse = JSON.parse(_data.data);
          this.target.registerer = _parse.registerer;
          this.target.ip_address = _parse.ip_address;
          this.target.editor = _parse.editor ? _parse.editor : '';
          this.target.installed_date = _parse.installed_date ? _parse.installed_date : '';
          this.target.installed_location = _parse.installed_location ? _parse.installed_location : '';
        }

      }catch(e){
        alert('Fail to get device detail information.\nTry again');
        history.back(0);
      }
      
      if(location.search.indexOf('update')<=0){
        this.readonly = true
      }
    },
    methods : {
      async onSubmit () {
        var item = this.target;
        var _url=null, rtn=null;

        if(!item.mac_address||!item.registerer||!item.device_id){
          return alert("YOU SHOULD INSERT ALL FEILD!")
        }

        var _data = {registerer : item.registerer};
        
        item.ip_address ? _data.ip_address = item.ip_address : null;
        item.editor ? _data.editor = item.editor : null;
        item.installed_date ? _data.installed_date = item.installed_date : null;
        item.ip_address ? _data.ip_address = item.ip_address : null;
        item.installed_location ? _data.installed_location = item.installed_location : null;


        var _send_data = {
          device_type : this.type,
          device_model_name : item.device_id,
          status : item.status.charAt(0).toLocaleLowerCase() == 'y' ? 1 : 0,
          data : JSON.stringify(_data)
        }
        
        if(location.search.indexOf('update')>0){
          // is for update
          _url = [this.$apiUrl,'/device/',this.$route.params.id].join("");
          rtn = await this.$http.post(_url,_send_data);
          
          if(rtn.status!=200 || rtn.data.status == false){
            alert('Fail to register device. try again');
            return null;
          }
        }else{
          _send_data.device_id = item.mac_address;
          
          _url = [this.$apiUrl,'/device'].join("");
          rtn = await this.$http.post(_url,_send_data);
          if(rtn.status!=200 || rtn.data.status == false){
            alert('Fail to register device. try again');
            return null;
          }
        }
        
        history.back('/Scanner');
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