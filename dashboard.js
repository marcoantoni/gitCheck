var urlApi = 'https://api.github.com/';
var urlProject = '';
var user = '';
var repo = '';

document.getElementById('buscar').addEventListener('click', async function (evt) {
    evt.preventDefault();
    limparDados();

    urlProject = document.getElementById('url').value;
    urlSplit(urlProject);

    try {
        // ==========================
        // CONTRIBUTORS
        // ==========================
        const resContrib = await fetch(urlApi + 'repos/' + user + '/' + repo + '/contributors');
        const dataContrib = await resContrib.json();

        let totalCommits = 0;
        let contribuidores = [];

        document.getElementById('img_user').src = dataContrib[0].avatar_url;
        document.getElementById('login').innerHTML += dataContrib[0].login;

        dataContrib.forEach(value => {
            totalCommits += value.contributions;
            contribuidores.push(`${value.login} (${value.contributions})`);
        });

        document.getElementById('contribuidores').innerHTML += `<p>${contribuidores}</p>`;
        document.getElementById('totalCommits').innerHTML += totalCommits;

        // ==========================
        // CHART (mantido igual)
        // ==========================
        /* var myChart = Highcharts.chart('graphics', {
            chart: { type: 'line' },
            title: { text: 'Acompanhamento geral do projeto' },
            yAxis: { title: { text: 'Estatistícas' } },
            series: [
                { name: 'Linhas adicionadas' },
                { name: 'Linhas removidas' },
                { name: 'Commits' }
            ]
        });*/

        // ==========================
        // BRANCHES
        // ==========================
        const resBranch = await fetch(urlApi + 'repos/' + user + '/' + repo + '/branches');
        const dataBranch = await resBranch.json();

        document.getElementById('totalBranchs').innerHTML += dataBranch.length;

        dataBranch.forEach((value, key) => {
            document.getElementById('branchsname').innerHTML += value.name;
            if (dataBranch.length > 1 && key !== dataBranch.length - 1) {
                document.getElementById('branchsname').innerHTML += ', ';
            }
        });

        // ==========================
        // COMMITS
        // ==========================
        const resCommits = await fetch(urlApi + 'repos/' + user + '/' + repo + '/commits');
        const dataCommits = await resCommits.json();

        document.getElementById('lastcommit').innerHTML += convertDate(dataCommits[0].commit.author.date);

        dataCommits.forEach(value => {
            let markup = '<tr>';
            markup += `<td>${value.commit.author.name}</td>`;
            markup += `<td>${value.commit.message}</td>`;
            markup += `<td>${convertDate(value.commit.author.date)}</td>`;
            markup += `<td><a href="${value.html_url}"><span class="ls-ico-link"></span></a></td></tr>`;

            document.querySelector('#resumoCommits tbody').innerHTML += markup;
        });

        // ==========================
        // ISSUES
        // ==========================
        const resIssues = await fetch(urlApi + 'repos/' + user + '/' + repo + '/issues?state=all');
        const dataIssues = await resIssues.json();

        dataIssues.forEach(value => {
            let markup = '<tr>';
            markup += `<td><a href="#" onclick="getIssue(${value.number});">#${value.number} ${value.title}</a>`;

            if (value.state === 'open')
                markup += ' <span class="ls-tag-warning">Aberto</span>';
            else if (value.state === 'closed')
                markup += ' <span class="ls-tag-success">Fechado</span>';

            markup += `</td><td>${value.user.login}</td></tr>`;

            document.getElementById('issues').innerHTML += markup;
        });

    } catch (error) {
        alert("error");
        console.error(error);
    }
});

// ==========================
// FUNÇÕES AUXILIARES
// ==========================

function urlSplit(url) {
    var segments = url.split('/');
    user = segments[3];
    repo = segments[4];
}

function convertTimeStamp(unixtimestamp) {
    var months_arr = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    var date = new Date(unixtimestamp * 1000);

    return date.getDate() + '/' + months_arr[date.getMonth()] + '/' + date.getFullYear();
}

function convertDate(data) {
    var d = new Date(data);
    return d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear() + ' às ' + d.getHours() + ':' + d.getMinutes();
}

// ==========================
// ISSUE DETALHE
// ==========================

async function getIssue(issue) {
    try {
        const resIssue = await fetch(urlApi + 'repos/' + user + '/' + repo + '/issues/' + issue);
        const data = await resIssue.json();

        document.getElementById('modalcontent').innerHTML = '';
        document.getElementById('tituloissue').innerHTML = '';

        document.getElementById('tituloissue').innerHTML += `#${data.number} ${data.title}`;

        let markup = `
        <div class="ls-list">
            <div class="ls-list-content">
                <div class="col-xs-12 col-md-6">
                    <span class="ls-list-label"><strong>Autor</strong></span>
                    ${data.user.login}
                </div>
                <div class="col-xs-12 col-md-6">
                    <span class="ls-list-label"><strong>Criado</strong></span>
                    ${convertDate(data.created_at)}
                </div>
            </div>
            <div class="ls-list-content">
                <div class="col-xs-12 col-md-12">
                    <span class="ls-list-label"><strong>Mensagem</strong></span>
                    <p>${data.body}</p>
                </div>
            </div>
        </div>`;

        document.getElementById('modalcontent').innerHTML += markup;

        // comentários
        const resComments = await fetch(urlApi + 'repos/' + user + '/' + repo + '/issues/' + issue + '/comments');
        const comments = await resComments.json();

        if (comments.length > 0) {
            comments.forEach(value => {
                let markup = `
                <div class="ls-list">
                    <div class="ls-list-content">
                        <div class="col-xs-12 col-md-6">
                            <span class="ls-list-label"><strong>Autor</strong></span>
                            ${value.user.login}
                        </div>
                        <div class="col-xs-12 col-md-6">
                            <span class="ls-list-label"><strong>Criado</strong></span>
                            ${convertDate(value.created_at)}
                        </div>
                    </div>
                    <div class="ls-list-content">
                        <div class="col-xs-12 col-md-12">
                            <span class="ls-list-label"><strong>Mensagem</strong></span>
                            <p>${value.body}</p>
                        </div>
                    </div>
                </div>`;
                document.getElementById('modalcontent').innerHTML += markup;
            });
        }

        locastyle.modal.open('#modalLarge');

    } catch (error) {
        console.error(error);
    }
}

function limparDados() {
    document.getElementById('lastcommit').innerHTML = '';
    document.getElementById('totalCommits').innerHTML = '';
    document.getElementById('contribuidores').innerHTML = '';
    document.getElementById('totalBranchs').innerHTML = '';
    document.getElementById('branchsname').innerHTML = '';
    document.querySelector('#resumoCommits tbody').innerHTML = '';
    document.getElementById('modalcontent').innerHTML = '';
    document.getElementById('tituloissue').innerHTML = '';
    document.getElementById('issues').innerHTML = '';
    document.getElementById('login').innerHTML = '';
}