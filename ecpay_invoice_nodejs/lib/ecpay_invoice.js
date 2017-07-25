/**
 * Created by ying.wu on 2017/7/10.
 */
const version = require('./ecpay_invoice/version.js');
const invoice_client = require('./ecpay_invoice/invoice_client.js');
const query_client = require('./ecpay_invoice/query_client.js');
const notify_client = require('./ecpay_invoice/notify_client.js');

class ECPayInvoice{
    constructor(){
        this.version = new version();
        this.invoice_client = new invoice_client();
        this.query_client = new query_client();
        this.notify_client = new notify_client();
    }
}
module.exports = ECPayInvoice;