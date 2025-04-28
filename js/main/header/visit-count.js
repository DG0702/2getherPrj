// firebase 데이터 가져오기
import { db } from "/js/database/firebase.js";
// doc():문서 참조 , getDoc() : 문서 1개 가져오기 , setDoc : 문서 덮어쓰기
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";


// 일정 시간마다 방문자 수 증가
setInterval(() => {
    // 일정 시간마다 실행할 함수
    updateVisitorCount(); // 방문자 수 증가 로직
}, 1000 * 10); // n초마다 실행

// 방문자 수 올라갈때 애니메이션 추가
function animateCountUp(element, start, end, duration = 2000) {
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(start + range * progress);

        element.textContent = `방문자 수 : ${currentValue}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

let firstVisit = true;

// 방문자 수 불러오고 +1 업데이트
async function updateVisitorCount() {
    try {
        // 문서 참조 (doc) -> 매개변수 3개
        const visitRef = doc(db, "siteCount", "visitCount");
        // 문서 가져오기
        const snapshot = await getDoc(visitRef);
        const randomCount = Math.floor(Math.random() * 5) + 1;

        let countAll = 0;

        // 데이터 읽기
        if (snapshot.exists()) {
            countAll = snapshot.data().countAll || 0;
        }

        if (countAll > 1000) {
            countAll = 0;
        }

        if (firstVisit) {
            countAll += 1;
            firstVisit = false;
        } else {
            countAll += randomCount;
        }

        // firebase 데이터(visitCount) 값 설정, 문서 덮어쓰기
        await setDoc(visitRef, { countAll });

        // span 태그 내의 문자열 가져와서 숫자 값만 남김
        const header_count = document.getElementById("header_count");
        const currentDisplay =
            parseInt(header_count.textContent.replace(/\D/g, "")) || 0;

        // 방문자 수 올라갈때 애니메이션 추가
        animateCountUp(header_count, currentDisplay, countAll);
    } catch (error) {
        console.error("방문자 수 업데이트 실패:", error);
    }
}

// 방문자 함수 실행
updateVisitorCount();
