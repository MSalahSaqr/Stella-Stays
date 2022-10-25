import axios from "axios";
import crypto from 'crypto';

//this is a dummy function with the supposed behavior as comments
export function generateAccessCode(deviceId) {
  const host = process.env.TUYA_HOST;
  const path = process.env.TUYA_ACCESS_CODE_GENERATION_PATH.replace("{device_id}", deviceId);
  const clientId = process.env.TUYA_ACCESS_ID;
  const secret = process.env.TUYA_ACCESS_SECRET;
  const accessToken = getActiveAccessToken();
  const fullUrl = host + path;
  //call tuya api: to get new password
  //call getDeviceData(deviceId) to get local_key
  //use local key to encrypt password
  //return encrypted password
  //in case of failure throw error
  return {
    accessCode: "someEncryptedPassword",
    accessCodeId: "dummyId"
  }
}

//this is a dummy function with the supposed behavior as comments
export function deleteAccessCode(accessCodeId) {
  //call Tuya Api to delete AccessCode
  //in case of failure throw error
  return
}

//this is a dummy function with the supposed behavior as comments
function getActiveAccessToken() {
  //if(still valid)
  //return dbAccessToken
  //else
  //refreshAccessToken(refreshToken)
  //update DB
  // return new token
  return "dd74bcaa99fb2d1d9ea57d847b213e91"
}

async function getDeviceData(deviceId) {
  const host = process.env.TUYA_HOST;
  const path = process.env.TUYA_LOCAL_KEY_PATH.replace("{device_id}", deviceId);
  const clientId = process.env.TUYA_ACCESS_ID;
  const secret = process.env.TUYA_ACCESS_SECRET;
  const accessToken = getActiveAccessToken();
  const fullUrl = host + path;
  const method = "GET";
  const bodyString = "";
  const signatureHeadersString = "";
  const nonce = "";
  const timestamp = new Date().getTime();

  const stringToSignInput = {
    method: method,
    signatureHeadersString: signatureHeadersString,
    bodyString: bodyString,
    url: path
  }
  const businessSignInput = {
    clientId: clientId,
    accessToken: accessToken,
    timestamp: timestamp,
    nonce: nonce,
    secret: secret,
    stringToSignInput: stringToSignInput
  }
  const sign = generateBusinessSign(businessSignInput);

  const headers = {
    client_id: clientId,
    access_token: accessToken,
    sign: sign,
    t: timestamp,
    sign_method: "HMAC-SHA256"
  }
  const resp = await axios.get(fullUrl, {
    headers: headers
  })
  return resp.data
}

async function refreshAccessToken(refreshToken) {
  const host = process.env.TUYA_HOST;
  const path = process.env.TUYA_ACCESS_TOKEN_PATH.replace("{refresh_token}", refreshToken)
  const clientId = process.env.TUYA_ACCESS_ID
  const secret = process.env.TUYA_ACCESS_SECRET
  const fullUrl = host + path;
  const method = "GET";
  const bodyString = "";
  const signatureHeadersString = "";
  const nonce = "";
  const timestamp = new Date().getTime();

  const stringToSignInput = {
    method: method,
    signatureHeadersString: signatureHeadersString,
    bodyString: bodyString,
    url: path
  }
  const tokenSignInput = {
    clientId: clientId,
    timestamp: timestamp,
    nonce: nonce,
    secret: secret,
    stringToSignInput: stringToSignInput
  }
  const sign = generateTokenSign(tokenSignInput);

  const headers = {
    client_id: clientId,
    sign: sign,
    t: timestamp,
    sign_method: "HMAC-SHA256"
  }
  const resp = await axios.get(fullUrl, {
    headers: headers
  })
  return resp.data
}

async function getAccessToken() {
  const host = process.env.TUYA_HOST;
  const path = process.env.TUYA_ACCESS_TOKEN_PATH;
  const clientId = process.env.TUYA_ACCESS_ID
  const secret = process.env.TUYA_ACCESS_SECRET
  const fullUrl = host + path;
  const method = "GET";
  const bodyString = "";
  const signatureHeadersString = "";
  const nonce = "";
  const timestamp = new Date().getTime();

  const stringToSignInput = {
    method: method,
    signatureHeadersString: signatureHeadersString,
    bodyString: bodyString,
    url: path
  }
  const tokenSignInput = {
    clientId: clientId,
    timestamp: timestamp,
    nonce: nonce,
    secret: secret,
    stringToSignInput: stringToSignInput
  }
  const sign = generateTokenSign(tokenSignInput);

  const headers = {
    client_id: clientId,
    sign: sign,
    t: timestamp,
    sign_method: "HMAC-SHA256"
  }
  const resp = await axios.get(fullUrl, {
    headers: headers
  })
  console.log(resp.request)
  return resp.data
}

function generateTokenSign(tokenSignInput) {
  const stringToSign = createStringToSign(tokenSignInput.stringToSignInput);
  const fullStringToSign = tokenSignInput.clientId + tokenSignInput.timestamp + tokenSignInput.nonce + stringToSign;
  const sign = crypto.createHmac("sha256", tokenSignInput.secret).update(fullStringToSign).digest("hex").toUpperCase();
  return sign;
}

function generateBusinessSign(businessSignInput) {
  const stringToSign = createStringToSign(businessSignInput.stringToSignInput);
  const fullStringToSign = businessSignInput.clientId + businessSignInput.accessToken + businessSignInput.timestamp + businessSignInput.nonce + stringToSign;
  const sign = crypto.createHmac("sha256", businessSignInput.secret).update(fullStringToSign).digest("hex").toUpperCase();
  return sign;
}

function createStringToSign(stringToSignInput) {
  const sha256 = crypto.createHash('sha256').update(stringToSignInput.bodyString).digest("hex");
  const stringToSign = stringToSignInput.method.toUpperCase() + "\n" + sha256 + "\n" + stringToSignInput.signatureHeadersString + "\n" + stringToSignInput.url;
  return stringToSign;
}















// (function (httpMethod, query, headers) {
//   var timestamp = getTime();
//   pm.environment.set("timestamp", timestamp);////////////////////////////////////timestamp

//   const clientId = pm.environment.get("client_id");
//   const secret = pm.environment.get("secret");

//   if (pm.environment.has("easy_access_token")) {
//     accessToken = pm.environment.get("easy_access_token")
//   }

//   // sha256
//   var signMap = stringToSign(query, mode, httpMethod, secret)
//   var urlStr = signMap["url"]
//   var signStr = signMap["signUrl"]
//   pm.request.url = pm.request.url.host + urlStr
//   var nonce = ""
//   if (headers.has("nonce")) {
//     var jsonHeaders = JSON.parse(JSON.stringify(headers))
//     jsonHeaders.forEach(function (item) {
//       if (item.key == "nonce" && !item.disabled) {
//         nonce = headers.get("nonce")
//       }
//     })
//   }
//   var sign = calcSign(clientId, timestamp, nonce, signStr, secret);
//   pm.environment.set('easy_sign', sign);
// })();

// function getTime() {
//   var timestamp = new Date().getTime();
//   return timestamp;
// }

// // Token verification calculation
// function calcSign(clientId, timestamp, nonce, signStr, secret) {
//   var str = clientId + timestamp + nonce + signStr;
//   var hash = CryptoJS.HmacSHA256(str, secret);
//   var hashInBase64 = hash.toString();
//   var signUp = hashInBase64.toUpperCase();
//   return signUp;
// }

// // Business verification calculation
// // function calcSign(clientId,accessToken,timestamp,nonce,signStr,secret){
// //     var str = clientId + accessToken +timestamp + nonce + signStr;
// //     var hash = CryptoJS.HmacSHA256(str, secret);
// //     var hashInBase64 = hash.toString();
// //     var signUp = hashInBase64.toUpperCase();
// //     return signUp;
// // }

// // Generate signature string
// function stringToSign(query, method, headers, body) {
//   var sha256 = "";
//   var url = "";
//   var headersStr = ""
//   var map = {}
//   var arr = []
//   var bodyStr = ""
//   if (query) {
//     var jsonBodyStr = JSON.stringify(query)
//     var jsonBody = JSON.parse(jsonBodyStr)

//     jsonBody.forEach(function (item) {
//       arr.push(item.key)
//       map[item.key] = item.value
//     })
//   }
//   bodyStr = body.toString()
//   sha256 = CryptoJS.SHA256(bodyStr)
//   arr = arr.sort()
//   arr.forEach(function (item) {
//     url += item + "=" + map[item] + "&"
//   })
//   if (url.length > 0) {
//     url = url.substring(0, url.length - 1)
//     url = "/" + pm.request.url.path.join("/") + "?" + url
//   } else {
//     url = "/" + pm.request.url.path.join("/")
//   }

//   if (headers.has("Signature-Headers") && headers.get("Signature-Headers")) {
//     var signHeaderStr = headers.get("Signature-Headers")
//     const signHeaderKeys = signHeaderStr.split(":")
//     signHeaderKeys.forEach(function (item) {
//       var val = ""
//       if (pm.request.headers.get(item)) {
//         val = pm.request.headers.get(item)
//       }
//       headersStr += item + ":" + val + "\n"
//     })
//   }
//   var map = {}

//   url = replacePostmanParams(url)

//   map["signUrl"] = method + "\n" + sha256 + "\n" + headersStr + "\n" + url
//   map["url"] = url
//   return map
// }

// function replacePostmanParams(str) {
//   while (str.indexOf("{{") != -1 && str.indexOf("}}") != -1) {
//     const key = str.substring(str.indexOf("{{") + 2, str.indexOf("}}"))
//     var value = pm.environment.get(key)
//     if (!value) value = ""
//     str = str.replace("{{" + key + "}}", value)
//   }
//   return str
// }
