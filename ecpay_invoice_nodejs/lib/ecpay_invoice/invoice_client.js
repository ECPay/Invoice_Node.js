/**
 * Created by ying.wu on 2017/6/21.
 */
const verify = require("./verification.js");
const ECpayError = require("./error.js");
const iconv = require("iconv-lite");
const crypto = require("crypto");
const url = require("url");
const querystring = require("querystring");
const http = require("http");
const https = require("https");

class ECpayInvoiceClient {
    constructor(helper) {
        this.helper = helper;
    }

    ecpay_invoice_issue(parameters) {
        this._invoice_base_proc(parameters);
        parameters["TimeStamp"] = (parseInt(this._get_curr_unix_time()) + 120).toString();
        parameters["CarruerNum"] = parameters["CarruerNum"].replace(/\+/g, " ");
        let res = this._invoice_pos_proc(parameters, "InvoiceIssue");
        return res;
    }

    ecpay_invoice_delay(parameters) {
        this._invoice_base_proc(parameters);
        parameters["TimeStamp"] = (parseInt(this._get_curr_unix_time()) + 120).toString();
        parameters["CarruerNum"] = parameters["CarruerNum"].replace(/\+/g, " ");
        parameters["PayType"] = "2";
        parameters["PayAct"] = "ECPAY";
        let res = this._invoice_pos_proc(parameters, "InvoiceDelayIssue");
        return res;
    }

    ecpay_invoice_trigger(parameters) {
        this._invoice_base_proc(parameters);
        parameters["TimeStamp"] = (parseInt(this._get_curr_unix_time()) + 120).toString();
        parameters["PayType"] = "2";
        let res = this._invoice_pos_proc(parameters, "InvoiceTriggerIssue");
        return res;
    }

    ecpay_invoice_allowance(parameters) {
        this._invoice_base_proc(parameters);
        parameters["TimeStamp"] = (parseInt(this._get_curr_unix_time()) + 120).toString();
        let res = this._invoice_pos_proc(parameters, "InvoiceAllowance");
        return res;
    }
    ecpay_invoice_allowancebycollegiate(parameters) {
        this._invoice_base_proc(parameters);
        parameters["TimeStamp"] = (parseInt(this._get_curr_unix_time()) + 120).toString();
        let res = this._invoice_pos_proc(parameters, "InvoiceAllowanceByCollegiate");
        return res;
    }

    ecpay_invoice_issue_invalid(parameters) {
        this._invoice_base_proc(parameters);
        parameters["TimeStamp"] = (parseInt(this._get_curr_unix_time()) + 120).toString();
        let res = this._invoice_pos_proc(parameters, "InvoiceIssueInvalid");
        return res;
    }

    ecpay_invoice_allowance_invalid(parameters) {
        this._invoice_base_proc(parameters);
        parameters["TimeStamp"] = (parseInt(this._get_curr_unix_time()) + 120).toString();
        let res = this._invoice_pos_proc(parameters, "InvoiceAllowanceInvalid");
        return res;
    }

    _get_curr_unix_time() {
        return this.helper.get_curr_unixtime();
    }

    _invoice_base_proc(params, inv, unsupport_param, pay_method) {
        if (params.constructor === Object) {
            params["MerchantID"] = this.helper.get_mercid();
        } else {
            throw new ECpayError.ECpayInvalidParam(`Received parameter object must be a Object.`);
        }
    }

    _invoice_pos_proc(params, apiname) {
        let verify_invoice_api = new verify.InvoiceParamVerify(apiname);
        let exclusive_list = [];
        if (apiname === "InvoiceIssue") {
            exclusive_list = ["InvoiceRemark", "ItemName", "ItemRemark", "ItemWord"];
            verify_invoice_api.verify_inv_issue_param(params);
        } else if (apiname === "InvoiceDelayIssue") {
            exclusive_list = ["InvoiceRemark", "ItemName", "ItemWord"];
            verify_invoice_api.verify_inv_delay_param(params);
        } else if (apiname === "InvoiceTriggerIssue") {
            exclusive_list = [];
            verify_invoice_api.verify_inv_trigger_param(params);
        } else if (apiname === "InvoiceAllowance") {
            exclusive_list = ["ItemName", "ItemWord"];
            verify_invoice_api.verify_inv_allowance_param(params);
        } else if (apiname === "InvoiceAllowanceByCollegiate") {
            exclusive_list = ["ItemName", "ItemWord"];
            verify_invoice_api.verify_inv_allowance_param(params);
        } else if (apiname === "InvoiceIssueInvalid") {
            exclusive_list = ["Reason"];
            verify_invoice_api.verify_inv_issue_invalid_param(params);
        } else if (apiname === "InvoiceAllowanceInvalid") {
            exclusive_list = ["Reason"];
            verify_invoice_api.verify_inv_allowance_invalid_param(params);
        }
        // for exclusive_list
        let exclusive_ele = {};
        exclusive_list.forEach(function (param) {
            exclusive_ele[param] = params[param];
            delete params[param];
        });

        // encode special param
        let sp_param = verify_invoice_api.get_special_encode_param(apiname);
        this.helper.encode_special_param(params, sp_param);

        // Insert chkmacval
        // console.log(params);
        let chkmac = this.helper.gen_chk_mac_value(params, 0);
        params["CheckMacValue"] = chkmac;

        exclusive_list.forEach(function (param) {
            params[param] = exclusive_ele[param];
        });

        sp_param.forEach(function (key) {
            params[key] = decodeURIComponent(params[key]);
        });

        console.log(params);

        // gen post html
        let api_url = verify_invoice_api.get_svc_url(apiname, this.helper.get_op_mode());
        // post from server
        let resp = this.helper.http_request("POST", api_url, params);
        // return post response
        return new Promise((resolve, reject) => {
            resp.then(function (result) {
                return resolve(iconv.decode(Buffer.concat(result), "utf-8"));
            }).catch(function (err) {
                reject(err);
            });
        });
    }
}
module.exports = ECpayInvoiceClient;
