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
        document.getElementById("result").innerHTML =
          "<dl><dt>緯度</dt><dd>" +
          lat +
          "</dd><dt>経度</dt><dd>" +
          lng +
          "</dd></dl>";
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
        "http://api.openweathermap.org/data/2.5/onecall?units=metric&lat=" +
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
      request.onload = function () {
        var data = this.response;
        console.log(data);
        temp = data["current"]["temp"];
        hum = data["current"]["humidity"];
        var sentaku = temp * 0.81 + 0.01 * hum * (0.99 * temp - 14.3) + 46.3;
        console.log(sentaku);
        var w_sentaku = [0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < 7; i++) {
          temp = data["daily"][i]["temp"]["day"];
          hum = data["daily"][i]["humidity"];
          w_sentaku[i] = temp * 0.81 + 0.01 * hum * (0.99 * temp - 14.3) + 46.3;
        }
        console.log(w_sentaku);
        var messageElement = $(
          "<il><p class='weather'> 天気:" +
            data["current"]["weather"][0]["main"] +
            ", 気温:" +
            data["current"]["temp"] +
            ", 湿度:" +
            data["current"]["humidity"] +
            "</p></il>" +
            "<il><p> 一週間の洗濯指数" +
            w_sentaku +
            "</p></il>"
        );

        //HTMLに取得したデータを追加する
        messageList.append(messageElement);
      };

      request.send();
    });
  })
  .catch(() => {
    // エラーハンドリング
    console.error("Something wrong!");
  });
