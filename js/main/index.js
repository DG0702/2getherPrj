// 헤더 파일 가져오기
fetch('header.html')
    .then(response => response.text())
    .then(data =>{
        document.querySelector("#header").innerHTML = data;
    })

// 메인 파일 가져오기
fetch('main.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector("#main").innerHTML = data;
    })

// 멤버 추가 파일 가져오기
fetch('memberAdd.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector("#memberAdd").innerHTML = data;
    })

// 멤버 추가 파일 가져오기
fetch('memberCheck.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector("#memberCheck").innerHTML = data;
    })

// 팀 규칙 파일 가져오기
fetch('teamRoll.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector("#teamRoll").innerHTML = data;
    })

// 방명록 파일 가져오기
fetch('guestBook.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector("#guestBook").innerHTML = data;
    })

// 푸터 파일 가져오기
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector("#footer").innerHTML = data;
    })