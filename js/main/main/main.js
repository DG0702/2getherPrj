// HTML 문서가 완전히 로드되었을 때, DOM 트리 생성
document.addEventListener("DOMContentLoaded", () =>{
    // 버튼1 애니메이션
    const savebtn = document.getElementById("savebtn");

    const originalText = `<i class="fa-solid fa-user-plus"></i>`;
    const hoverText = "멤버추가";

    savebtn.addEventListener("mouseover", () => {
        savebtn.innerHTML = hoverText;
    });

    savebtn.addEventListener("mouseout", () => {
        savebtn.innerHTML = originalText;
    });

// 버튼2 애니메이션
    const selectbtn = document.getElementById("selectbtn");

    const originalText2 = `<i class="fa-solid fa-people-group"></i>`;
    const hoverText2 = "멤버조회";

    selectbtn.addEventListener("mouseover", () => {
        selectbtn.innerHTML = hoverText2;
    });

    selectbtn.addEventListener("mouseout", () => {
        selectbtn.innerHTML = originalText2;
    });
})



