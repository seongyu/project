// var HOST = 'ec2-13-209-72-13.ap-northeast-2.compute.amazonaws.com';
var HOST = 'http://localhost';
var PORT = 4001;

// 여기에 설정할 파라메터 리스트
// 1. 설치장소 : siteName
// 2. 업체명 : companyName
// 이거 반드시 기입해주세요.
var GLOBAL_PARAM = {
  companyName : 'LeonTest',
  siteName : 'LeonTest',
  deviceName: 'test'
}

// 다른브라우저에서 오류나는 경우가 있어서 추가함
// evo.js에도 넣어주세요
function GetXmlHttpObject()
{ 
    var objXMLHttp=null;
    if (window.XMLHttpRequest)
    {
        objXMLHttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        objXMLHttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    return objXMLHttp;
}

// Global function. 삭제하지 마세영.
var request = function(uri,param){
  
  var url = [HOST,':',PORT,'/'].join("");

  var http= GetXmlHttpObject();

  if(http==null){
    alert("XmlHttp not initialized!");
    return 0
  }

  http.onreadystatechange= function () {
    if(http.readyState==4){
      if(http.status==200){
        console.log('success');
      }
    }
  }

  http.open("POST",url+uri,true);
  http.setRequestHeader('Content-type', 'application/json');
  http.send(JSON.stringify(param));
}

function saveData(e,c){
  // value 값이 없으면 저장 안함
  if(c === null 
    || c === isNaN 
    || c === undefined 
    || c === 'NaN'){
    console.log('no value');
    return;
  }

  //name 가져오기
  var arr = [];
  var table = document.getElementsByTagName('table')[0];
  var rows = table.rows;

  for(var i in rows){
    var row  = rows[i];
    if(typeof row ==='object' && row.getElementsByTagName('td')[0]){
      var item = {
        varAddr : row.getElementsByTagName('td')[0].innerHTML,
        varLabel : row.getElementsByTagName('td')[1].innerHTML,
        varStatus : row.getElementsByTagName('td')[2].innerHTML,
        deviceName : GLOBAL_PARAM.deviceName,
        companyName : GLOBAL_PARAM.companyName,
        siteName : GLOBAL_PARAM.siteName
      };
      arr.push(item);
    }
    
  }
  // console.log(arr);
  request('data',arr)
}

// saveData(1,1);