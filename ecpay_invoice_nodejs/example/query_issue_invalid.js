/**
 * Created by ying.wu on 2017/6/27.
 */
 // 查詢作廢發票明細
const ecpay_invoice = require('../lib/ecpay_invoice.js');
// 參數值為[PLEASE MODIFY]者，請在每次測試時給予獨特值
let base_param = {
	RelateNumber:"PLEASE MODIFY" // 輸入合作特店自訂的編號，長度為30字元
};

let create = new ecpay_invoice();
let res = create.query_client.ecpay_query_invoice_issue_invalid(parameters = base_param);
res.then(function (result) {
    console.log(result);
}).catch(function (err) {
    console.log(err);
});