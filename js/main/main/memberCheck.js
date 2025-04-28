// firebase 데이터 가져오기
import { db } from "/js/database/firebase.js";
// getDocs() : 컬렉션 안의 문서들 전부 가져오기
import { collection, getDocs, } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// 팀원 추가할 경우 프로필 생성, getDocs() : 컬렉션 안의 문서들 전부 가져오기
let docs = await getDocs(collection(db, "Intro"));
docs.forEach((doc) => {
    let row = doc.data();
    let docId = doc.id; //문서 ID 가져오기
    let image = row["image"];
    let name = row["name"];

    let temp_html = `
            <div class = "swiper-slide">
              <div class="card" style="cursor:pointer" onclick="location.href='../../../html/detailedPage/index.html?id=${docId}'">
                  <img src="${image}" class="card-img-top" alt="profile img" />
                  <div class="card-body">
                      <p class="card-text">${name}</p>
                  </div>
              </div>
            </div>`;
    $("#profile").append(temp_html);
});

// 슬라이드 동작 (초기화)
const swiper = new Swiper(".mySwiper", {
    slidesPerView: 3, // 한 화면에 보일 카드 개수
    spaceBetween: 30, // 카드 간 간격(px)
    navigation: {
        nextEl: ".swiper-button-next", // 다음 버튼 클래스
        prevEl: ".swiper-button-prev", // 이전 버튼 클래스
    },
});