const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function splitTime(date){
  return (date.split(':')[0] + ':' + date.split(':')[1]).replace(/-/g,'/');
}
function processData(data) {
  console.log(data);
  var tempdata = [];
  for (var i = 0; i < data.length; i++) {
    var age = data[i].age;
    var tuibuMsg = [];
    for (var j = 0; j < data[i].tuibuMsg.length; j++) {
      var temp = data[i].tuibuMsg[j];
      var text = temp.tuibuMsg;
      if (temp.tuibuMsg.length > 15) {
        text = temp.tuibuMsg.substring(0, 15) + '...'
      }
      tuibuMsg.push({
        bid: temp.bid,
        lifeID: temp.lifeID,
        avatarUrl: temp.avatarUrl,
        text: text
      })
    }
    tempdata.push({
      age: age,
      tuibuMsg: tuibuMsg,
      boxHeight: "0rpx"
    })
  }
  console.log('ok')
  console.log(tempdata);
  return tempdata;
}
function processSigleTuibu(data) {
  console.log(data);
  var tuibuMsg = [];
  for (var i = 0; i < data.length; i++) {
    var temp_data = data[i];
    console.log(temp_data);
    var text = temp_data.tuibuMsg;
    if (temp_data.tuibuMsg.length > 64) {
      text = temp_data.tuibuMsg.substring(0, 64) + '...'
    }
    tuibuMsg.push({
      bid: temp_data.bid,
      lifeID: temp_data.lifeID,
      avatarUrl: temp_data.avatarUrl,
      tuibuMsg: text
    })
  }
  console.log('ok')
  return tuibuMsg;
}
module.exports = {
  formatTime: formatTime,
  splitTime: splitTime,
  processData: processData,
  processSigleTuibu: processSigleTuibu
}
