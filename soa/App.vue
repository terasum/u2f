<template>
  <div id="app" >
    <el-container>
      <el-header>
        <div>
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="1"><router-link to="/">Home</router-link></el-menu-item>
            <el-menu-item index="2"><router-link to="/contract">Operation</router-link></el-menu-item>
            <el-submenu index="3">
              <template slot="title">Policies</template>
              <el-menu-item index="3-1">polices(1)</el-menu-item>
              <el-menu-item index="3-2">polices(2)</el-menu-item>
              <el-menu-item index="3-3">polices(3)</el-menu-item>
            </el-submenu>
            <el-menu-item index="4"><router-link to="/policiesIntro">Policies</router-link></el-menu-item>
          </el-menu>
      </div>
      </el-header>

      <el-main>
              <router-view></router-view>
      </el-main>
    </el-container>
    

</div>
</template>


<style>
.main-container{
 margin-top: 20px;
}
</style>


<script>
import { mapState } from 'vuex';
export default {
    data() {
      return {
        activeIndex: '2-4-3',
      };
    },
     computed: mapState(['title']),
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style>
a {
  text-decoration: none;
}
</style>