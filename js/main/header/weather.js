// 날씨 관련
// 좌표 설정 (서울 종로구 기준: nx=60, ny=127)
let nx, ny;
//현재 위치값 가져오는 API
navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
    // 실제 포지션 값
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // 기상청 API에 적용할 수 있게 가공
    const result = dfs_xy_conv(lat, lon);
    nx = result.nx;
    ny = result.ny;

    // 임의의 좌표 생성시 사용
    //nx = 20;
    //ny = 127;
    console.log("현재 격자 좌표:", nx, ny);

    getWeather(nx, ny);
}

function error(err) {
    console.error("위치 정보를 가져올 수 없습니다:", err.message);
}

// 위도,경도를 기상청API에 사용하도록 가공 (기상청 공식 함수)
function dfs_xy_conv(lat, lon) {
    const RE = 6371.00877; // 지구 반지름(km)
    const GRID = 5.0; // 격자 간격(km)
    const SLAT1 = 30.0;
    const SLAT2 = 60.0;
    const OLON = 126.0;
    const OLAT = 38.0;
    const XO = 43;
    const YO = 136;

    const DEGRAD = Math.PI / 180.0;
    const re = RE / GRID;
    const slat1 = SLAT1 * DEGRAD;
    const slat2 = SLAT2 * DEGRAD;
    const olon = OLON * DEGRAD;
    const olat = OLAT * DEGRAD;

    let sn =
        Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
        Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;

    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = (re * sf) / Math.pow(ro, sn);

    const ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
    const r = (re * sf) / Math.pow(ra, sn);

    let theta = lon * DEGRAD - olon;
    if (theta > Math.PI) theta -= 2.0 * Math.PI;
    if (theta < -Math.PI) theta += 2.0 * Math.PI;
    theta *= sn;

    const x = Math.floor(r * Math.sin(theta) + XO + 0.5);
    const y = Math.floor(ro - r * Math.cos(theta) + YO + 0.5);

    return { nx: x, ny: y };
}

// 현재 시간 기준으로 기상청 기준 날짜 가져오는 함수
function getBaseTime(hour) {
    const times = [2, 5, 8, 11, 14, 17, 20, 23]; // 기상청 지원 base 시간
    let baseHour = 23; // 기본값 (가장 늦은 시간)

    for (let i = 0; i < times.length; i++) {
        if (hour < times[i]) {
            baseHour = times[i - 1] ?? 23; // 제일 이른 시간 전이면 23시 (전날)
            break;
        }
    }

    return String(baseHour).padStart(2, "0") + "00"; // ex) 0200, 0500, 0800 등
}

// 날씨 정도 가져오는 함수
function getWeather(nx, ny) {
    console.log("지금 나의 위치 :: " + nx + ny);

    // 오늘 날짜와 적절한 base_time 계산
    const now = new Date();
    const base_date = now.toISOString().slice(0, 10).replace(/-/g, ""); //ex) "20250412"
    const hour = now.getHours();
    const nowHourBase = String(hour).padStart(2, '0') + '00'; //ex) 0200,0500,0800 등
    const base_time = getBaseTime(hour); //3시간 단위 (0500, 0800 ...)

    console.log("기준시간 ::: " + nowHourBase);

    // 날씨 API 에서 인코딩된 키 사용 (API Key 발급 받아서 사용)
    const serviceKey =
        "B%2FPWusMdlDVh0QO2vrTiYOKte6sWDCN5MD9FQR5LPquOyR53Usl%2F%2Fb%2FN3zToN%2BFGYDl2lY6BJos%2F7NOVbWD%2ByA%3D%3D";

    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${serviceKey}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;

    console.log(url);

    const weatherInfo = document.getElementById("header_whether");
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("네트워크 응답에 문제가 있습니다.");
            }
            return response.json();
        })
        .then((data) => {
            const items = data.response.body.items.item;

            // 예보 시간 기준으로 정렬 (선택 사항)
            const forecast = {};

            items.forEach((item) => {
                const time = item.fcstTime;
                if (!forecast[time]) forecast[time] = {};
                if (item.category === "TMP") {
                    forecast[time].temp = item.fcstValue;
                } else if (item.category === "SKY") {
                    forecast[time].sky = item.fcstValue;
                } else if (item.category === "PTY") {
                    forecast[time].pty = item.fcstValue;
                }
            });

            console.log(forecast);


            const currentForecast = forecast[nowHourBase];

            // 상태 매핑 (FontAwesome 아이콘 사용)
            const skyMap = {
                1: "fas fa-sun", // 맑음
                3: "fas fa-cloud-sun", // 흐림
                4: "fa-solid fa-smog", // 구름
            };
            const ptyMap = {
                0: "없음",
                1: "fa-solid fa-umbrella", // 비
                2: "fa-solid fa-cloud-meatball", // 비/눈
                3: "fa-solid fa-snowflake", // 눈
                4: "fa-solid fa-cloud-showers-heavy", // 소나기
                5: "fa-solid fa-cloud-rain", // 비
                6: "fa-solid fa-cloud-meatball", // 함박눈
                7: "fa-solid fa-cloud-meatball", // 함박눈
            };

            // 전체 예보 시간 중 첫 번째 항목만 선택
            const tmp = currentForecast.temp;

            let status = null;

            if (currentForecast.pty == 0) {
                status = skyMap[currentForecast.sky];
            } else {
                status = ptyMap[currentForecast.pty];
            }

            console.log(`[${nowHourBase}] 기온: ${tmp}°C / 상태: ${status}`);
            let whetherTag = `<i class="${status}"></i> &nbsp; ${tmp}°C`;
            weatherInfo.innerHTML = whetherTag;
        })
        .catch((error) => {
            console.error("날씨 정보를 가져오는 데 실패했습니다:", error);
        });
}