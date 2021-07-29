const Base64 = require('./Base64.js');
require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');
// 获取policy
const getPolicyBase64 = function (timeout) {
    let dateTime = new Date().getTime();
	let date = new Date(dateTime + (timeout || 1800000));
    let srcT = date.toISOString();
    const policyText = {
        "expiration": srcT, //设置该Policy的失效时间
        "conditions": [
            ["content-length-range", 0, 100 * 1024 * 1024] // 设置上传文件的大小限制,100mb
        ]
    };
    const policyBase64 = Base64.encode(JSON.stringify(policyText));
    return policyBase64;
}
// 获取签名
const getSignature = function (policyBase64, AccessKeySecret) {
    const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, AccessKeySecret, {
        asBytes: true
    });
    const signature = Crypto.util.bytesToBase64(bytes);
    return signature;
}
// 获取阿里云token信息
const getAliyunOssKey = function (options) {
	const policyBase64 = getPolicyBase64(options.timeout);
	const signature = getSignature(policyBase64, options.accessKeySecret);
	return {
		policy: policyBase64,
		accessKeyId: options.accessKeyId,
		accessKeySecret: options.accessKeySecret,
		signature: signature,
		success_action_status: '200'
	}
}

module.exports = getAliyunOssKey;