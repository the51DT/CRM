const fs = require('fs');
const path = require('path');

// 폴더명과 한글 파일명을 매칭하는 객체 정의 : 사용 안 함함
const folderNames = {
  "todoList": "오늘의 할 일",
  "custTypeStats": "현황 통계", // 고객 유형 현황
  "careDtlStats": "현황 통계", // Care 상세 현황
  "unhndldStats": "현황 통계", // 미처리 현황
  "reportStats": "현황 통계", // 현황 레포트
  "custFltStats": "고객 관리", // 고객 장애 통계
  "custInfoMgmt": "고객 관리", // 고객 정보 관리
  "announcements": "공지/건의 사항", // 공지 사항
  "proposals": "공지/건의 사항", // 건의 사항
  "userPermsMgmt": "관리자", // 권한 관리 -  사용자 권한 관리
  "pageRoleMgmt": "관리자", // 권한 관리 - 메뉴별 권한 관리
  "codeMgmt": "관리자", // 상담 관리 - 고객 특이 사항 관리
  "vocLabMgmt": "관리자", // 상담 관리 - VOC LAB 제외 처리
  "specialCustMgmt": "관리자", // 상담 관리 - 특별 고객 관리
  "logMgmt": "관리자", // 접속/API 성공 관리 - 화면 접근 로그
  "apiLogMgmt": "관리자", // 접속/API 성공 관리 - 외부 API 로그
  "batchLog": "관리자", // 배치 로그 - 배치 로그
  "manualBatch": "관리자", // 배치 로그 - 배치 수동 실행
};


const fileNames = {
  // 오늘의 할 일
  "todoList.html": {
    depth1: "오늘의 할 일",
    depth2: "오늘의 할 일",
    depth3: "",
    lastModified: "-",
    version: "1.2",
    state: "진행",
    remark: "수정/추가",
  },
  // 현황 통계
  "custTypeStats.html": {
    depth1: "현황 통계",
    depth2: "고객 유형 현황",
    depth3: "",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  "careDtlStats.html": {
    depth1: "현황 통계",
    depth2: "Care 상세 현황",
    depth3: "",
    lastModified: "-",
    version: "1.2",
    state: "진행",
    remark: "수정/추가",
  },
  "unhndldStats.html": {
    depth1: "현황 통계",
    depth2: "미처리 현황",
    depth3: "",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  "reportStats.html": {
    depth1: "현황 통계",
    depth2: "현황 레포트",
    depth3: "",
    lastModified: "-",
    version: "1.2",
    state: "진행",
    remark: "신규",
  },
  // 고객 관리
  "custFltStats.html": {
    depth1: "고객 관리",
    depth2: "고객 장애 통계",
    depth3: "",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  "custInfoMgmt.html": {
    depth1: "고객 관리",
    depth2: "고객 정보 관리",
    depth3: "",
    lastModified: "-",
    version: "1.2",
    state: "진행",
    remark: "수정/추가",
  },
  // 공지/건의 사항
  "anncList.html": {
    depth1: "공지/건의 사항",
    depth2: "공지사항 목록",
    depth3: "",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  "anncDetail.html": {
    depth1: "공지/건의 사항",
    depth2: "공지사항 상세",
    depth3: "",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  "anncInsertForm.html": {
    depth1: "공지/건의 사항",
    depth2: "공지사항 등록",
    depth3: "",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  "anncUpdateForm.html": {
    depth1: "공지/건의 사항",
    depth2: "공지사항 수정",
    depth3: "",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  "propList.html": {
    depth1: "공지/건의 사항",
    depth2: "건의사항 목록",
    depth3: "",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  "propDetail.html": {
    depth1: "공지/건의 사항",
    depth2: "건의사항 상세",
    depth3: "",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  "propInsertForm.html": {
    depth1: "공지/건의 사항",
    depth2: "건의사항 등록",
    depth3: "",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  "propUpdateForm.html": {
    depth1: "공지/건의 사항",
    depth2: "건의사항 수정",
    depth3: "",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  // 관리자
  "userPermsMgmt.html": {
    depth1: "관리자",
    depth2: "권한 관리",
    depth3: "사용자 권한 관리",
    lastModified: "-",
    version: "1.2",
    state: "진행",
    remark: "수정/추가",
  },
  "pageRoleMgmt.html": {
    depth1: "관리자",
    depth2: "권한 관리",
    depth3: "메뉴별 권한 관리",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  "codeMgmt.html": {
    depth1: "관리자",
    depth2: "상담 관리",
    depth3: "고객 특이 사항 관리",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  "vocLabMgmt.html": {
    depth1: "관리자",
    depth2: "상담 관리",
    depth3: "VOC LAB 제외 처리",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  "specialCustMgmt.html": {
    depth1: "관리자",
    depth2: "상담 관리",
    depth3: "특별 고객 관리",
    lastModified: "-",
    version: "1.2",
    state: "진행",
    remark: "신규",
  },
  "logMgmt.html": {
    depth1: "관리자",
    depth2: "접속/API 성공 관리",
    depth3: "화면 접근 로그",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  "apiLogMgmt.html": {
    depth1: "관리자",
    depth2: "접속/API 성공 관리",
    depth3: "외부 API 로그",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  "batchLog.html": {
    depth1: "관리자",
    depth2: "배치 로그",
    depth3: "배치 로그",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
  "manualBatch.html": {
    depth1: "관리자",
    depth2: "배치 로그",
    depth3: "배치 수동 실행",
    lastModified: "-",
    version: "1.1",
    state: "완료",
    remark: "",
  },
};

// // const stats = fs.statSync('web/manualBatch/manualBatch.html');
// // console.log(stats.mtime); // 파일의 마지막 수정 시간 출력

// // 파일의 실제 수정일을 설정
// for (const file in fileNames) {
//   const filePath = path.join(__dirname, 'web', file); // 'web' 디렉토리에 파일이 위치한다고 가정
//   try {
//     const fileStats = fs.statSync(filePath);
//     fileNames[file].lastModified = fileStats.mtime.toISOString();
//   } catch (err) {
//     console.error(`파일을 찾을 수 없습니다: ${filePath}`);
//     fileNames[file].lastModified = "-";
//   }
// }

// 1. web 디렉토리 내의 모든 HTML 파일 경로 수집
function getAllHtmlFiles(dirPath) {
  let htmlFiles = [];

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      htmlFiles = htmlFiles.concat(getAllHtmlFiles(fullPath));
    } else if (entry.isFile() && path.extname(entry.name) === '.html') {
      htmlFiles.push(fullPath);
    }
  }

  return htmlFiles;
}

// 2. 수집된 파일 경로를 기반으로 lastModified 정보 업데이트
const webDir = path.join(__dirname, '../web');
const htmlFilePaths = getAllHtmlFiles(webDir);

for (const filePath of htmlFilePaths) {
  const fileName = path.basename(filePath);

  if (fileNames[fileName]) {
    try {
      const fileStats = fs.statSync(filePath);
      fileNames[fileName].lastModified = fileStats.mtime.toISOString().split('T')[0];;
    } catch (err) {
      console.error(`파일 정보를 가져올 수 없습니다: ${filePath}`);
      fileNames[fileName].lastModified = "-";
    }
  }
}

// 전체 .html 파일 개수를 저장할 변수
let htmlFileCount = 0;

// 지정된 디렉토리에서 모든 파일을 재귀적으로 읽어오는 함수
function getFilesFromDir(dirPath) {
  let fileArray = [];

  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // 디렉토리인 경우 재귀 호출
      fileArray = fileArray.concat(getFilesFromDir(fullPath));
    } else {
      // 파일인 경우 정보 추가
      // const folderName = path.basename(path.dirname(fullPath));
      // const depth1 = folderNames[folderName] || folderName; 
      // const depth2 = fileNames[file] || file;
      // const fileName = fileNames[file] || file; 
      // const fileLabel = fileNames[fileName] || fileName;
      // 하이픈과 공백을 기준으로 분리
      // const parts = fileLabel.split(/\s*-\s*/);
      // const depth1 = parts[0] || '';
      // const depth2 = parts[1] || '';
      // const depth3 = parts[2] || '';
      
      htmlFileCount++; // .html 파일 개수 증가

      const fileInfo = fileNames[file] || {
        depth1: "",
        depth2: "",
        depth3: "",
        lastModified: "",
        version: "",
        state: "",
        remark: "",
      };

      fileArray.push({
        name: file,
        path: '/' + path.relative(path.join(__dirname, '../'), fullPath).replace(/\\/g, '/'), // '/web/...' 형태로 변환
        depth1: fileInfo.depth1,
        depth2: fileInfo.depth2,
        depth3: fileInfo.depth3,
        lastModified: fileInfo.lastModified,
        version: fileInfo.version,
        state: fileInfo.state,
        remark: fileInfo.remark,
      });
    }
  });

  return fileArray;
}

// 'web' 폴더 내의 모든 파일 정보 가져오기
const files = getFilesFromDir(path.join(__dirname, '../web'));

// fileNames의 키 순서를 기준으로 files 배열 정렬
const fileOrder = Object.keys(fileNames);
files.sort((a, b) => {
  const indexA = fileOrder.indexOf(a.name);
  const indexB = fileOrder.indexOf(b.name);
  return indexA - indexB;
});

// 전체 .html 파일 개수 출력
console.log(`📄 전체 .html 파일 개수: ${htmlFileCount}개`);

// 결과를 JavaScript 객체 배열 형식으로 변환하여 파일에 저장
const jsContent = `
  const fileList = ${JSON.stringify(files, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'fileList.js'), jsContent, 'utf8');

console.log("파일 목록이 'fileList.js'에 저장되었습니다.");


// node ./pub/generateFileList.js