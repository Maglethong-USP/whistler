/**
	Whistler
	Trabalho Prático de Introdução ao Desenvolvimento Web
	SCC0219 - 2016

	Script de Alimentação de Tabelas


	Legenda de Comentários:
	- [PK]	- Chave Primária
	- [Un]	- Chave Secundária [Atributo único]
	- [Dv] 	- Atributo Derivado
	- [FK]	- Chave Estrangeira

	Outras informações
	- Identação usando caractere TAB = 4 espaços
	- Todos os atributos derivados serão calculados por comandos SELECT após todas as inserções iniciais
*/

INSERT INTO usuario (id, login, senha, nome, descricao) 
	VALUES (0, 'Andy', 'qwe', 'Maglethong', 'Um cara legal');

INSERT INTO usuario (id, login, senha, nome, descricao) 
	VALUES (1, 'Yvan', 'qwe', 'Lhama', 'Um cara chato');

INSERT INTO post (escritor, conteudo) 
	VALUES (0, 'Pqp... o Yvan é chato heim @Lhama #chato');

