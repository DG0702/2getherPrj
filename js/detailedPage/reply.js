// firebase 데이터 가져오기
import { db } from "/js/database/firebase.js";
import {
    doc,
    getDoc,
    addDoc,
    getDocs,
    query,
    where,
    collection,
    serverTimestamp,
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

//댓글 등록 가능
let commentsData = [];
let pageNumber = 1;

//버튼 클릭 시
$("#comment-submit").click(async function () {
    let userId = $("#user-id").val();
    let comment = $("#comment-content").val();

    if (userId.trim() === "" || comment.trim() === "") {
        Swal.fire({
            title: "입력값이 이상해요",
            text: "이름과 내용을 똑바로좀 적어주세요",
            icon: "warning",
        });
        return;
    }

    let doc = {
        userId: userId,
        comment: comment,
        memberId: idParam,
        timestamp: serverTimestamp(),
    };

    await Swal.fire({
        title: "저장할래요?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "저장해요",
        cancelButtonText: "다시할래요",
    }).then(async (result) => {
        if (result.isConfirmed) {
            // Firebase에 댓글 저장
            await addDoc(collection(db, "comments"), doc);
            Swal.fire("저장했어요!", "", "success");
            $("#user-id").val("");
            $("#comment-content").val("");

            // 댓글 다시 불러오기
            getCommentsCount();
            getComments();
        }
    });
});

// 댓글 개수
async function getCommentsCount() {
    const querySnapshot = await getDocs(
        query(collection(db, "comments"), where("memberId", "==", idParam))
    );
    const count = querySnapshot.size; // 컬렉션의 문서 수를 가져옴
    $("#message").text(count); // 댓글 수 표시
}

// 댓글 데베에서 로드
async function getComments() {
    const querySnapshot = await getDocs(
        query(collection(db, "comments"), where("memberId", "==", idParam))
    );
    commentsData = [];

    querySnapshot.forEach((doc) => {
        let data = doc.data();
        commentsData.push({
            ...data,
            // id: doc.id
        });
    });

    //시간 순 내림차순
    commentsData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

    displayCommentsData();
    pagination_add();
}

// 댓글 프로필 컬러 설정
function randomRgb() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

// 댓글 출력
function displayCommentsData() {
    let commentsList = commentsData.slice((pageNumber - 1) * 5, pageNumber * 5);
    $("#commentsList .commentBox").remove(); // 기존의 댓글 없애기_다시 출력할꺼니까

    let html = "";
    commentsList.forEach((data) => {
        let rgb = randomRgb();
        html += `
                <div class = "commentBox">
                  <div class = "commentProfile">
                    <i class="fa-solid fa-circle-user" style = "color:${rgb}"></i>
                  </div>
                  <div class = "commentContents">
                    <strong>${data.userId}</strong><br/>
                    <p class = "contentBox">${data.comment}</p>
                    <p class="time">${data.timestamp
            .toDate()
            .toLocaleString()}</p>
                  </div>
                </div>
                `;
    });
    $("#commentsList").append(html);
}

// 페이지네이션 추가
function pagination_add() {
    const pages = Math.ceil(commentsData.length / 5);
    let html = "";

    // 페이지네이션 버튼 추가
    for (let i = 0; i < pages; i++) {
        html += `
                      <li class="page-item">
                          <a class="page-link" href="#">${i + 1}</a>
                      </li>
                  `;
    }

    $(".pagination").html(html); // 페이지네이션을 추가
}

// 페이지네이션 버튼 클릭, 댓글 출력
$(document).on("click", ".page-link", function (event) {
    event.preventDefault();
    pageNumber = parseInt($(this).text()); // 클릭한 페이지 번호
    displayCommentsData(); // 해당 페이지의 댓글 출력
});

$(document).ready(function () {
    // 데베 로드
    getComments();
    getCommentsCount();
});
