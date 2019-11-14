module.exports = {
  GenerateUniqueID: (length, chars) => {
    let mask = '';
    let result = '';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9981212345';
    if (chars.indexOf('#') > -1) mask += '0123456789ASCDFGVBGASDWERTYUIOKJMNHG';
    if (chars.indexOf('a') > -1) mask += 'ABCDEZS0123456789FGTRESDF1234FGTSSDD';
    if (chars.indexOf('b') > -1) mask += '012345REWQ6789POIUYTASDFGHJKILOPHDWE';
    if (chars.indexOf('x') > -1) mask += 'asdfavsgqquioqkjakjsajkajsakjlajlsal';
    for (let i = length; i > 0; --i) {
      result += mask[Math.round(Math.random() * (mask.length - 1))];
    }
    return result;
  }
}