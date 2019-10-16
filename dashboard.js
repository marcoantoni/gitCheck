var urlApi 		= 'https://api.github.com/';
var urlProject 	= 'https://github.com/jviriato/acg-front/';
var user = '';
var repo = '';

$( "#buscar" ).click(function(evt) {
 	alert( "Handler for .blur() called." );
  	evt.preventDefault();
  	urlProject = $("#url").val();

	urlSplit(urlProject);

	// estatiscas do repositorio
	// pega a quantidade total de commits por usuario e linhas add/rem por semana
	$.ajax({
		type: "GET",
		url: urlApi + "repos/" + user + "/" + repo + "/stats/contributors",
		contentType: "application/json",
		dataType: "json"
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
		
		// gráfico da quantidade de linhas adicionadas/removidas e commits por semana
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

	var myChart2 = Highcharts.chart('graphics2', {
	        chart: {
	            type: 'line'
	        },
	        title: {
	            text: 'Dados do GitHub2'
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

	// listando resumo dos commits
	$.ajax({
		type: 'GET',
		url: urlApi + 'repos/' + user + '/' + repo + '/commits',
		contentType: 'application/json',
		dataType: 'json'
	})
	.done(function(data) {	
		$('#lastcommit').append(convertDate(data[0].commit.author.date) );
		$.each( data, function(key, value) {
			var markup = "<tr>";
			markup +="<td>"+data[key].commit.author.name+"</td>";
			markup +="<td>"+data[key].commit.message+"</td>";
			markup +="<td>"+ convertDate(data[key].commit.author.date)+"</td>";
			markup +="<td><a href='" + data[key].html_url + "'><span class='ls-ico-link'></span></a></td></tr>";
			
	        $('#resumoCommits tbody').append(markup);
		});
	})

	// busca todos os issues do repositório
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
		});
	})
	
});

function urlSplit(url){
	var segments = url.split('/');
	user = segments[3];
	repo = segments[4];
}

/**
 * Summary. (use period)
 *
 * Description 							Converte um timestamp para o formato de data/horário humano
 * @param int unixtimestamp           	Timestamp a ser convertido.
 * @param String formato 	          	Formato de retorno. 'hora' => retorna somente a hora. 'dia' => retorna somente o dia, 'dh' => retorna a hora e o dia
 * @link 								https://makitweb.com/convert-unix-timestamp-to-date-time-with-javascript/
 * @return {type} Return value description.
 */
function convertTimeStamp(unixtimestamp){
	// Months array
	var months_arr = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
	// Convert timestamp to milliseconds
	var date = new Date(unixtimestamp*1000);
	// Year
	var year = date.getFullYear();
	// Month
	var month = months_arr[date.getMonth()];
	// Day
	var day = date.getDate();
	// Hours
	var hours = date.getHours();
	// Minutes
	var minutes = "0" + date.getMinutes();

	return day + '/' + month+ '/' + year;// + ' às ' + hours + ':' + minutes;
	 
	//console.log(day + '/' + month+ '/' + year + ' às ' + hours + ':' + minutes);
	//return day + '/' + month+ '/' +year;
}

function convertDate(data){
	var d = new Date(data);
	return d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' às '+ d.getHours() + ':' +  d.getMinutes();
}

/**
 * Description Busca os dados de um issue e preenche na tabela
 * @param int issue           Id issue do GitHub.
 */
function getIssue(issue){
	
	$.ajax({
		type: 'GET',
		url: urlApi + 'repos/' + user + '/' + repo + '/issues/'+issue,
		contentType: 'application/json',
		dataType: 'json'
	})
	.done(function(data) {
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
		locastyle.modal.open('#modalLarge');
	})

	// get comentarios issue
	$.ajax({
		type: 'GET',
		url: urlApi + 'repos/' + user + '/' + repo + '/issues/'+issue+'/comments',
		contentType: 'application/json',
		dataType: 'json'
	})
	.done(function(data) {
		console.log("list issues");
		$.each(data, function(key, value){
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