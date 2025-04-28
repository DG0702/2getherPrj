// firebase 데이터 가져오기
import { db } from "/js/database/firebase.js";
// doc : 문서 추가 getDoc() : 문서 1개 가져오기
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// URL에서 name 파라미터 가져오기
const urlParams = new URLSearchParams(window.location.search);
const idParam = urlParams.get("id");

async function getMemberDetail(id) {
  const docRef = doc(db, "Intro", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    // 데이터 바인딩
    document.querySelector(".profile-img-box img").src = data.image;
    document.getElementById("name").innerText = data.name;
    const nowAge =
      new Date().getFullYear() - new Date(data.birth).getFullYear();
    document.getElementById("age").innerText = nowAge;
    document.getElementById("hobby").innerText = data.hobby;
    document.getElementById("introText").innerText = data.intro;
    document.getElementById("tmiText").innerText = data.tmi;

    // 블로그 링크 바인딩
    const blogAnchor = document.querySelector("#blogLink a");
    blogAnchor.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = data.blogLink;
    });
  } else {
    alert("해당 팀원 정보를 찾을 수 없습니다.");
  }
}

getMemberDetail(idParam);
