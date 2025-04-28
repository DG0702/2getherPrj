// 헤더 파일 가져오기
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector("#header").innerHTML = data;
    })

// 헤더 파일 가져오기
fetch('profile.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector("#profile").innerHTML = data;
    })

// 댓글 파일 가져오기
fetch('reply.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector("#reply").innerHTML = data;
    })

// 푸터 파일 가져오기
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector("#footer").innerHTML = data;
    })