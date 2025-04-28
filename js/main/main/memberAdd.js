// firebase 데이터 가져오기
import { db } from "/js/database/firebase.js";
// collection() : 컬렉션 참조, addDoc() : 문서추가(ID 자동 생성)
import { collection, addDoc, } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";


$("#postingbtn").click(async function () {
    let image = $("#imageUrl").val().trim();
    let name = $("#name").val().trim();
    let birth = $("#birth").val().trim();
    let blogLink = $("#blogLink").val().trim();
    let hobby = $("#hobby").val().trim();
    let intro = $("#intro").val().trim();
    let tmi = $("#tmi").val().trim();

    // 이미지 URL이 유효한지 확인하는 함수
    function isValidImageUrl(url) {
        // URL이 'http'로 시작하고, 끝이 .jpg / .jpeg / .png / .gif / .webp 중 하나인지 확인
        return (
            url.startsWith("http") && /\.(jpg|jpeg|png|gif|webp)$/.test(url)
        );
        /*
  startsWith("http") → 인터넷 주소 형식인지 확인
  /\.(...)\$/ → 해당 확장자로 "끝나는지" 정규표현식으로 검사
  */
    }

    // 블로그 링크가 유효한지 확인하는 함수
    function isValidLink(url) {
        // URL이 http:// 또는 https:// 로 시작하는지 확인
        return url.startsWith("http://") || url.startsWith("https://");
        /*
  startsWith → 문자열이 지정한 부분으로 시작하는지 검사
  두 가지 조건 중 하나라도 만족하면 true
  */
    }

    function isValidBirth(birth) {
        const inputDate = new Date(birth);
        const today = new Date();
        return birth && inputDate <= today;
    }

    if (
        !image ||
        !name ||
        !birth ||
        !blogLink ||
        !hobby ||
        !intro ||
        !tmi
    ) {
        Swal.fire({
            icon: "warning",
            title: "입력 오류",
            text: "모든 항목을 빠짐없이 입력해주세요!",
            confirmButtonColor: "#A47148",
        });
        return;
    }

    // 개별 필드 유효성 검사
    if (!isValidImageUrl(image)) {
        return Swal.fire({
            icon: "error",
            title: "이미지 주소 오류",
            text: "이미지 URL이 올바른 형식이 아닙니다. (jpg, png 등)",
            confirmButtonColor: "#A47148",
        });
    }

    if (!isValidLink(blogLink)) {
        return Swal.fire({
            icon: "error",
            title: "블로그 링크 오류",
            text: "블로그 주소는 http 또는 https로 시작해야 합니다.",
            confirmButtonColor: "#A47148",
        });
    }

    if (!isValidBirth(birth)) {
        return Swal.fire({
            icon: "error",
            title: "생년월일 오류",
            text: "생년월일은 오늘보다 이전 날짜여야 합니다.",
            confirmButtonColor: "#A47148",
        });
    }

    // 확인창 띄우기(저장, 취소)
    const result = await Swal.fire({
        title: "정말 팀원을 추가하시겠습니까?",
        text: "입력한 정보가 저장됩니다.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#A47148",
        cancelButtonColor: "#999",
        confirmButtonText: "추가하기",
        cancelButtonText: "취소",
    });

    // if문을 사용자가 "추가하기"를 눌렀을 때만 저장
    if (result.isConfirmed) {
        let doc = {
            image: image,
            name: name,
            birth: birth,
            blogLink: blogLink,
            hobby: hobby,
            intro: intro,
            tmi: tmi,
        };

        // 컬렉션 참조 (collection) 매개변수 2개 , 문서 추가(ID 자동 생성)
        await addDoc(collection(db, "Intro"), doc);

        await Swal.fire({
            icon: "success",
            title: "저장 완료!",
            text: "팀원이 성공적으로 추가되었습니다.",
            confirmButtonColor: "#A47148",
        });

        window.location.reload();
    } else {
        // 사용자가 "취소"를 눌렀을 때
        Swal.fire({
            icon: "info",
            title: "취소됨",
            text: "팀원 추가가 취소되었습니다.",
            confirmButtonColor: "#A47148",
        });
    }
});