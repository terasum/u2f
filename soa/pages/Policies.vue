<template>
  <div>
    <h2>Policies Introduction</h2>
     <el-table :data="items" style="width: 100%">
      <el-table-column prop="no" label="No." width="60"></el-table-column>
      <el-table-column prop="discription" label="discription" width="420"> </el-table-column>
      <el-table-column prop="note" label="note"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        items: [
          { no: 1, 
          discription: '(1) Flag every transaction to any new beneﬁciary.', 
          note:"The paper has mentioned this policy. It will challenge every new beneficiary. If the coin receiver is unknown, the smart contract will challenge this transaction to the new receiver."},
          { no: 2, 
          discription: '(2) Flag a transaction if the sum of all coins transferred (since the last ﬂag) is above a predeﬁned threshold.', 
          note:"The paper has mentioned this policy. If the sender's sum of transactions' amount since last a flag exceeds a predefined threshold, then the smart contract will challenge this transaction, and the smart contract will update the state flag."},
          { no: 3, 
          discription: "(3) Flag a transaction if the sum of all transferred funds in a speciﬁc timeframe (a sliding window) exceeds a predeﬁned threshold.",
          note:"The paper has mentioned this policy. For example, we can define the timeframe as 10 minutes. Suppose sum up the sender's transaction, which triggered during this timeframe, and the sum of those transactions' amount has exceeded a predefined threshold. In that case, the smart contract will challenge the latest transaction."},
          { no: 4, discription: "(4) Flag a transaction if the sum of all coins sent to a speciﬁc beneﬁciary (since the last ﬂag) exceeds a predeﬁned threshold.", 
          note:"The paper has mentioned this policy. Take Alice and Bob as an example. If Alice's total sum of the transactions to bob exceeds a predefined threshold, the smart contract will challenge the latest transaction to Bob, and then update the flag and reset the counter."},
          { no: 5, discription: "(5) Flag a transaction if the transactions' count sent to a specific beneﬁciary (since the last ﬂag) is exceeds a predeﬁned threshold.", 
          note:"This policy is new. Take Alice and Bob as an example. If the count of transactions that Alice has transferred to bob exceeds a predefined threshold, the smart contract will challenge this transaction and then update the flag and reset the counter."},
          { no: 6, discription: "(6) Flag a transaction if the fundholder initiated transactions' count in a specific timeframe (a sliding window) is exceeds a predeﬁned threshold.", 
          note:"This policy is new, and it like policy (3). If the number of transactions that the sender has made exceeds a predefined threshold in a specific timeframe, the smart contract will challenge this new transaction. For instance, Alice cannot make more than ten transactions in 10 minutes; otherwise,  the smart contract will contest the latest transaction."},
          { no: 7, discription: "(7) Flag a transaction if the initiated time-span since the last transaction exceeds a predeﬁned threshold.",
          note:"This policy is new. It will challenge the transaction which period over a specific time threshold since the last transaction timestamp. For example, if the predefined time-span is 30 minutes, and Alice has made the final transaction before 30 minutes ago, the smart contract will challenge the latest transaction. This policy protects the long-time inactivity account. "},
        ]
      }
    }
  }
</script>