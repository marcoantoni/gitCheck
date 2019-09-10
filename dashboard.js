var urlApi 		= 'https://api.github.com/';
var urlProject 	= 'https://github.com/marcoantoni/fundeb';
var user = '';
var repo = '';

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

	$('#totalCommits').append(totalCommits);
})
.fail(function() {
	alert( "error" );
})

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
		
        $('#resumoCommits tbody').append(markup);
	});
})

// busca todos os issues do repositório
console.log(urlApi + "repos/" + user + "/" + repo + "/issues?state=all");
$.ajax({
	type: "GET",
	url: urlApi + "repos/" + user + "/" + repo + "/issues?state=all",
	contentType: "application/json",
	dataType: "json"
})
.done(function(data) {
	console.log("list issues");
	$.each( data, function(key, value) {
		var markup = '<tr>';
		markup +='<td><a href="#" onclick="getIssue('+value.number+');">#'+value.number+' '+ value.title +'</a>';
		if (value.state == 'open')
			markup += ' <span class="ls-tag-primary">Aberto</span';
		else if (value.state == 'closed')
			markup += ' <span class="ls-tag-info">Fechado</span';
		markup +='</td>';
		markup +='<td>'+value.user.login+'</td>';
		
		markup +='</td>';

		$('#issues').append(markup);
		console.log(value.body);
	});
})

/**
 * Description Busca os dados de um issue e preenche na tabela
 * @param int issue           Id issue do GitHub.
 */
function getIssue(issue){
	console.log(urlApi + "repos/" + user + "/" + repo + "/issues/"+issue);
	$.ajax({
		type: "GET",
		url: urlApi + "repos/" + user + "/" + repo + "/issues/"+issue,
		contentType: "application/json",
		dataType: "json"
	})
	.done(function(data) {
		console.log("list issues");
		// limpando o conteudo do modal
		$('#modalcontent').empty();
		$('#tituloissue').empty();
		
		$('#tituloissue').append('#'+data.number+' ' +data.title + ' ' + data.created_at);
			var markup = '<div class="ls-list">';
				markup += '  <div class="ls-list-content ">';
				markup += '    <div class="col-xs-12 col-md-6">';
				markup += '      <span class="ls-list-label">Autor</span>';
				markup += '      <strong>marcoantoni</strong>';
				markup += '    </div>';
				markup += '    <div class="col-xs-12 col-md-6">';
				markup += '      <span class="ls-list-label">Criado</span>';
				markup += '      <strong>'+data.created_at+'</strong>';
				markup += '    </div>';
				markup += '  </div>';
				markup += '  <div class="ls-list-content ">';
				markup += '    <div class="col-xs-12 col-md-12">';
				markup += '      <span class="ls-list-label">Mensagem</span>';
				markup += '      <p>'+data.body+'</p>';
				markup += '    </div>';
				markup += '  </div>';
				markup += '</div>';
			$('#modalcontent').append(markup);
		locastyle.modal.open("#modalLarge");
		console.log(data);
	})

	// get comentarios issue
	$.ajax({
		type: 'GET',
		url: urlApi + 'repos/' + user + '/' + repo + '/issues/'+issue+'/comments',
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify({
			'content': 'aGVsbG8=',
			'encoding': 'utf-8',
			'x-requested-with': "xhr" 
		})
	})
	.done(function(data) {
		console.log("list issues");
		$.each(data, function(key, value){
			//var markup = '<p>' + value.user.login +'</p>';
			//markup += '<p>' + value.body + '</p><hr>';

			//$('#modalcontent').append( markup);
			var markup = '<div class="ls-list">';
				markup += '  <div class="ls-list-content ">';
				markup += '    <div class="col-xs-12 col-md-6">';
				markup += '      <span class="ls-list-label">Autor</span>';
				markup += '      <strong>'+ value.user.login +'</strong>';
				markup += '    </div>';
				markup += '    <div class="col-xs-12 col-md-6">';
				markup += '      <span class="ls-list-label">Criado</span>';
				markup += '      <strong>'+value.created_at+'</strong>';
				markup += '    </div>';
				markup += '  </div>';
				markup += '  <div class="ls-list-content ">';
				markup += '    <div class="col-xs-12 col-md-12">';
				markup += '      <span class="ls-list-label">Mensagem</span>';
				markup += '      <p>'+value.body+'</p>';
				markup += '    </div>';
				markup += '  </div>';
				markup += '</div>';
			$('#modalcontent').append(markup);
		});
	})
}