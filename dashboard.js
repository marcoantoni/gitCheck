var urlApi 		= "https://api.github.com/";
var urlProject 	= "https://github.com/marcoantoni/programacaoII";
var user = "";
var repo = "";

urlSplit(urlProject);

$( "#buscar" ).click(function() {
  alert( "Handler for .blur() called." );
  urlProject = $("#url").val();
  console.log(urlProject);
});

function urlSplit(url){
	var segments = url.split('/');
	user = segments[3];
	repo = segments[4];
}

function convertTimeStamp(unixtimestamp){
	// Months array
	var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	// Convert timestamp to milliseconds
	var date = new Date(unixtimestamp*1000);
	// Year
	var year = date.getFullYear();
	// Month
	var month = months_arr[date.getMonth()];
	// Day
	var day = date.getDate();
	// Display date time in MM-dd-yyyy h:m:s format
	var convdataTime = day + '/' + month+ '/' +year;
	return convdataTime;
}

console.log(urlApi + "repos/" + user + "/" + repo + "/stats/contributors");

$.ajax({
	type: "GET",
	url: urlApi + "repos/" + user + "/" + repo + "/stats/contributors",
	contentType: "application/json",
	dataType: "json",
	data: JSON.stringify({
		"content": "aGVsbG8=",
		"encoding": "utf-8",
		"x-requested-with": "xhr" 
	})
})
.done(function(data) {
	//console.log(data);
	var totalCommits = 0;
	var linhasAddSemana = [];
	var linhasDelSemana = [];
	var commitsSemana = [];
	var semanas = [];
	$.each( data, function( key, value ) {
		totalCommits += data[key].total;
		$('#contribuidores').append("<p>" + data[key].author['login'] + " (" + data[key].total + ")</p>" );

		for (let i=0; i < data[key].weeks.length; i++){
			if (key == 0){
				linhasAddSemana[i] = data[key].weeks[i].a;
				linhasDelSemana[i] = data[key].weeks[i].d;
				commitsSemana[i] = data[key].weeks[i].c;
				semanas[i] = convertTimeStamp(data[key].weeks[i].w)
			} else {
				linhasAddSemana[i] = parseInt(linhasAddSemana[i]) + parseInt(data[key].weeks[i].a);
				linhasDelSemana[i] = parseInt(linhasDelSemana[i]) + parseInt(data[key].weeks[i].d);
				commitsSemana[i] = parseInt(commitsSemana[i]) + parseInt(data[key].weeks[i].c);
			}
		}
	});

	var myChart = Highcharts.chart('graphics', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Dados do GitHub'
        },
        yAxis: {
            title: {
                text: 'Estatistícas'
            }
        },
        series: [{
            name: 'Linhas adicionadas',
        }, {
            name: 'Linhas removidas',
        }, {
        	name: 'Commits'
        }]
    });

	var semanas2 = []; 
	for (let i=0; i < semanas.length; i++){
		if (linhasAddSemana[i] > 0 || linhasDelSemana[i] > 0 || commitsSemana[i] > 0){
			myChart.series[0].addPoint(linhasAddSemana[i]);
			myChart.series[1].addPoint(linhasDelSemana[i]);
			myChart.series[2].addPoint(commitsSemana[i]);
			semanas2.push(semanas[i]);
		}
	}

	myChart.xAxis[0].update({
    	categories: semanas2
	});

	$("#totalCommits").append(totalCommits);
})
.fail(function() {
	alert( "error" );
})
console.log(urlApi + "repos/" + user + "/" + repo + "/commits");
$.ajax({
	type: "GET",
	url: urlApi + "repos/" + user + "/" + repo + "/commits",
	contentType: "application/json",
	dataType: "json",
	data: JSON.stringify({
		"content": "aGVsbG8=",
		"encoding": "utf-8",
		"x-requested-with": "xhr" 
	})
})
.done(function(data) {
	var date = data[0].commit.author.date;
	console.log(date);
	$('#lastcommit').append(date);

	$.each( data, function(key, value) {
		var markup = "<tr>";
		markup +="<td>"+data[key].commit.author.name+"</td>";
		markup +="<td>"+data[key].commit.message+"</td>";
		markup +="<td>"+data[key].commit.author.date+"</td>";
		markup +="<td><a href='" + data[key].html_url + "'><span class='ls-ico-link'></span></a></td>";
		
        $("#resumoCommits tbody").append(markup);
		console.log("nome " + data[key].commit.author.name);
		console.log("date " + data[key].commit.author.date);
		console.log("mensagem " + data[key].commit.message);
	});
})

/*console.log(urlApi + "repos/" + user + "/" + repo + "/stats/code_frequency");
$.ajax({
	type: "GET",
	url: urlApi + "repos/" + user + "/" + repo + "/stats/code_frequency",
	contentType: "application/json",
	dataType: "json",
	data: JSON.stringify({
		"content": "aGVsbG8=",
		"encoding": "utf-8",
		"x-requested-with": "xhr" 
	})
})
.done(function(data) {

	var myChart = Highcharts.chart('graphics', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Número de commits por semana'
        },
        xAxis: {
            categories: []
        },
        yAxis: {
            title: {
                text: 'Número de linhas'
            }
        },
        series: [{
            name: 'Adicionadas',
        }, {
            name: 'Removidas',
        }]
    });

	var semanas = [];
	console.log(data);
    //$.each( data, function( key, value ) {
  //  	console.log("semana " + value['0']);
    //	console.log("add " + value['1']);
    //	console.log("del " + value['2']);
	//});
//	myChart.series[0].addPoint(data[key][1]);
//	myChart.xAxis[0].update({
  //  	categories: semanas
	//});
})
*/