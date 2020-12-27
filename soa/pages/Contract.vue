<template>
  <div>
    <h2>BankAccounts Contract</h2>
    <el-divider></el-divider>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Deploy</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="deploy"
          >Deploy</el-button
        >
      </div>
      <pre class="m-0">{{ contract }}</pre>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Identity</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="getIdentity"
          >getIdentity</el-button
        >
      </div>
      <pre class="m-0">{{ identity }}</pre>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Register</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="register"
          >register</el-button
        >
      </div>
      <pre class="m-0">{{ registerInfo }}</pre>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>ListAccounts</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="getAccounts"
          >accounts</el-button
        >
      </div>
      <pre class="m-0">{{ accounts }}</pre>
    </el-card>

    <el-row>
      <el-select v-model="tx_from" placeholder="FROM">
        <el-option
          v-for="item in from_accounts"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <el-select
        v-model="tx_to"
        collapse-tags
        style="margin-left: 20px"
        placeholder="TO"
      >
        <el-option
          v-for="item in to_accounts"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input-number v-model="tx_amount" @change="handleChange" :min="1" :max="500" label="amount"></el-input-number>

      <el-button type="primary" plain @click="transfer">transfer</el-button>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  computed: {
    from_accounts: function () {
      if (!this.accounts) {
        return [];
      }
      let from = [];
      this.accounts.forEach((address) => {
        from.push({
          value: address,
          label: address,
        });
      });
      return from;
    },
    to_accounts: function () {
      if (!this.accounts) {
        return [];
      }
      let to = [];
      this.accounts.forEach((address) => {
        to.push({
          value: address,
          label: address,
        });
      });
      return to;
    },
  },
  data() {
    return {
      contract: {},
      identity: {},
      registerInfo: {},
      accounts: [],
      show: true,
      tx_from: undefined,
      tx_to: undefined,
      tx_amount: 0,
    };
  },
  methods: {
    deploy(event) {
      event.preventDefault();
      axios.get("/v1/u2f/deployed").then((resp) => {
        console.log("deployed", resp);
        this.contract = resp.data;
      });
    },
    getIdentity(event) {
      event.preventDefault();
      console.log(event);
      axios.get("/v1/u2f/getIdentity").then((resp) => {
        console.log("getIdentity", resp);
        this.identity = resp.data;
      });
    },
    register(event) {
      event.preventDefault();
      console.log(event);
      axios.get("/v1/u2f/register").then((resp) => {
        console.log("register", resp);
        this.registerInfo = resp.data;
      });
    },
    getAccounts(event) {
      event.preventDefault();
      console.log(event);
      axios.get("/v1/u2f/accounts").then((resp) => {
        console.log("account", resp);
        this.accounts = resp.data;
      });
    },
    transfer(event) {
      event.preventDefault();
      console.log(event);
      console.log(this.tx_from);
      console.log(this.tx_to);
      if (this.tx_from === undefined || this.tx_to === undefined) {
        this.noticeError("transfer account (from/to) is undefined");
        return;
      }
      if (this.tx_from === this.tx_to) {
        this.noticeError("transfer account (from/to) shouldn't equal");
        return;
      }
      this.noticeSuccess("transfer success");
    },

    onReset(event) {
      event.preventDefault();
      // Reset our form values
      // this.form.email = ''
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },

    handleChange(value) {
        console.log(value);
    },

    notice(msg) {
      this.$message(msg);
    },

    noticeSuccess(msg) {
      this.$message({
        message: msg,
        type: "success",
      });
    },
    noticeWarn() {},
    noticeError(msg) {
      this.$message.error(msg);
    },
  },
  mounted() {
    axios.get("/v1/u2f/accounts").then((resp) => {
      console.log("account", resp);
      this.accounts = resp.data;
    });
  },
};
</script>