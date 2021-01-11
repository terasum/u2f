const ContractModel = require('../../model/ContractModel.js');

let model = new ContractModel("123", "456", '789', '111');
console.log(model.toJson());
console.log(ContractModel.reconstructor(model.toJson()))