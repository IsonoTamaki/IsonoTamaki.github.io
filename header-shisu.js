var lat = 35.68;
var lng = 139.77;
// 対応している場合

let promise = new Promise((resolve, reject) => {
  // #1
  if (navigator.geolocation) {
    // 現在地を取得
    navigator.geolocation.getCurrentPosition(
      // [第1引数] 取得に成功した場合の関数
      function (position) {
        // 取得したデータの整理
        var data = position.coords;

        // データの整理
        lat = data.latitude;
        lng = data.longitude;
        resolve(lat + "," + lng);

        // HTMLへの書き出し
        // document.getElementById("result").innerHTML =
        //   "<dl><dt>緯度</dt><dd>" +
        //   lat +
        //   "</dd><dt>経度</dt><dd>" +
        //   lng +
        //   "</dd></dl>";
      },

      // [第2引数] 取得に失敗した場合の関数
      function (error) {
        // エラーコード(error.code)の番号
        // 0:UNKNOWN_ERROR				原因不明のエラー
        // 1:PERMISSION_DENIED			利用者が位置情報の取得を許可しなかった
        // 2:POSITION_UNAVAILABLE		電波状況などで位置情報が取得できなかった
        // 3:TIMEOUT					位置情報の取得に時間がかかり過ぎた…

        // エラー番号に対応したメッセージ
        var errorInfo = [
          "原因不明のエラーが発生しました…。",
          "位置情報の取得が許可されませんでした…。",
          "電波状況などで位置情報が取得できませんでした…。",
          "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。",
        ];

        // エラー番号
        var errorNo = error.code;

        // エラーメッセージ
        var errorMessage =
          "[エラー番号: " + errorNo + "]\n" + errorInfo[errorNo];

        // アラート表示
        alert(errorMessage);

        // HTMLに書き出し
        document.getElementById("result").innerHTML = errorMessage;
      },

      // [第3引数] オプション
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 2000,
      }
    );
  }

  // 対応していない場合
  else {
    // エラーメッセージ
    var errorMessage = "お使いの端末は、GeoLacation APIに対応していません。";

    // アラート表示
    alert(errorMessage);

    // HTMLに書き出し
    document.getElementById("result").innerHTML = errorMessage;
  }
});

promise
  .then((msg) => {
    // #2
    return new Promise((resolve, reject) => {
      //htmlのul要素（id = 'messages'）を呼び出し
      var messageList = $("#messages");

      //openweathermap（天気予報API）に接続
      var request = new XMLHttpRequest();
      var cityName = "aichi";
      var owmApiKey = "9a985b1eecc46861e493cc38b6e89456";
      var owmURL =
        "https://api.openweathermap.org/data/2.5/onecall?units=metric&lat=" +
        lat +
        "&lon=" +
        lng +
        //   cityName +
        "&APPID=" +
        owmApiKey +
        "";

      request.open("GET", owmURL, true);
      //結果をjson型で受け取る
      request.responseType = "json";

      var temp;
      var hum;
    var sentaku_icon = ["images/shisu-icon-bgnone5.png","images/shisu-icon-bgnone4.png","images/shisu-icon-bgnone3.png","images/shisu-icon-bgnone2.png","images/shisu-icon-bgnone1.png"];
    var sentaku_setsumei =["部屋干し推奨","やや乾く","乾く","よく乾く","大変よく乾く"];
    request.onload = function () {
      var data = this.response;
      console.log(data);
      var w_sentaku = [0, 0, 0, 0, 0, 0, 0, 0];
      var w_day = ["","","","","","","",""];
      var w_week = ["","","","","","","",""];

      //今日の日付
      var date = new Date();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      w_day[0] = month + "月" + day + "日";
      w_week[0] = date.getDay();
      
      var best_day = 1; //最適日_初期値次の日
      for (var i = 0; i < 8; i++) {
        if(i >= 2){
          date.setDate(date.getDate() + 1);
          var month = date.getMonth() + 1;
          var day = date.getDate();
          w_day[i] = month + "月" + day + "日";
          w_week[i] = date.getDay();
        }
        weather = data["daily"][i]["weather"][0]["main"];
        temp = data["daily"][i]["temp"]["day"];
        hum = data["daily"][i]["humidity"];
        if (weather == "Clouds" || weather == "Clear") {
          w_sentaku[i] = 1;
          if (temp >= 20) {
            w_sentaku[i] = 2;
          }
          if (hum < 50) {
            w_sentaku[i] = 3;
          }
          if (hum < 40) {
            w_sentaku[i] = 4;
          }
        }
        if (w_sentaku[best_day] < w_sentaku[i] && i > 0) {
          best_day = i;
        }
      }
      console.log(w_sentaku);
      document.getElementById("header-shisu-icon").innerHTML = '<img src="' + sentaku_icon[w_sentaku[0]] + '"/><p class="header-nav-shisu-setsumei"><br>' + sentaku_setsumei[w_sentaku[0]] + '</p>';
      };

      request.send();
    });
  })
  .catch(() => {
    // エラーハンドリング
    console.error("Something wrong!");
  });
