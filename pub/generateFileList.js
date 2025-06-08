const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { DOMParser } = require('xmldom');

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

// git에서 마지막 커밋 날짜
function getGitLastModified(filePath) {
  try {
    // Git 명령어로 마지막 커밋 날짜를 가장 최근 한 개만 얻기
    const command = `git log --follow --format=%cd -n 1 -- ${filePath}`;
    // const command = `git log --follow --format=%cd -- ${filePath}`;
    const lastModified = execSync(command).toString().trim(); // 커밋 날짜 반환
    // 날짜를 ISO 형식으로 변환
    const date = new Date(lastModified);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
  } catch (error) {
    console.error(`Error fetching git commit date for ${filePath}:`, error);
    return null;
  }
}

// SVG 속성 추출
function getSvgSize(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const doc = new DOMParser().parseFromString(content, 'image/svg+xml');
    const svg = doc.getElementsByTagName('svg')[0];

    const width = svg.getAttribute('width') || null;
    const height = svg.getAttribute('height') || null;

    return { width, height };
  } catch (error) {
    console.error(`SVG size 파싱 오류: ${filePath}`, error);
    return { width: null, height: null };
  }
}
function getSvgStrokeColors(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const doc = new DOMParser().parseFromString(content, 'image/svg+xml');

    // stroke 속성 가진 요소들을 모음
    const elements = Array.from(doc.getElementsByTagName('*'));
    // const strokeColors = [];
    // elements.forEach(el => {
    //   const stroke = el.getAttribute('stroke');
    //   if (stroke && !strokeColors.includes(stroke)) {
    //     strokeColors.push(stroke);
    //   }
    // });
    // return strokeColors;
    for (const el of elements) {
      const stroke = el.getAttribute('stroke');
      if (stroke) {
        return stroke; // 첫 번째 stroke 값 반환
      }
    }
    return null;
  } catch (error) {
    console.error(`stroke 추출 실패: ${filePath}`, error);
    return null;
  }
}

// 파일 개수 저장
let htmlFileCount = 0;
let svgFileCount = 0;

// 지정된 디렉토리에서 모든 파일을 재귀적으로 읽어오는 함수
function getFilesFromDir(dirPath) {
  let htmlList = [];
  let svgList = [];

  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // 디렉토리 재귀 탐색
      // htmlList = htmlList.concat(getFilesFromDir(fullPath));
      const { htmlList: childHtmlList, svgList: childSvgList } = getFilesFromDir(fullPath);
      htmlList = htmlList.concat(childHtmlList);
      svgList = svgList.concat(childSvgList);
    } else {
      // 파일 확장자
      const fileExtension = path.extname(file).toLowerCase();

      // .html 파일 처리 
      if (fileExtension === '.html') {
        htmlFileCount++;
        const gitLastModified = getGitLastModified(fullPath);
        const fileInfo = fileNames[file] || {
          depth1: "",
          depth2: "",
          depth3: "",
          lastModified: "",
          version: "",
          state: "",
          remark: "",
        };
        htmlList.push({
          name: file,
          path: '/' + path.relative(path.join(__dirname, '../'), fullPath).replace(/\\/g, '/'),
          depth1: fileInfo.depth1,
          depth2: fileInfo.depth2,
          depth3: fileInfo.depth3,
          lastModified: gitLastModified || stats.mtime.toISOString().split('T')[0],
          version: fileInfo.version,
          state: fileInfo.state,
          remark: fileInfo.remark,
        });
      }

      // SVG 파일만 처리
      if (fileExtension === '.svg') {
        svgFileCount++;
        const gitLastModified = getGitLastModified(fullPath);
        const { width, height } = getSvgSize(fullPath);
        const strokeColor = getSvgStrokeColors(fullPath);
        svgList.push({
          name: file,
          path: '/' + path.relative(path.join(__dirname, '../'), fullPath).replace(/\\/g, '/'),
          width,
          height,
          stroke: strokeColor || '',
          lastModified: gitLastModified || stats.mtime.toISOString().split('T')[0],
        });
      }
    }
  });

  return { htmlList, svgList };
}

// '/web' 폴더 내의 모든 파일 정보 가져오기
const { htmlList: webFiles } = getFilesFromDir(path.join(__dirname, '../web'));
// 정렬
const fileOrder = Object.keys(fileNames);
webFiles.sort((a, b) => {
  const indexA = fileOrder.indexOf(a.name);
  const indexB = fileOrder.indexOf(b.name);
  return indexA - indexB;
});

// '/assets/images/common' 폴더 내의 모든 파일 정보 가져오기
const { svgList: svgFiles } = getFilesFromDir(path.join(__dirname, '../assets/images/common'));

// 결과를 JavaScript 객체 배열 형식으로 변환하여 파일에 저장
const htmlContent = `const fileList = ${JSON.stringify(webFiles, null, 2)};`;
fs.writeFileSync(path.join(__dirname, 'fileList.js'), htmlContent, 'utf8');
const svgContent = `const svgList = ${JSON.stringify(svgFiles, null, 2)};`;
fs.writeFileSync(path.join(__dirname, 'svgList.js'), svgContent, 'utf8');

// 결과 메세지
console.log(`전체 .html 파일 개수: ${htmlFileCount}개, 파일 목록이 'fileList.js'에 저장되었습니다.`);
console.log(`전체 .svg 파일 개수: ${svgFileCount}개, 파일 목록이 'svgList.js'에 저장되었습니다.`);


// node ./pub/generateFileList.js