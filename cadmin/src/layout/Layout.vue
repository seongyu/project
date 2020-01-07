<template>
  <div>
    <div class="fullscreen" v-show="!isSigned">
      <div class="inputbox">
        <div v-show="!isSignUp">
          <b-form-input type="text" placeholder="INPUT HASH KEY" v-model="user.hash" />
          <button class="btn btn-block btn-dark" v-on:click="onSignIn(user.hash)">SIGN IN</button>
          <button class="btn btn-block btn-dark" v-on:click="isSignUp=true">SIGN UP</button>
        </div>
        <div v-show="isSignUp">
          <b-form-input type="text" placeholder="INPUT USERNAME" v-model="user.name" />
          <br />
          <b-form-input type="text" placeholder="INPUT EMAIL" v-model="user.email" />
          <button class="btn btn-block btn-dark" v-on:click="onSignUp">SUBMIT</button>
          <div v-show="newhash==null? false:true">
            RECEIVED HASH
            <b-form-input style="margin-top:11px;" type="text" readonly v-model="newhash" />
            <button class="btn btn-block btn-dark" v-on:click="isSignUp=false">RETURN</button>
          </div>
        </div>
      </div>
    </div>
    <b-navbar id="header" toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand>
        Sparkling
        <span>RTLS</span>
      </b-navbar-brand>
      <b-navbar-nav class="c-header-menu-btn">
        <b-nav-item id="menu-btn" v-on:click="onClickMenu">
          <i class="glyphicon glyphicon-th-list"></i>
        </b-nav-item>
        <span>{{username+'님, 환영합니다.'}}</span>
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
import $ from "jquery";
import LeftMenu from "./LeftMenu.vue";

var sizec = function() {
  var wsize = window.innerWidth;
  var mbtn = $("#menu-btn");
  var lmenu = $("#layout-menu");
  var mheight =
    $("#checkout").height() > $(window).height()
      ? $(document).height()
      : $(window).height();
  if (wsize > 575) {
    mbtn.hide();
    lmenu.show();
    lmenu.height(mheight - $("#header").outerHeight());
  } else {
    lmenu.hide();
    mbtn.show();
  }
};

export default {
  name: "Layout",
  data: function() {
    return {
      isSigned: false,
      isSignUp: false,
      isMenu: false,
      newhash: null,
      username : null,
      user: {
        name: null,
        email: null,
        hash: null
      }
    };
  },
  components: {
    LeftMenu
  },
  mounted: function() {
    window.onload = sizec;
    window.onresize = sizec;
    var _session_hash = sessionStorage.getItem("hash");
    if (_session_hash && _session_hash.length == 64) {
      this.isSigned = true;
      this.username = sessionStorage.getItem('name');
    }
  },
  updated() {
    sizec();
  },
  methods: {
    onClickMenu: function() {
      this.isMenu = this.isMenu ? false : true;
      var lmenu = document.getElementById("layout-menu");
      if (this.isMenu) {
        lmenu.style.display = "block";
      } else {
        lmenu.style.display = "none";
      }
    },
    _hashSave: function(hash,name) {
      var hash_prv, hash_new;
      try {
        hash_prv = localStorage.getItem("hash");
        if (hash_prv && hash_prv.length > 0) {
          hash_prv = JSON.parse(hash_prv);
          if (hash_prv.find(_=>{return _.hash==hash})) {
            return null;
          }
          hash_new = hash_prv.push({name:name,hash:hash});
          localStorage.setItem("hash", JSON.stringify(hash_new));
        } else {
          hash_new = [{name:name,hash:hash}];
          localStorage.setItem("hash", JSON.stringify(hash_new));
        }
      } catch (e) {
          console.log(e)
        localStorage.removeItem("hash");
        this._hashSave(hash,name);
      }
    },
    onSignUp: async function() {
      var _rtn,
        _url = [this.$apiUrl, "/hash"].join("");
      if (!this.user.email || !this.user.name) {
        return alert("Must input user email and name.\nTry again...");
      }
      _rtn = await this.$http.post(_url, {
        email: this.user.email,
        name: this.user.name
      });
      if (_rtn.data && _rtn.data.length == 64) {
        this.newhash = _rtn.data;
        this._hashSave(this.newhash,this.user.name);
      }
    },
    onSignIn: function(hash) {
      var _full_hash, _idx;
      try {
        _full_hash = localStorage.getItem("hash");
        _full_hash = JSON.parse(_full_hash);
        _idx = _full_hash.find(_=>{return _.hash==hash});
        if (_idx) {
          sessionStorage.setItem("hash", _idx.hash);
          sessionStorage.setItem("name", _idx.name);
          this.isSigned = true;
        } else {
          alert("You need to earn hash for use this admin.\nRegister it now.");
        }
      } catch (e) {
        alert("You need to earn hash for use this admin.\nRegister it now.");
      }
    }
  }
};
</script>
<style scoped>
span {
  color: orange;
}
.c-header-menu-btn {
  position: absolute;
  right: 0.5rem;
}
#menu-btn {
  font-size: 1.25em;
}
#layout-menu {
  background-color: #343a40;
}
.container-fluid {
  background-color: #d3d3d3;
}
.fullscreen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #212529;
  color: white;
  z-index: 9999;
  text-align: center;
}
.fullscreen .inputbox {
  margin: 10%;
}

.fullscreen .inputbox button {
  margin-top: 11px;
  margin-bottom: 22px;
}
</style>