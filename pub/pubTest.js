const setLnbActive = () => {
  const lnb = document.querySelector(".nav-lnb");
  if (!lnb) return;

  const currentPath = window.location.pathname;
  
  const links = lnb.querySelectorAll("a");

  links.forEach(link => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    if (currentPath === href) {
      link.classList.add("active");
      const depth2 = link.closest(".depth2");
      if (depth2) {
        depth2.style.display = "block";

        const depth1Link = depth2.previousElementSibling;
        if (depth1Link && depth1Link.classList.contains("depth1-link")) {
          depth1Link.classList.add("active");
        }
      }
    }
  });
};

// 예외처리
const handleLnbExceptions = () => {
  const exceptionMap = {
    "/web/pageRoleMgmt/pageRoleMgmt.html": "/web/userPermsMgmt/userPermsMgmt.html",
    "/web/vocLabMgmt/vocLabMgmt.html": "/web/codeMgmt/codeMgmt.html",
    "/web/specialCustMgmt/specialCustMgmt.html": "/web/codeMgmt/codeMgmt.html",
    "/web/apiLogMgmt/apiLogMgmt.html": "/web/logMgmt/logMgmt.html",
    "/web/manualBatch/manualBatch.html": "/web/batchLog/batchLog.html",
    "/web/announcements/anncDetail.html": "/web/announcements/anncList.html",
    "/web/announcements/anncInsertForm.html": "/web/announcements/anncList.html",
    "/web/announcements/anncUpdateForm.html": "/web/announcements/anncList.html",
    "/web/proposals/propDetail.html": "/web/proposals/propList.html",
    "/web/proposals/propInsertForm.html": "/web/proposals/propList.html",
    "/web/proposals/propUpdateForm.html": "/web/proposals/propList.html",
  };
  const depth1ClassMap = {
    pageRoleMgmt: "manager",
    vocLabMgmt: "manager",
    specialCustMgmt: "manager",
    apiLogMgmt: "manager",
    manualBatch: "manager",
    announcements: "notices",
    proposals: "notices"
  };
  const currentPath = window.location.pathname;
  const lnb = document.querySelector(".nav-lnb");
  if (!lnb || !exceptionMap[currentPath]) return;
  // 두 번째 뎁스 추출
  const pathParts = currentPath.split("/");
  const section = pathParts[2];
  const depth1Class = depth1ClassMap[section];
  if (depth1Class) {
    const depth1Link = lnb.querySelector(`.depth1-link.${depth1Class}`);
    if (depth1Link) {
      depth1Link.classList.add("active");
      const depth2 = depth1Link.nextElementSibling;
      if (depth2 && depth2.classList.contains("depth2")) {
        depth2.style.display = "block";
      }
    }
  }
  // 각 페이지별로 추가로 강조할 하위 링크
  const extraLink = lnb.querySelector(`a[href="${exceptionMap[currentPath]}"]`);
  if (extraLink) {
    extraLink.classList.add("active");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(setLnbActive, 1000);
  setTimeout(handleLnbExceptions, 1000);
});