/**
 * Created by ying.wu on 2017/7/10.
 */
const version = require("./ecpay_invoice/version.js");
const invoice_client = require("./ecpay_invoice/invoice_client.js");
const query_client = require("./ecpay_invoice/query_client.js");
const notify_client = require("./ecpay_invoice/notify_client.js");
const helper = require("./ecpay_invoice/helper.js");

class ECPayInvoice {
    constructor() {
        this.helper = new helper(config);

        this.version = new version();
        this.invoice_client = new invoice_client(this.helper);
        this.query_client = new query_client(this.helper);
        this.notify_client = new notify_client(this.helper);
    }
}
module.exports = ECPayInvoice;
