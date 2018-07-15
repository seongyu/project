// var HOST = 'ec2-13-209-72-13.ap-northeast-2.compute.amazonaws.com';
var HOST = 'http://localhost';
var PORT = 4001

// 여기에 설정할 파라메터 리스트
// 1. 설치장소 : placeName
// 2. 업체명 : companyName
// 3. 장치ID : deviceID
// 4. 장치명 : deviceName
var GLOBAL_PARAM = {
  placeName : '',
  companyName : '',
  deviceID : '',
  deviceName : ''
}

// 다른브라우저에서 오류나는 경우가 있어서 추가함
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

request('register',GLOBAL_PARAM);

function saveData(e,c){

  // console.log("e = ",e); //address
  // console.log("c = ",c); //value 

  // value 값이 없으면 저장 안함
  if(c === null 
    || c === isNaN 
    || c === undefined 
    || c === 'NaN'){
    console.log('no value');
    return;
  }

  //name 가져오기
  var desc = "";
  var table = document.getElementsByTagName('table')[0];
  var rows = table.rows;
  for (var i = 1; i < rows.length; i++) {
      var rowText = rows[i].getElementsByTagName('td')[1].innerHTML;
      var device = rows[i].getElementsByTagName('td')[0].innerHTML;
      if (e.includes(device)) {
        desc = rowText;
      }
  }

  // DB에 저장할 body 만들기
  var param = {
    "deviceID":e,
    "value":c,
    "description":desc,
    "datetime":(new Date().toLocaleString())
  };

  // 추가로 넣고싶은 파라메터를 아래와 같이 등록해주세요.
  // 정확히 어떤 파라메터를 넣고싶은지 정하고 얘기해주시면 서버에 추가로 받을수있게 만들어둘게요-.
  // ex >
  // param.deviceName = GLOBAL_PARAM.deviceName
  // param.companyName = GLROBAL_PARAM.companyName
  // 

  request('data',param)
}

