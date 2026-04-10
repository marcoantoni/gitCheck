# GitCheck

## Sobre o projeto

O **GitCheck** é uma aplicação (script) web desenvolvida em 2019, durante o mestrado, no para a disciplina de Docência.  

O objetivo da aplicação é **acompanhar o progresso de trabalhos desenvolvidos por estudantes**, utilizando dados públicos de repositórios do GitHub.

A proposta é fornecer uma forma simples de análise da atividade em projetos, especialmente em trabalhos em grupo.

---

## Funcionalidades

A aplicação permite:

- 📅 Visualizar a **data do último commit**
- 🔢 Contar o **total de commits do repositório**
- 👥 Identificar a **quantidade de commits por usuário**, permitindo avaliar a participação individual em trabalhos em grupo
- 📝 Listar os commits com:
  - autor
  - mensagem
  - data
  - link direto para o commit
- 📌 Consultar todas as **issues do repositório**, incluindo status (aberto/fechado)

---

## 📊 Funcionalidade descontinuada

Originalmente, a aplicação também permitia visualizar um gráfico com:

- commits por semana
- linhas adicionadas e removidas
- atividade por usuário ao longo do tempo

Entretanto, essa funcionalidade foi desativada devido a mudanças na API do GitHub.
```javascript
/*
 * O endpoint anteriormente utilizado para obter estatísticas de linhas adicionadas,
 * removidas e commits foi alterado pela API do GitHub. A versão atual utiliza:
 * /stats/commit_activity
 * Documentação: https://docs.github.com/pt/rest/metrics/statistics?apiVersion=2026-03-10
 *
 * De acordo com a documentação oficial, a primeira requisição deve retornar HTTP 202,
 * indicando que um processamento assíncrono foi iniciado. Em chamadas subsequentes,
 * a API deveria retornar HTTP 200 com os dados calculados.
 *
 * Entretanto, após diversos testes com diferentes repositórios (inclusive com volume
 * de commits dentro do limite especificado), a API permanece retornando HTTP 202 ou
 * respostas vazias ([]), sem disponibilizar os dados esperados.
 *
 * Diante disso, a funcionalidade foi desativada por falta de confiabilidade do endpoint.
 */
```
# Como usar

1. Clone o repositório:
``git clone https://github.com/marcoantoni/gitCheck.git``
2. Abra a pasta do projeto
3. Abra o arquivo `index.html` no navegador
4. Informe o link de um repositório do GitHub (exemplo):
``git clone https://github.com/marcoantoni/poo``
5. Clique em **Buscar**
