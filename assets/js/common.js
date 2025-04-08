/**
 * UI에 관한 자바스크립트
 *
 * @function htmlIncludes - html include를 위한 임시 함수
 * @function pageLoading - Loading sample
 * @function lnb - LNB
 * @function isInputClose - Input Close
 * @function isSelectCustom - selectbox custom
 * @function isTabs - tabs
 * @function inputDatePicker - input용 기본 datepicker
 * @function buttonDatePicker - button용 기본 datepicker layer
 * @function isTooltip - bootstrap5 tooltip
 * @function isTopMove - top버튼 위로가기
 *
 * @function isAlert - alert
 * @param    root - popup이 속하는 영역
 * @param    message - 컨텐츠 내용
 * @param    image - 이미지
 * @param    onConfirm - 이벤트 함수
 * @param    oneButton - 취소버튼 삭제 여부
 * @returns {showAlert}
 *
 * @function isToast - toast
 * @param    delay - 사라지는 속도
 * @param    className - ui용 클래스
 * @param    message - 컨텐츠 내용
 * @returns {showToast}
 *
 * @function dataTable - dataTable default option
 * @returns {dataTableOptions}

 * @function truncateByCharacters - 글자 자르기
 * @returns {isTruncateByCharacters}
 * @param    text - 컨텐츠 내용
 * @param    maxLength - 최대 글자 수
 */

const UI = {
  htmlIncludes: () => {
    $("#header").load("/fragments/header.html");
    $("#lnb").load("/fragments/lnb.html");
    $("#footer").load("/layouts/footer.html");
  },

  pageLoading: () => {
    $("#contents").prepend(
      `<div class='page-loading'><img src="/assets/images/common/loading.svg" alt="loading"/></div>`
    );

    // data success
    setTimeout(() => {
      $(".page-loading").remove();
      $("#contents .contents__inner").css("visibility", "visible");
    }, 800);
  },

  lnb: () => {
    setTimeout(() => {
        const depth1Link = $(".nav-lnb .depth1-link");
        const depth2 = $(".nav-lnb .depth2");
        const depth1Active = $(".nav-lnb .depth1-link.active");
    
        if (depth1Active) {
          depth1Active.next().slideDown();
          //depth1Active.next().find("a").first().addClass("active");
        }
    
        depth1Link.on("click", function (e) {
          if ($(this).next().length > 0) {
              e.preventDefault();
    
              if ($(this).hasClass("active")) return;
    
              depth2.slideUp();
              $(this).next().slideDown();
    
              depth1Link.removeClass("active");
              $(this).addClass("active");
    
              $(this).next().find("a").removeClass("active"); // 기존 활성화된 항목 제거
              $(this).next().find("a").first().addClass("active"); // 첫 번째 항목 활성화
          }
        });
    
        depth2.on("click", "a", function (e) {
            if ($(this).attr("href") === "#") {
                e.preventDefault();
            }
    
            depth2.find("a").removeClass("active");
            $(this).addClass("active");
        });
      }, 200);
  },

  isInputClose: () => {
    $(".input-form .inner > input, .input-form > textarea").each(function () {
      // 닫기 버튼 생성
      const closeButton = $(
        `<button type="button" title="입력한 문자 삭제" class="btn-clear"><span class="is-blind">삭제</span></button>`
      );

      // 입력 필드 뒤에 닫기 버튼 추가
      $(this).after(closeButton);

      // 초기화될 때 값이 있고 disabled, readonly가 아닌 경우 닫기 버튼 표시
      if ($(this).val().length > 0 && !$(this).prop("disabled") && !$(this).prop("readonly")) {
        closeButton.fadeIn(300);
      }

      // 입력 값이 있고 disabled, readonly가 아닌 경우 닫기 버튼 표시
      $(this).on("input", function () {
        if ($(this).val().length > 0 && !$(this).prop("disabled") && !$(this).prop("readonly")) {
          $(this).next(".btn-clear").fadeIn(300);
        } else {
          $(this).next(".btn-clear").fadeOut(300);
        }
      });

      // 닫기 버튼 클릭 시 입력 필드 초기화 (disabled 또는 readonly 가 아닌 경우)
      closeButton.on("click", function () {
        var inputField = $(this).prev("input, textarea");
        if (!inputField.prop("disabled") && !inputField.prop("readonly")) {
          inputField.val("").focus();
          $(this).fadeOut(300);
        }
      });
    });
  },

  isSelectCustom: () => {
    setTimeout(() => {
      $("select").each(function () {
        const $originalSelect = $(this); // 현재 select 요소를 참조합니다
        const originalClasses = $originalSelect.attr("class"); // 원래 select 요소의 클래스를 가져옵니다
        const styles = $originalSelect.attr("style");

        // 커스텀 셀렉트 래퍼를 만듭니다
        const $customSelectWrapper = $("<div>", {
          class: `custom-select-wrapper ${originalClasses}`, // 원래 select 요소의 클래스를 추가합니다
          style: styles,
        });

        const $customSelect = $("<div>", { class: "custom-select" }); // 커스텀 셀렉트 요소를 만듭니다
        const $customSelectTrigger = $("<button>", {
          class: "custom-select-trigger",
          text: $originalSelect.find("option:selected").text(),
        }); // 선택된 옵션을 표시하는 트리거를 만듭니다
        const $customOptions = $("<div>", { class: "custom-options" }); // 커스텀 옵션들을 담을 컨테이너를 만듭니다

        // 원래 select 요소의 모든 옵션을 반복합니다
        $originalSelect.find("option").each(function () {
          const $option = $(this);
          const $customOption = $("<button>", {
            class: "custom-option",
            "data-value": $option.val(),
            text: $option.text(),
          }); // 각 옵션을 커스텀 옵션 요소로 만듭니다
          $customOptions.append($customOption); // 커스텀 옵션 컨테이너에 추가합니다
        });

        // 커스텀 셀렉트 요소를 구성합니다
        $customSelect.append($customSelectTrigger).append($customOptions);
        $customSelectWrapper.append($customSelect);
        $originalSelect.after($customSelectWrapper); // 원래 select 요소 뒤에 커스텀 셀렉트 래퍼를 추가합니다
        $originalSelect.addClass("select-hidden"); // 원래 select 요소를 숨깁니다

        // 트리거 클릭 시 커스텀 셀렉트를 엽니다
        $customSelectTrigger.on("click", function () {
          $customSelect.toggleClass("open");
        });

        // 커스텀 옵션 클릭 시 선택된 값을 반영합니다
        $customOptions.on("click", ".custom-option", function () {
          const value = $(this).data("value");
          const text = $(this).text();

          $customSelectTrigger.text(text); // 트리거 텍스트를 업데이트합니다
          $originalSelect.val(value).change(); // 원래 select 요소의 값을 변경하고 change 이벤트를 트리거합니다
          $customSelect.removeClass("open"); // 커스텀 셀렉트를 닫습니다
        });

        // 문서 클릭 시 커스텀 셀렉트를 닫습니다
        $(document).on("click", function (e) {
          if (!$customSelect.is(e.target) && $customSelect.has(e.target).length === 0) {
            $customSelect.removeClass("open");
          }
        });
      });
    });
  },

  isAlert: () => {
    return ({ root = "#root", message, image = "", type = "", onConfirm, oneButton = false }) => {
      // 메시지가 없을 경우 콘솔에 경고 메시지를 출력하고 함수를 종료합니다.
      if (!message) {
        console.log("message는 필수 입니다.");
        return;
      }

      const alertPlaceholder = $(root); // 경고 메시지를 삽입할 위치를 선택합니다.
      const typeHtml = type ? `alert-${type}` : ""; // 타입에 따라 클래스명을 설정합니다.
      const imageHtml = image ? `<div class="alert-bod__img">${image}</div>` : ""; // 이미지가 있을 경우 이미지를 설정합니다.

      // 취소 버튼과 확인 버튼 HTML을 조건에 따라 생성합니다.
      const cancelButtonHtml = oneButton
        ? "" // oneButton이 true이면 취소 버튼을 생성하지 않습니다.
        : `<button type="button" class="btn-cancle" data-bs-dismiss="alert" aria-label="Cancle">취소</button>`;

      const confirmButtonHtml = `<button type="button" class="btn-confirm" data-bs-dismiss="alert" aria-label="Confirm">확인</button>`;

      const wrapper = $(
        `<div class="alert ${typeHtml} alert-dismissible" role="alert" style="z-index: 1100;">
          <div class="alert-inner">
            <div class="alert-body">
              ${imageHtml}
              <div class="alert-bod__text">${message}</div>
            </div>
            <div class="alert-footer">
              ${cancelButtonHtml}
              ${confirmButtonHtml}
            </div>
          </div>
        </div>`
      );

      alertPlaceholder.append(wrapper); // 생성된 경고 메시지를 페이지에 추가합니다.

      // onConfirm이 함수일 경우, 확인 버튼에 클릭 이벤트 핸들러를 추가합니다.
      if (typeof onConfirm === "function") {
        wrapper.find(".btn-confirm").on("click", onConfirm);
      }
    };
  },

  isToast: () => {
    return ({
      delay = 3000,
      className = "text-bg",
      message = "Hello, world! This is a toast message.",
      image = "<img src='/assets/images/common/icon_toast_info.svg' alt='안내 아이콘' />",
    }) => {
      const target = $(event.currentTarget);
      // toast-container를 찾음
      let toastContainer = $(".toast-container");

      // toast-container가 존재하지 않으면 새로 생성하여 추가
      if (toastContainer.length === 0) {
        $("body").append(
          `<div class="toast-container position-fixed bottom-0 start-50 translate-middle-x p-3"></div>`
        );
        toastContainer = $(".toast-container");
      }

      // 클릭된 버튼을 비활성화
      target.css("pointer-events", "none");

      // 새로운 toast 요소 생성
      const newToast = $(
        `<div class="toast align-items-center ${className} border-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body d-flex">
              <span class="toast-img">${image}</span>
              <span class="toast-text">${message}</span>
            </div>
            <button
              type="button"
              class="btn-close me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>`
      );

      // 새로운 toast를 toast-container에 추가
      toastContainer.append(newToast);

      // Bootstrap toast 인스턴스 생성 및 delay 설정
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(newToast, { delay: delay });
      toastBootstrap.show();

      // 토스트 메시지가 사라진 후에 버튼을 다시 활성화
      setTimeout(() => {
        newToast.remove();
        target.css("pointer-events", "auto");
      }, delay);
    };
  },

  isTabs: () => {
    $(".nav button").each(function () {
      const tabTrigger = new bootstrap.Tab(this);

      $(this).on("click", function (event) {
        event.preventDefault();
        tabTrigger.show();
      });
    });
  },

  dataTable: () => {
    return {
      autoWidth: false,
      lengthMenu: [15, 30, 75, 100],
      language: {
        processing: "처리 중...",
        lengthMenu: "총 _TOTAL_ 건 _MENU_",
        infoEmpty: "항목이 없습니다",
        loadingRecords: "로딩 중...",
        zeroRecords: "일치하는 항목이 없습니다",
        emptyTable: "데이터가 없습니다",
        paginate: {
          first: "",
          last: "",
          next: "",
          previous: "",
        },
      },
      order: [], // 초기 정렬을 비워둠
      scrollX: true,
      dom: "<'dt-container'lB>rtp",
      buttons: [
        {
          extend: "",
          text: "다운로드",
          className: "btn btn-ico btn-download",
          action: function ( e, dt, node, config ) {
            var myModal = new bootstrap.Modal(document.getElementById('excelModal'));
            myModal.show();
          }
        },
      ],

      columnDefs: [
        { orderable: false, targets: "_all" }, // 모든 열에 대해 정렬 기능 비활성화
        { orderSequence: ["desc", "asc"], targets: "_all" }, // 모든 열에 대해 내림차순을 기본으로, 그 다음 오름차순
      ],
    };
  },

  inputDatePicker: () => {
    function initializeDateTimePickers(container, index, format = "YYYY-MM-DD", viewMode = "days") {
      const startDate = container.find(`.start-date${index + 1}`);
      const endDate = container.find(`.end-date${index + 1}`);

      startDate.off("change.datetimepicker");
      endDate.off("change.datetimepicker");

      startDate.datetimepicker("destroy");
      endDate.datetimepicker("destroy");

      let maxDate = moment();
      let minDate = maxDate.clone().subtract(3, 'days');

      if (viewMode === "months") {
        maxDate = maxDate.startOf("month");
        minDate = minDate.startOf("month");
      }

      startDate.datetimepicker({
        format: format,
        viewMode: viewMode,
        locale: "ko",
        minDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).setHours(00, 00, 00, 000),
        maxDate: maxDate.toDate(),
        useCurrent: false,
        dayViewHeaderFormat: "YYYY년 MMMM",
      });

      endDate.datetimepicker({
        format: format,
        viewMode: viewMode,
        locale: "ko",
        minDate: minDate.toDate(),
        maxDate: maxDate.toDate(),
        useCurrent: false,
        dayViewHeaderFormat: "YYYY년 MMMM",
      });

      startDate.on("change.datetimepicker", function (e) {
        $(this).datetimepicker("hide");
        endDate.datetimepicker("minDate", e.date);
      });

      endDate.on("change.datetimepicker", function (e) {
        $(this).datetimepicker("hide");
        startDate.datetimepicker("maxDate", e.date);
      });
    }

    $(".date-picker-group").each(function (index) {
      const $group = $(this);
      const $formatSelector = $group.find(".formatSelector");

      // Define default format and viewMode
      let defaultFormat = "YYYY-MM-DD";
      let defaultViewMode = "days";

      if ($formatSelector.length > 0) {
        $formatSelector.change(function () {
          const value = $(this).val();

          $group.find(`.start-date${index + 1}`).datetimepicker("destroy");
          $group.find(`.end-date${index + 1}`).datetimepicker("destroy");

          if (value === "month") {
            initializeDateTimePickers($group, index, "YYYY-MM", "months");
          } else {
            initializeDateTimePickers($group, index, "YYYY-MM-DD", "days");
          }
        });

        // Trigger change event to initialize based on default or selected value
        $formatSelector.trigger("change");
      } else {
        // If no formatSelector is found, initialize with default format and viewMode
        initializeDateTimePickers($group, index, defaultFormat, defaultViewMode);
      }
    });
  },

  buttonDatePicker: () => {

    // 두 번째 datetimepicker 초기화
    $(".datetimepicker2").datetimepicker({
      locale: "ko",
      dayViewHeaderFormat: "YYYY년 MMMM",
      inline: true,
      maxDate: new Date().setHours(23, 59, 59, 999),
      useCurrent: false,
    });

    $(".datetimepicker3").datetimepicker({
      locale: "ko",
      dayViewHeaderFormat: "YYYY년 MMMM",
      inline: true,
      useCurrent: false,
    });

    // 첫 번째 datetimepicker에 변경 이벤트 리스너 추가
    $(".datetimepicker").on("change.datetimepicker", function (e) {
      const selectedDate = e.date.format("YYYY-MM-DD");
      const $datepickerWrap = $(this).closest(".datepicker-wrap");
      const $target = $datepickerWrap.find(".btn-datepicker");

      $datepickerWrap.find(".start-date .title em").text(selectedDate);
      $target.find(".start").text(selectedDate);

      $('.datetimepicker2').datetimepicker('minDate', e.date);
      $('.datetimepicker3').datetimepicker('minDate', e.date);
    });

    // 두 번째 datetimepicker에 변경 이벤트 리스너 추가
    $(".datetimepicker2").on("change.datetimepicker", function (e) {
      const selectedDate = e.date.format("YYYY-MM-DD");
      const $datepickerWrap = $(this).closest(".datepicker-wrap");
      const $target = $datepickerWrap.find(".btn-datepicker");

      $datepickerWrap.find(".end-date .title em").text(selectedDate);
      $target.find(".end").text(selectedDate);
      $('.datetimepicker2').datetimepicker('date', selectedDate);
      $('.datetimepicker').datetimepicker('maxDate', e.date);
    });

    // 두 번째 datetimepicker에 변경 이벤트 리스너 추가
    $(".datetimepicker3").on("change.datetimepicker", function (e) {
      const selectedDate = e.date.format("YYYY-MM-DD");
      const $datepickerWrap = $(this).closest(".datepicker-wrap");
      const $target = $datepickerWrap.find(".btn-datepicker");

      $datepickerWrap.find(".end-date .title em").text(selectedDate);
      $target.find(".end").text(selectedDate);
      $('.datetimepicker').datetimepicker('maxDate', e.date);
    });

    // 레이어 닫기 이벤트 리스너 추가
    $("#collapseDate, #collapseDate2, #collapseDate3, #collapseDate4, #collapseDate5").on(
      "click",
      ".close",
      function () {
        $("#collapseDate, #collapseDate2, #collapseDate3, #collapseDate4, #collapseDate5").collapse(
          "hide"
        );
      }
    );
  },

  isTooltip: () => {
    setTimeout(() => {
      document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((tooltipTriggerEl) => {
        const trigger =
          tooltipTriggerEl.getAttribute("data-bs-trriger") === "click" ? "click" : "hover";
        const tooltip = new bootstrap.Tooltip(tooltipTriggerEl, { trigger });

        if (trigger !== "click") return;
        // 툴팁 레이어에 닫기 버튼 추가
        const closeButton = document.createElement("button");
        closeButton.classList.add("tooltip-close-button");
        closeButton.innerHTML = "닫기"; // 닫기 아이콘 (X) 추가

        tooltipTriggerEl.addEventListener("shown.bs.tooltip", () => {
          const tooltipId = tooltipTriggerEl.getAttribute("aria-describedby");
          const tooltipElement = document.getElementById(tooltipId);
          if (tooltipElement) {
            tooltipElement.querySelector(".tooltip-inner").classList.add("tooltip-close");
            tooltipElement.querySelector(".tooltip-inner").prepend(closeButton);

            // 닫기 버튼 클릭 시 툴팁 닫기
            closeButton.addEventListener("click", () => {
              tooltip.hide();
            });
          }
        });
      });
    }, 500);
  },

  truncateByCharacters: () => {
    return (text, maxLength) => {
      if (text.length <= maxLength) {
        return text;
      }
      return text.slice(0, maxLength) + "...";
    };
  },

  isTopMove: () => {
    const topMoveDiv = `
      <div class="top-move">
        <button type="button" class="btn-top">
          <img src="/assets/images/common/icon_top.svg" alt="위로 이동하기" />
        </button>
      </div>`;

    // contents 내부에 추가
    $("#contents").append(topMoveDiv);

    const topBtn = $(".top-move .btn-top");
    const speed = 600;
    // topBtn 버튼이 존재할 때만 실행
    if (topBtn.length) {
      var isScrolling; // 스크롤 타이머 변수

      // 스크롤이 발생할 때
      $(window).scroll(function () {
        clearTimeout(isScrolling); // 타이머 초기화

        // 스크롤 중에는 버튼 숨기기
        topBtn.fadeOut(speed);

        // 스크롤이 멈추면 실행
        isScrolling = setTimeout(function () {
          if ($(window).scrollTop() > 100) {
            topBtn.fadeIn(speed);
          }
        }, speed); // 600ms 후에 버튼 나타내기
      });

      // 버튼 클릭 시
      topBtn.click(function () {
        $("html, body").animate({ scrollTop: 0 }, 0);
        return false;
      });
    }
  },
};

$(function () {
  // html include를 위한 임시 함수
  //UI.htmlIncludes();

  // Loading sample
  UI.pageLoading();

  // LNB
  UI.lnb();

  // Input Close
  UI.isInputClose();

  // selectbox custom
  UI.isSelectCustom();

  // tabs
  UI.isTabs();

  // datepicker
  UI.inputDatePicker();
  UI.buttonDatePicker();

  // tooltip
  UI.isTooltip();

  // 위로 가기 버튼
  UI.isTopMove();

  // dataTable
  dataTableOptions = UI.dataTable();

  // alert
  showAlert = UI.isAlert();

  // toast
  showToast = UI.isToast();

  // 글자 자르기
  isTruncateByCharacters = UI.truncateByCharacters();
});
