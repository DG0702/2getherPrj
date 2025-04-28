// firebase 데이터 가져오기
import { db } from "/js/database/firebase.js";
// collection : 컬렉션 추가, addDoc() : 문서추가(ID 자동 생성), getDocs() : 문서 안의 내용 다 가져오기
// serverTimestamp() :서버에서 생성한 정확한 타임스태프 자동 저장
import {collection,addDoc,getDocs,serverTimestamp} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";


// 방명록 등록 기능
let guestbookData = [];
let pageNum = 1;

// 방명록 등록 기능
$("#guestSubmit").click(async function () {
    let name = $("#guestName").val();
    let content = $("#guestContent").val().replace(/\n/g, " ");

    if (name.trim() === "" || content.trim() === "") {
        Swal.fire({
            title: "입력값이 이상해요",
            text: "이름과 내용을 똑바로좀 적어주세요",
            icon: "warning",
        });
        return;
    }

    let doc = {
        name: name,
        content: content,
        timestamp: serverTimestamp(),
    };

    await Swal.fire({
        title: "등록할래요?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "등록해요",
        cancelButtonText: "다시할래요",
    }).then(async (result) => {
        if (result.isConfirmed) {
            await addDoc(collection(db, "guestbook"), doc);
            Swal.fire("등록했어요!", "", "success");
            $("#guestName").val("");
            $("#guestContent").val("");
            getGuestbookCount(); //방명록 개수 세기
            getGuestbook(); // 데이터를 다시 불러오기
        }
    });
});

// 방명록 개수
async function getGuestbookCount() {
    const querySnapshot = await getDocs(collection(db, "guestbook"));
    const count = querySnapshot.size; // 컬렉션의 문서 수를 가져옴
    $("#message").text(count); // 방명록 수 표시
}

// 방명록 데베에서 로드
async function getGuestbook() {
    const querySnapshot = await getDocs(collection(db, "guestbook"));
    guestbookData = [];

    querySnapshot.forEach((doc) => {
        let data = doc.data();
        guestbookData.push({
            ...data,
            // i: doc.id, // 문서 ID도 함께 저장
        });
    });
    // timestamp 기준으로 내림차순 정렬
    guestbookData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds); // 서버 timestamp 비교

    displayGuestbookData();
    pagination_add(); // 페이지네이션 추가
}

// 방명록 프로필 컬러 설정
function randomRgb() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

// 방명록 출력
function displayGuestbookData() {
    let commentList = guestbookData.slice((pageNum - 1) * 5, pageNum * 5);
    $("#guestList .commentBox").remove(); // 기존의 방명록 없애기_다시 출력할꺼니까

    let html = "";
    commentList.forEach((data) => {
        let rgb = randomRgb();
        html += `
                    <div class="commentBox">
                      <div class = "commentProfile">
                        <i class="fa-solid fa-circle-user" style = "color:${rgb}"></i>
                      </div>
                      <div class = "commentContents">
                        <strong>${data.name}</strong><br/>
                        <p class = "contentBox">${data.content}</p>
                        <p class="time">${data.timestamp
            .toDate()
            .toLocaleString()}</p>
                      </div>
                    </div>
                `;
    });
    $("#guestList").append(html);
}

// 페이지네이션 추가
function pagination_add() {
    const pages = Math.ceil(guestbookData.length / 5);
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

// 페이지네이션 버튼 클릭, 방명록 출력
$(document).on("click", ".page-link", function (event) {
    event.preventDefault();
    pageNum = parseInt($(this).text()); // 클릭한 페이지 번호
    displayGuestbookData(); // 해당 페이지의 방명록 출력
});

$(document).ready(function () {
    // 데베 로드
    getGuestbook();

    // 개수 카운트
    getGuestbookCount();
});