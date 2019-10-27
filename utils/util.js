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
function gethowlong(firsttime, secondtime) {
  console.log("执行gethowlong(argv1,argv2)函数");
  firsttime = firsttime.toString().replace(' ', '/').replace(':', '/').split('/');
  secondtime = secondtime.toString().replace(' ', '/').replace(':', '/').split('/');
  var howlong = "";
  var diff = "";

  if (firsttime[0] != secondtime[0]) {
    diff = parseInt(firsttime[0]) - parseInt(secondtime[0]);
    howlong = diff + "年前";
    return howlong;
  } else if (firsttime[1] != secondtime[1]) {
    diff = parseInt(firsttime[1]) - parseInt(secondtime[1]);
    howlong = diff + "月前";
    return howlong;
  } else if (firsttime[2] != secondtime[2]) {
    diff = parseInt(firsttime[2]) - parseInt(secondtime[2]);
    howlong = diff + "天前";
    switch (diff) {
      case 1: {
        howlong = '昨天';
        break;
      }
      case 2: {
        howlong = '前天';
        break;
      }
    }
    return howlong;
  } else if (firsttime[3] != secondtime[3]) {
    diff = parseInt(firsttime[3]) - parseInt(secondtime[3]);
    howlong = diff + "小时前";
    return howlong;
  } else if (firsttime[4] != secondtime[4]) {
    diff = parseInt(firsttime[4]) - parseInt(secondtime[4]);
    howlong = diff + "分钟前";
    if (diff < 3) {
      howlong = '刚刚'
    }
    return howlong;
  } else {
    howlong = '刚刚';
    return howlong;
  }


  console.log(firsttime);
  console.log(secondtime)
}

module.exports = {
  formatTime: formatTime,
  splitTime: splitTime,
  processData: processData,
  processSigleTuibu: processSigleTuibu,
  gethowlong: gethowlong
}
