<template>
  <div>
    <h2>BankAccounts Contract</h2>
    <el-divider></el-divider>

    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Contract Information</span>
            <el-button
              style="float: right; padding: 5px 5px; margin-left: 10px"
              type="info"
              @click="deploy"
              >Deploy</el-button
            >
            <el-button
              style="float: right; padding: 5px 5px"
              type="info"
              @click="getIdentity"
              >GetIdentity</el-button
            >
          </div>
          <div class="card-body" style="min-height: 300px">
            <pre class="m-0"> {{ contract }}</pre>
            <pre class="m-0">AppID-parsed: {{ identity.appID }}</pre>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>Accounts Information</span>
            <el-button
              style="float: right; padding: 5px 5px; margin-left: 10px"
              type="info"
              @click="getAccounts"
              >RefreshAccounts</el-button
            >
          </div>
          <div class="card-body" style="min-height: 300px">
            <pre class="m-0">{{ accounts }}</pre>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 20px">

      <el-col :span="12" >
        <el-card class="box-card" style="height:500px;">
          <div slot="header" class="clearfix" style="height:40px;">
            <span>Register</span>

            <el-select v-model="tx_from" placeholder="FROM">
              <el-option
                v-for="item in from_accounts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <el-button
              style="float: right; padding: 8px 15px"
              type="primary"
              @click="register"
              >register</el-button
            >
          </div>
          <div class="card-body" style="min-height: 350px">
            <pre class="m-0">{{ registerInfo }}</pre>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="box-card" style="height:500px;">
          <div slot="header" class="clearfix" style="height:40px;">
            <span>Transfer Result</span>
            <el-button
              type="primary"
              style="float: right; padding: 8px 15px; margin-left: 10px"
              @click="transfer"
              >transfer</el-button
            >
          </div>
          <div class="card-body" style="min-height: 350px;">
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
            <el-input-number
              v-model="tx_amount"
              @change="handleChange"
              :min="1"
              :max="500"
              label="amount"
            ></el-input-number>
            <pre class="m-0">{{ transferResult }}</pre>
          </div>
        </el-card>
      </el-col>
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
      transferResult: "",
    };
  },
  methods: {
    deploy(event) {
      if (!!event) {
        event.preventDefault();
      }

      axios.get("/v1/u2f/deployed").then((resp) => {
        console.log("deployed", resp);
        this.contract = resp.data;
      });
    },
    getIdentity(event) {
      if (!!event) {
        event.preventDefault();
        console.log(event);
      }
      axios.get("/v1/u2f/getIdentity").then((resp) => {
        this.identity = resp.data;
      });
    },
    register(event) {
      if (!!event) {
        event.preventDefault();
        console.log(event);
      }
      if (!this.tx_from || this.tx_from === "") {
        this.noticeError("tx_from is undefined");
      }
      axios.get(`/v1/u2f/register?tx_from=${this.tx_from}`).then((resp) => {
        console.log("register", this.tx_from, resp);
        this.registerInfo = resp.data;
      });
    },
    getAccounts(event) {
      if (!!event) {
        event.preventDefault();
        console.log(event);
      }
      axios.get("/v1/u2f/accounts").then((resp) => {
        console.log("account", resp);
        this.accounts = resp.data;
      });
    },
    transfer(event) {
      if (!!event) {
        event.preventDefault();
        console.log(event);
      }
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

      axios
        .get(
          `/v1/u2f/transfer?tx_from=${this.tx_from}&tx_to=${this.tx_to}&amount=${this.amount}`
        )
        .then((resp) => {
          console.log("transfer", resp);
          this.transferResult = resp.data;
          this.noticeSuccess("transfer success");
        })
        .catch((err) => {
          this.noticeError(`transfer error ${err}`);
        });
    },

    onReset(event) {
      if (!!event) {
        event.preventDefault();
      }
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
    this.deploy();
    this.getAccounts();
    this.getIdentity();
  },
};
</script>