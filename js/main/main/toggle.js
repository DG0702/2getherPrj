// 팀원 추가
$("#savebtn").click(async function () {
    $("#postingbox").slideToggle();
    $(".mySwiper").slideUp();
});

//   팀원 조회
$("#selectbtn").click(async function () {
    $(".mySwiper").slideToggle();
    $("#postingbox").slideUp();
});