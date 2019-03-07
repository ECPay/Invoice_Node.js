/**
 * Created by ying.wu on 2017/6/27.
 */
 // 手機條碼驗證
const ecpay_invoice = require('../lib/ecpay_invoice.js');
// 參數值為[PLEASE MODIFY]者，請在每次測試時給予獨特值
let base_param = {
	BarCode:"/......." // 手機條碼，長度為7字元
};

let create = new ecpay_invoice();
let res = create.query_client.ecpay_query_check_mob_barcode(parameters = base_param);
res.then(function (result) {
    console.log(result);
}).catch(function (err) {
    console.log(err);
});