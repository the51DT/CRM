/*****************************************************************************
* HTML 문서 로드 이벤트
*****************************************************************************/
$(document).ready(function(){
    $("body").append("<form id='export-form'></form>");
});
/*****************************************************************************
* Ajax 통신 POST, GET
*****************************************************************************/
function fnPost(_url, _param, _async, _type){

	if(!_type){_type = "post";}

	return $.ajax({
				url: _url,
				data: JSON.stringify(_param),
				async: _async,
				type: _type,
				contentType : "application/json;charset=UTF-8"
			}).done(function(responseData, status, xhr){

			});
}

function fnGet(_url, _param, _async){
	return $.ajax({
				url: _url,
				data: _param,
				async: _async,
				type: "get"
			}).done(function(responseData, status, xhr){

			});
}
/*****************************************************************************
* form 데이터 바인딩
*****************************************************************************/
function formBind(_formId, _data){
	for(var name in _data){
		//폼안에 있는 개체에 데이터를 넣어준다.
		$(_formId).find("input, select, textarea").each(function() {
			if($(this).attr("id") == name){
				$(this).val(_data[name]);
			}
		});
	};
}
/*****************************************************************************
 *	isEmpty 널체크
******************************************************************************/
function isEmpty(value){
	if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
		return true;
	}else{
		return false;
	}
}
/*****************************************************************************
* form 데이터를 Object 형태로 변환
******************************************************************************/
jQuery.fn.serializeObject = function() {
	var obj = null;
	try {
		if(this[0].tagName && this[0].tagName.toUpperCase() == "FORM" ) {
			var arr = this.serializeArray();
	        if(arr){ obj = {};
	        jQuery.each(arr, function() {
	        	obj[this.name] = $.trim(this.value);});
	        }
	    }
	}catch(e) {
	    alert(e.message);
	}finally {}
	return obj;
}
/*****************************************************************************
* 엑셀 다운로드
******************************************************************************/
function fnExcelDown(_url, _title, _table, params, _Reason) {

    var columnCodeArray = [];
    var columnNameArray = [];
    var conlumnAlignArray = [];

    /* 테이블 컬럼 루프 */
    $("#"+_table).find("thead > tr > th").each(function(){
		if(!isEmpty($(this).attr("id"))){
	        columnCodeArray.push($(this).attr("id"));
	        columnNameArray.push($(this).text());
	        conlumnAlignArray.push($(this).attr("align"));
		}
	});

	/* 업로드 진행전 권한체크 */
	var options = {};
	options.fileName = _title;
	options.fieldKeys = columnCodeArray;
	options.labels = columnNameArray;
	options.align =  conlumnAlignArray;

	var vForm = $("#export-form");
	var hidden = '<input type="hidden" name="excelData" id="excelData">';
	vForm.html(hidden);
	var $hidden = $("#excelData");
	$hidden.val(JSON.stringify(options));

	var subStr= '<input type="hidden" name="fileName" value="'+_title+'">';
	var reason = '<input type="hidden" name="Reason" value="'+_Reason+'">';
	vForm.append(reason);
	vForm.append(subStr);
	for (key in params) {
		subStr= '<input type="hidden" name="'+key+'" value="'+params[key]+'">';
		vForm.append(subStr);
	}

	vForm.attr("action", _url);
	vForm.attr("method", "post");
	vForm.trigger("submit");
}
/*****************************************************************************
* resize 이벤트 강제 발생 : 헤더 틀어짐 방지 목적
******************************************************************************/
function triggerResizeEvent(_time){
    setTimeout(function(){
      window.dispatchEvent(new Event('resize'));
    }, _time);
}
/*****************************************************************************
* 천단위 , 추가
******************************************************************************/
function addCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/*****************************************************************************
* 텍스트 유효성 겁사
******************************************************************************/
function containsScript(text) {
  // 스크립트 관련 패턴을 검출하는 정규식
  const scriptPattern = /<\s*script[^>]*>.*?<\s*\/\s*script\s*>/gi;  // <script> 태그
  const eventHandlerPattern = /<[^>]*\s(on\w+)\s*=\s*["'].*?["']/gi;  // 모든 이벤트 핸들러 (onmouseover 포함)
  const javascriptProtocolPattern = /javascript:/gi;  // javascript: URL 프로토콜
  const encodedScriptPattern = /(&#x3C;|&lt;)\s*script/gi;  // 인코딩된 스크립트 태그
  const imgTagPattern = /<\s*img[^>]*>/gi;  // <img> 태그
  const malformedTagPattern = /<\s*\w+[^>]*\/?\s*>/gi;  // 잘못된 태그 구문
  const plaintextTagPattern = /<\/?\s*plaintext[^>]*>/gi;  // <plaintext> 태그
  const suspiciousTagPattern = /<\/?\w*[^>]*[\/|\\|>]/gi;  // 의심스러운 구문 (예: /|>, <태그/onmouseover)
  const specificEventsPattern = /\bon(mouseover|error)\b\s*=\s*["'].*?(prompt|alert|window\.open).*?["']/gi;  // onmouseover, onerror에 특정 함수 호출 감지
  const functionCallsPattern = /\b(prompt|alert|window\.open)\b\s*\(.*?\)/gi;  // prompt, alert, window.open 함수 호출
  const malformedAttributePattern = /\b(on\w+)\s*=\s*['"]{2,}.*?['"]{2,}/gi;  // 속성에 여분의 인용부호 감지
  const bbcodeEventPattern = /\[\w+.*?\bon\w+\s*=\s*["'].*?(alert|prompt|window\.open).*?["'].*?\]/gi;  // BBCode 안의 이벤트 핸들러 감지

  return (
    scriptPattern.test(text) ||
    eventHandlerPattern.test(text) ||
    javascriptProtocolPattern.test(text) ||
    encodedScriptPattern.test(text) ||
    imgTagPattern.test(text) ||
    malformedTagPattern.test(text) ||
    plaintextTagPattern.test(text) ||
    suspiciousTagPattern.test(text) ||
    specificEventsPattern.test(text) ||
    functionCallsPattern.test(text) ||
    malformedAttributePattern.test(text) ||
    bbcodeEventPattern.test(text)
  );
}

function hasSpecialCharacters(str){
    const regex = /[^a-zA-Z0-9\uAC00-\uD7A3-]/;
    return regex.test(str);
}
/*****************************************************************************************************************************************************
 *	setTable 데이터를 표현할 테이블을 새로 정의한다.
 *  @ _url : 컨트롤에 매핑되는 url 주소.
 *  @ _form : 데이터를 조회하기 위한 조건데이터들이 들어가있는 폼 아이디.
 *  @ _pageYn : 페이징 사용여부
 *  @ _serverSide : 서버페이지 사용유무 (true, false)
*****************************************************************************************************************************************************/
jQuery.fn.setTable = function(_url, _form, _pageYn, _serverSide, _orderby){

	var vObj = $(this);
	var vArrayColumns = new Array();
	var vArrayDefs = new Array();
	var _ObjId = $(vObj).attr("id");

	vObj.find("th").each(function(index){
/*		$(this).addClass("dt-head-center");*/
		var vColumns = {};
		var vDefs = {};

		vColumns.data = $(this).attr("id");

		vDefs.targets = index;

		vArrayDefs.push(vDefs);
		vArrayColumns.push(vColumns);
	});

	if(_pageYn==null){_pageYn=false;}
	if(_serverSide==null){_serverSide=false; }

	var _DataTable = {
			scrollY: 'auto',
	        scrollCollapse: false,
	        pageResize: true,
	        serverSide : _serverSide,
	        processing: _serverSide,
	        responsive : false, /*숨겨진 컬럼 나오게*/
	        ordering: false, /*컬럼별 정렬을 쓰는지 정의한다*/
	        language: { url: '/Language/ko.json'  /*한국어 패키지*/ },
			recordsTotal : false,
	        lengthChange: true, /* 건수보기 사용/미사용 */
			lengthMenu : [ 10, 25, 50, 100], /* 건수보기 단위설정 */
	        displayLength: 10, /* 한페이지에 표시할 건수 */
	        searching: false, /* 검색 search 사용/미사용 */
	        paging: _pageYn, /* 페이지사용 여부 */
			destroy: true, /*재선언시 기존 테이블 삭제 여부*/
			autoWidth: false,
	        ajax :{
				url : _url,
				type : "get",
	            data : function () {
	                return $(_form).serializeObject();
	            },
				dataSrc: function(data){
					if(data.code && data.code!='ok'){
						alert(data.message);
					}
					return data;
				}
			},
			select: {
	        	style: 'single'
	        },
	        columns : vArrayColumns,
	        columnDefs: vArrayDefs,
			initComplete: function() {
				fnComplate(_ObjId);
	      	}
	    }

	if(!_url){
		_DataTable.ajax = null;
//		_DataTable.scrollY = $(vObj).closest("dd").height()+100;
//		_DataTable.scrollCollapse = false;
	}

	if(_serverSide){
		_DataTable.ajax	= {
			url : _url,
			type : "get",
			data : function(res){
	            res.start = $(vObj).DataTable().page.info().page * $(vObj).DataTable().page.len();   // 페이지 번호, DataTable().page.info().page은 0임
	            res.length = $(vObj).DataTable().page.len();   // 페이지 사이즈, 한 페이지에 몇개의 row인지
	            var vParam = $(_form).serializeObject();
				$.each(vParam, function(index, value){
					res[index] = value;
				});
			},
			dataSrc: function(res){
				var data = res.list;

				if(res.code && res.code!='ok'){
					alert(res.message);
					res.recordsFiltered = 0;
					res.recordsTotal = 0;
					return null;
				}

				if(data.length > 0){
					res.recordsFiltered = data[0].total;
					res.recordsTotal = data[0].total;
				}else{
					res.recordsFiltered = 0;
					res.recordsTotal = 0;
				}
				return data;
			}
		}
	}

	var objTable = vObj.DataTable(_DataTable);


    return objTable;
}

/*****************************************************************************
* 차트 그래프 설정 chart.js 활용
* 고객유형 그래프
******************************************************************************/
var custTypeChart;

function barLineChart(_ChartName, _Type, _Title, _Ladels ,_Data){
	var ctx = document.getElementById(_ChartName);

	if(custTypeChart){
		custTypeChart.destroy();
	}

    // Tooltip variables
    let tooltipVisible = false;
    let tooltipX = 0;
    let tooltipY = 0;

	// 커스텀 타이틀과 툴팁을 위한 플러그인 정의
    const customTitlePlugin1 = {
        id: 'customTitlePlugin1',
        beforeDraw: function(chart) {
            const {ctx, chartArea: {top, left, right, bottom}, width} = chart;

            // 좌측 상단 커스텀 타이틀
            ctx.save();
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.font = '16px Arial';
            ctx.fillText('유형별 고객현황', 20, top - 30);
            ctx.restore();

            // 우측 상단 커스텀 타이틀
            ctx.save();
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            ctx.font = '16px Arial';
            ctx.fillText('※ 월누적조치율(%)', width - 20, top - 30);
            ctx.restore();

            if (tooltipVisible) {
                const tooltipWidth = 300;
                const tooltipHeight = 25;

                ctx.save();
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(tooltipX - tooltipWidth, tooltipY - tooltipHeight, tooltipWidth, tooltipHeight);
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText('월누적조치율 = 월 누적 결과 등록 건 ÷ 월 누적 발생 건', tooltipX - tooltipWidth / 2, tooltipY - tooltipHeight / 2);
                ctx.restore();
            }
        }
    };

    const customLegend = {
        id: 'customLegend',
        afterUpdate: (chart) => {
            const legend = chart.legend;
            legend.legendItems.forEach((item) => {
                if (item.text === '월누적조치율') {
                    item.lineWidth = 5;
                    item.strokeStyle = 'black';
                    item.pointStyle = 'line';
                }
            });
        }
    };

	custTypeChart = new Chart(ctx, {
	  type: _Type,
	  data: _Data,
         options: {
            responsive: true,
            layout: {
              padding: {
                  top: 50  // 상단 패딩을 50px로 설정하여 타이틀이 짤리지 않도록 함
              }
            },
            scales: {
                x : {
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                      drawOnChartArea: false
                    },
                     border: {
                        display: false
                     }
                },
                y1: {
                    stacked: true,
                    position : 'left',
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: true,
                        color: 'rgba(0, 0, 0, 0.1)',
                        lineWidth: 2
                    },
                    border: {
                        dash: [10, 10],
                        display: false
                    }
                },
                y2:{
                    stacked: false,
                    position : 'right',
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false
                    },
                    border: {
                        display: false
                    },
                    min : 0,
                    max : 100,
                    ticks: {
                        stepSize: 10,
                        callback: function(value, index, values) {
                        return value + '%';
                        }
                    }
                }
            },
            onClick: function(event, elements) {
                // 클릭된 요소가 있는지 확인
                if (elements.length > 0) {
                    // elements[0]는 클릭된 요소
                    var element = elements[0];
                    var datasetIndex = element.datasetIndex;
                    var index = element.index;
                    var label = this.data.labels[index];
                    var value = this.data.datasets[datasetIndex].data[index];
                    let bizbrNm = $('#GroupText').text().trim();
                    clickDate = label;
                    var year = label.substring(0, 2);
                    var month = label.substring(3, 5);

                    if (month.endsWith("월")) {
                        month = month.substring(0, month.length - 1);
                    }

                    if (month.length === 1) {
                        month = "0" + month;
                    }
                    var formattedYear = "20" + year;
                    var formattedDate = formattedYear + "-" + month + "-01";

                    label = label.replace('년', '').replace('월', '');
                    excelLabel = formattedDate;
                    excelLabelDay = formattedDate;
                    excelLabel2 = year + month;

                    $.ajax({
                        url: '/CustTypeStats/getDayList',  // 필요한 URL로 변경
                        data: {
                            "label" : formattedDate,
                            "bizbrNm" : bizbrNm
                        },
                        success: function(response) {
                            response.type = 'click';
                            updateTable(response);
                        }
                    });
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 40, // 각 항목 간의 패딩 조정
                        color : 'black',
                        font: {
                            size: 18, // 폰트 크기 설정
                            weight: 'bold'
                        },
                        usePointStyle: true,
                        boxWidth: 10, // 포인트 크기 조정
                        boxHeight: 14 // 포인트 높이 설정 (필요시 추가)
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return '';
                        },
                        label: function(tooltipItem) {

                            var datasetLabel = tooltipItem.dataset.label || '';
                            if(datasetLabel == "월누적조치율"){

                                var value = tooltipItem.dataIndex;
                                var dataPercent = tooltipItem.dataset.dataPercent[value];
                                var AllSum = tooltipItem.dataset.AllSum[value];
                                return [
                                        "전체 합계: " + addCommas(AllSum) + "건",
                                        "월누적조치율: " + dataPercent +"%"
                                ];
                            }else{
                                var datasetLabel = tooltipItem.dataset.label || '';
                                var value = tooltipItem.dataIndex;

                                var custPercent = tooltipItem.dataset.custPercent[value];
                                var result = tooltipItem.dataset.result[value];
                                var resultPercent = tooltipItem.dataset.resultPercent[value];

                                return [
                                        "유형: " + datasetLabel,
                                        "전체유형대비 비중: " + custPercent +"%",
                                        "결과등록: " + addCommas(result) + "건",
                                        "월누적조치율: " + resultPercent + "%"
                                ];
                            }
                        }
                    },
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: {
                        size: 16,
                        weight: 'bold',
                        color: '#ffffff'
                    },
                    bodyFont: {
                        size: 14,
                        color: '#ffffff'
                    },
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderWidth: 1,
                    displayColors: false
                }
            },
            hover: {
                animationDuration: 0
            }
        },
        plugins: [customTitlePlugin1, customLegend]
	});

    // Add event listener for mousemove to detect hover over the custom title
    ctx.addEventListener('mousemove', function(event) {
        const {offsetX, offsetY} = event;

        const rightTitleX = ctx.width - 40; // Same as the x coordinate in the plugin
        const rightTitleY = 20; // Same as the y coordinate in the plugin
		
		const points = custTypeChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
		
		if (points.length) {
            // 커서를 버튼처럼 보이게 설정
            event.target.style.cursor = 'pointer';
        } else {
            event.target.style.cursor = 'default';
        }
		
        // Check if mouse is over the right title
        if (offsetX >= rightTitleX - 100 && offsetX <= rightTitleX && offsetY >= rightTitleY && offsetY <= rightTitleY + 20) {
            tooltipVisible = true;
            tooltipX = offsetX;
            tooltipY = offsetY;
        } else {
            tooltipVisible = false;
        }

        custTypeChart.update();
    });

	window.addEventListener('resize', function() {
	    custTypeChart.resize(); // Chart.js의 내장 함수를 사용하여 그래프 크기를 조절합니다.
	});
}
/*****************************************************************************
* 차트 그래프 설정 chart.js 활용
* 미처리 현황 그래프 1
******************************************************************************/
var unhndldChart1;

function doughnutChart(_ChartName, _Type, _Title, _Ladels ,_Data){
    var ctx = document.getElementById(_ChartName);

        if(unhndldChart1){
            unhndldChart1.destroy();
        }
        var hasData = true;

        // 데이터가 없는 경우 기본 데이터를 설정
        if (!_Data || !_Data.datasets || _Data.datasets.length === 0 || _Data.datasets[0].data.length === 0) {
            _Data = {
                labels: ["데이터없음"],
                datasets: [{
                    data: [100],
                    backgroundColor: ["#808080"],
                    borderWidth: 1
                }]
            };
            hasData = false;
        }

        unhndldChart1 = new Chart(ctx, {
            type: _Type,
            data: _Data ,
            options: {
                 responsive: true,
                 maintainAspectRatio: false,
                 plugins: {
                     legend: {
                         position: 'bottom',
                     },
                     tooltip: {
                         enabled: hasData,  // 데이터가 없으면 툴팁 비활성화
                         callbacks: {
                             label: function(tooltipItem) {
                                 return tooltipItem.label + ': ' + tooltipItem.raw + '%';
                             }
                         }
                     },
                     title: {
                          display: true,
                          text: _Title
                     }
                 }
            }
        });
    window.addEventListener('resize', function() {
        unhndldChart1.resize(); // Chart.js의 내장 함수를 사용하여 그래프 크기를 조절합니다.
    });
}
/*****************************************************************************
* 차트 그래프 설정 chart.js 활용
* 미처리 현황 그래프 2
******************************************************************************/
var unhndldChart2;

function horizontalBarChart(_ChartName, _Type, _Title, _Ladels ,_Data, _Stacked){
    var ctx = document.getElementById(_ChartName);

    	if(unhndldChart2){
    		unhndldChart2.destroy();
    	}

    	unhndldChart2 = new Chart(ctx, {
              type: _Type,
              data: _Data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        scales: {
                            x: {
                                beginAtZero: true,
                                stacked: _Stacked
                            },
                             y: {
                                 stacked: _Stacked
                             }
                        },
                        plugins: {
                            legend: {
                                position: 'bottom'
                            },
                            title: {
                                display: true,
                                text: _Title
                            }
                        }
                    }
            });
    window.addEventListener('resize', function() {
        unhndldChart2.resize(); // Chart.js의 내장 함수를 사용하여 그래프 크기를 조절합니다.
    });
}
/*****************************************************************************
* 차트 그래프 설정 chart.js 활용
* 미처리 현황 그래프 3
******************************************************************************/
var unhndldChart3;

function horizontalBarChart2(_ChartName, _Type, _Title, _Ladels ,_Data, _Stacked){
    var ctx = document.getElementById(_ChartName);

        if(unhndldChart3){
            unhndldChart3.destroy();
        }

        unhndldChart3 = new Chart(ctx, {
              type: _Type,
              data: _Data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        scales: {
                            x: {
                                beginAtZero: true,
                                stacked: _Stacked
                            },
                             y: {
                                 stacked: _Stacked
                             }
                        },
                        plugins: {
                            legend: {
                                position: 'bottom'
                            },
                            title: {
                                display: true,
                                text: _Title
                            }
                        }
                    }
            });
    window.addEventListener('resize', function() {
        unhndldChart3.resize(); // Chart.js의 내장 함수를 사용하여 그래프 크기를 조절합니다.
    });
}
/*****************************************************************************
* 차트 그래프 설정 chart.js 활용
* 고객 장애 통계 월별 그래프
******************************************************************************/
var custFltStatsChart1;

function lineChart1(_ChartName, _Type, _Title, _Ladels ,_Data){
    var ctx = document.getElementById(_ChartName);

        if(custFltStatsChart1){
            custFltStatsChart1.destroy();
        }

        custFltStatsChart1 = new Chart(ctx, {
              type: _Type,
              data: _Data,
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    drawOnChartArea: true,
                                    color: 'rgba(0, 0, 0, 0.1)',
                                    lineWidth: 2
                                },
                                border: {
                                    dash: [10, 10],
                                    display: false
                                }
                            },
                            x:{
                                beginAtZero: true,
                                grid: {
                                  drawOnChartArea: false
                                },
                                 border: {
                                    display: false
                                 }
                              }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                padding: 40, // 각 항목 간의 패딩 조정
                                color : 'black',
                                font: {
                                    size: 18, // 폰트 크기 설정
                                    weight: 'bold'
                                },
                                usePointStyle: true,
                                boxWidth: 10, // 포인트 크기 조정
                                boxHeight: 14 // 포인트 높이 설정 (필요시 추가)
                            }
                        },
                        tooltip: {
                            callbacks: {
                                title: function(context){
                                    var index = context[0].dataIndex;
                                    var label = context[0].chart.data.labels[index];
                                    var title = '장애발생월:' + label;
                                    return title;
                                },
                                label: function(context) {
                                    var label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += addCommas(context.parsed.y);
                                    }
                                    return label;
                                },
                                 afterLabel: function(context) {
                                     var tooltipData = [];
                                     context.chart.data.datasets.forEach(function(dataset) {
                                         if (dataset.label !== context.dataset.label) {
                                             if (dataset.data[context.dataIndex] !== undefined) {
                                                 tooltipData.push(dataset.label + ': ' + addCommas(dataset.data[context.dataIndex]));
                                             }
                                         }
                                     });
                                     return tooltipData.join('\n');
                                 }
                            }
                        }
                    },
                    onClick: function(event, elements) {
                        // 클릭된 요소가 있는지 확인
                        if (elements.length > 0) {
                            // elements[0]는 클릭된 요소
                            var element = elements[0];
                            var datasetIndex = element.datasetIndex;
                            var index = element.index;
                            var label = this.data.labels[index];
                            var value = this.data.datasets[datasetIndex].data[index];
                            let bizbrNm = $('#GroupText').text().trim();
                            clickDate = label;
                            let formattedText = label.replace(/(\d+년)(\d+)월/, function(match, year, month) {
                                return year + (month.length === 1 ? '0' + month : month) + "월";
                            });
                            label = formattedText.replace('년', '').replace('월', '');
                            dayExcelLabel = '20' + label;
                            $.ajax({
                                url: '/CustFltStats/getDayList',  // 필요한 URL로 변경
                                data: {
                                    "label" : label,
                                    "bizbrNm" : bizbrNm
                                },
                                success: function(response) {
                                    response.type = 'click';
                                    updateTable(response);
                                }
                            });
                        }
                    },
                    hover: {
                        animationDuration: 0
                    }
              }
	    });

	ctx.addEventListener('mousemove', function(event) {
        const points = custFltStatsChart1.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
        if (points.length) {
            // 커서를 버튼처럼 보이게 설정
            event.target.style.cursor = 'pointer';
        } else {
            event.target.style.cursor = 'default';
        }
        custFltStatsChart1.update();
	});

	window.addEventListener('resize', function() {
	    custFltStatsChart1.resize(); // Chart.js의 내장 함수를 사용하여 그래프 크기를 조절합니다.
	});
}

/*****************************************************************************
* 차트 그래프 설정 chart.js 활용
* 고객 장애 통계 그래프
******************************************************************************/
var custFltStatsChart2;

function lineChart2(_ChartName, _Type, _Title, _Ladels ,_Data){
    var ctx = document.getElementById(_ChartName);

        if(custFltStatsChart2){
            custFltStatsChart2.destroy();
        }

        custFltStatsChart2 = new Chart(ctx, {
              type: _Type,
              data: _Data,
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    drawOnChartArea: true,
                                    color: 'rgba(0, 0, 0, 0.1)',
                                    lineWidth: 2
                                },
                                border: {
                                    dash: [10, 10],
                                    display: false
                                }
                            },
                            x:{
                                beginAtZero: true,
                                grid: {
                                  drawOnChartArea: false
                                  },
                                border: {
                                   display: false
                                }
                              }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                padding: 40, // 각 항목 간의 패딩 조정
                                color : 'black',
                                font: {
                                    size: 18, // 폰트 크기 설정
                                    weight: 'bold'
                                },
                                usePointStyle: true,
                                boxWidth: 10, // 포인트 크기 조정
                                boxHeight: 14 // 포인트 높이 설정 (필요시 추가)
                            }
                        },
                        tooltip: {
                            callbacks: {
                                title: function(context){
                                    var index = context[0].dataIndex;
                                    var label = context[0].chart.data.labels[index];
                                    var title = '장애발생일:' +clickDate.split('년')[0] + '-' + label.replace('월', '-').replace('일', '');
                                    return title;
                                },
                                label: function(context) {
                                    var label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += addCommas(context.parsed.y);
                                    }
                                    return label;
                                },
                                 afterLabel: function(context) {
                                     var tooltipData = [];
                                     context.chart.data.datasets.forEach(function(dataset) {
                                         if (dataset.label !== context.dataset.label) {
                                             if (dataset.data[context.dataIndex] !== undefined) {
                                                 tooltipData.push(dataset.label + ': ' + addCommas(dataset.data[context.dataIndex]));
                                             }
                                         }
                                     });
                                     return tooltipData.join('\n');
                                 }
                            }
                        }
                    },
                    hover: {
                        animationDuration: 0
                    }
              }
	    });

	window.addEventListener('resize', function() {
	    custFltStatsChart2.resize(); // Chart.js의 내장 함수를 사용하여 그래프 크기를 조절합니다.
	});
}
/*****************************************************************************
* 차트 그래프 설정 chart.js 활용
* 고객유형 그래프2
******************************************************************************/
var custTypeChart2;

function barLineChart2(_ChartName, _Type, _Title, _Ladels ,_Data){
	var ctx = document.getElementById(_ChartName);

	if(custTypeChart2){
		custTypeChart2.destroy();
	}

    // Tooltip variables
    let tooltipVisible = false;
    let tooltipX = 0;
    let tooltipY = 0;

    const customTitlePlugin = {
        id: 'customTitlePlugin',
        beforeDraw: function(chart) {
            const {ctx, chartArea: {top, left, right}} = chart;

            // Draw the top-left title
            ctx.save();
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.font = '16px Arial';
            ctx.fillText('유형별 고객현황', left - 30, top - 30);  // Adjust the position as needed
            ctx.restore();

            // Draw the top-right title
            const rightTitleX = right + 10;
            const rightTitleY = top - 30;
            ctx.save();
            ctx.textAlign = 'right';
            ctx.textBaseline = 'top';
            ctx.font = '16px Arial';
            ctx.fillText('※ 당일조치율(%)', rightTitleX, rightTitleY);
            ctx.restore();

            if (tooltipVisible) {
                const tooltipWidth = 300;
                const tooltipHeight = 25;

                ctx.save();
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                // Draw tooltip to the left of the cursor
                ctx.fillRect(tooltipX - tooltipWidth, tooltipY - tooltipHeight, tooltipWidth, tooltipHeight);
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText('당일조치율= 당일발생 중 당일 결과 등록 건 ÷ 당일 발생 건', tooltipX - tooltipWidth / 2, tooltipY - tooltipHeight / 2);
                ctx.restore();
            }
        }
    };

    const customLegend = {
        id: 'customLegend',
        afterUpdate: (chart) => {
            const legend = chart.legend;
            legend.legendItems.forEach((item) => {
                if (item.text === '당일조치율') {
                    item.lineWidth = 5;
                    item.strokeStyle = 'black';
                    item.pointStyle = 'line';
                }
            });
        }
    };

	custTypeChart2 = new Chart(ctx, {
	  type: _Type,
	  data: _Data,
         options: {
            responsive: true,
            layout: {
              padding: {
                  top: 50  // 상단 패딩을 50px로 설정하여 타이틀이 짤리지 않도록 함
              }
            },
            scales: {
                x : {
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                      drawOnChartArea: false
                    },
                     border: {
                        display: false
                     }
                },
                y1: {
                    position : 'left',
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: true,
                        color: 'rgba(0, 0, 0, 0.1)',
                        lineWidth: 2
                    },
                    border: {
                        dash: [10, 10],
                        display: false
                    }
                },
                y2:{
                    position : 'right',
                    stacked: false,
                    grid: {
                        drawOnChartArea: false
                    },
                    border: {
                        display: false
                    },
                    min : 0,
                    max : 100,
                    ticks: {
                        stepSize: 10,
                        callback: function(value, index, values) {
                        return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 40, // 각 항목 간의 패딩 조정
                        color : 'black',
                        font: {
                            size: 18, // 폰트 크기 설정
                            weight: 'bold'
                        },
                        usePointStyle: true,
                        boxWidth: 10, // 포인트 크기 조정
                        boxHeight: 14 // 포인트 높이 설정 (필요시 추가)
                    }
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        title: function(tooltipItems) {
                            return '';
                        },
                        label: function(tooltipItem) {

                            var datasetLabel = tooltipItem.dataset.label || '';
                            if(datasetLabel == "당일조치율"){

                                var value = tooltipItem.dataIndex;
                                var dataPercent = tooltipItem.dataset.dataPercent[value];
                                var AllSum = tooltipItem.dataset.AllSum[value];
                                return [
                                        tooltipItem.label,
                                        "전체 합계: " + addCommas(AllSum) + "건",
                                        "당일조치율: " + dataPercent +"%"
                                ];
                            }else{
                                var datasetLabel = tooltipItem.dataset.label || '';
                                var value = tooltipItem.dataIndex;

                                var custPercent = tooltipItem.dataset.custPercent[value];
                                var result = tooltipItem.dataset.result[value];
                                var resultPercent = tooltipItem.dataset.resultPercent[value];

                                return [
                                        "유형: " + datasetLabel,
                                        "전체유형대비 비중: " + custPercent +"%",
                                        "결과등록: " + addCommas(result) + "건",
                                        "당일조치율: " + resultPercent + "%"
                                ];
                            }
                        }
                    },
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: {
                        size: 16,
                        weight: 'bold',
                        color: '#ffffff'
                    },
                    bodyFont: {
                        size: 14,
                        color: '#ffffff'
                    },
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderWidth: 1,
                    displayColors: false
                }
            },
            hover: {
                animationDuration: 0
            },
            legend: {
                display: false
            }
        },
        plugins: [customTitlePlugin, customLegend]
	});

    // Add event listener for mousemove to detect hover over the custom title
    ctx.addEventListener('mousemove', function(event) {
        const {offsetX, offsetY} = event;

        const rightTitleX = ctx.width - 40; // Same as the x coordinate in the plugin
        const rightTitleY = 20; // Same as the y coordinate in the plugin

        // Check if mouse is over the right title
        if (offsetX >= rightTitleX - 100 && offsetX <= rightTitleX && offsetY >= rightTitleY && offsetY <= rightTitleY + 20) {
            tooltipVisible = true;
            tooltipX = offsetX;
            tooltipY = offsetY;
        } else {
            tooltipVisible = false;
        }

        custTypeChart2.update();
    });

	window.addEventListener('resize', function() {
	    custTypeChart2.resize(); // Chart.js의 내장 함수를 사용하여 그래프 크기를 조절합니다.
	});
}