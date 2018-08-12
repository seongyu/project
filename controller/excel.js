var Excel = require('exceljs');
var moment = require('moment');
var service = {
  path : 'public/files/',
  filename : () => {
    return 'HISTORY_' +moment().format('YYYY-MM-DD_HH:mm') + '.xlsx';
  }
};

service.download = (data,cb) => {
  var workbook = new Excel.Workbook();
  var sheet = workbook.addWorksheet('History Sheet');

  sheet.columns = [
    { header: '시설', key: 'companyName'},
    { header: '장비', key: 'deviceName'},
    { header: '유형', key: 'varLabel'},
    { header: '상태값', key: 'varStatus'},
    { header: '시간', key: 'eventTime'}
  ];
  data.forEach((e)=>{
    var item = {
      companyName : e.companyName,
      deviceName : e.deviceName,
      varLabel : e.varLabel,
      varStatus : e.varStatus,
      eventTime : moment(e.eventTime).format('YYYY-MM-DD HH:mm:ss')
    };
    sheet.addRow(item);
  });

  var filename = [ service.path,service.filename()].join("");
  workbook.xlsx.writeFile(filename)
  .then(function() {
      cb({status:true,data:filename})
  });
};

module.exports = service;

var testDt = [  { logSeq: 83,
    moduleSeq: 32,
    varStatus: '1',
    eventTime: '2018-07-31T22:22:21.000Z',
    deviceName: 'a',
    varAddr: 'vas',
    varLabel: 'test',
    companyName: 'zdfzsdf',
    siteName: 'vawg',
    logTime: '2018-07-31T22:22:21.000Z' },
  { logSeq: 84,
    moduleSeq: 32,
    varStatus: '1',
    eventTime: '2018-07-31T22:22:21.000Z',
    deviceName: 'a',
    varAddr: 'vas',
    varLabel: 'test',
    companyName: 'zdfzsdf',
    siteName: 'vawg',
    logTime: '2018-07-31T22:22:21.000Z' } ]

// service.download(testDt)