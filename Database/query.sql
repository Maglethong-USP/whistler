/**
	Whistler
	Trabalho Prático de Introdução ao Desenvolvimento Web
	SCC0219 - 2016

	Script de Consultas em Tabelas


	Legenda de Comentários:
	- [PK]	- Chave Primária
	- [Un]	- Chave Secundária [Atributo único]
	- [Dv] 	- Atributo Derivado
	- [FK]	- Chave Estrangeira

	Outras informações
	- Identação usando caractere TAB = 4 espaços
*/



/** ==================== Feed ====================
	Busca pelo feed de um usuario [1]

	Feed inclui:
	- Proprios posts
	- Posts com referencia a seu nome
	- Posts com referencia a grupos que o incluem
	- Posts de usuarios que ele segue
 */

/* posts referring to this user */
SELECT	usuario.id as "writerID", 
		usuario.nome as "writerProfileName", 
		usuario.midia_path as "writerPicturePath", 

		post.id as "id", 
		post.conteudo as "content", 
		post.data as "date", 
		post.rankpos as "likes", 
		post.rankneg as "dislikes",

		rank.tipo as "userRank"
FROM post 
JOIN usuario 
	ON post.escritor = usuario.id
LEFT JOIN rank /* We want the current user's ranking of this post */
	ON rank.post = post.id
	AND rank.avaliador = 1
WHERE
	post.id IN 
	(
		/* Posts referring to this user */
		SELECT post FROM post_ref_usuario
		WHERE usuario = 1
		UNION

		/* Posts referring to a group with this user */
		SELECT post FROM post_ref_grupo
		JOIN membroGrupo 
			ON membroGrupo.dono = post_ref_grupo.grupo_dono
			AND membroGrupo.nome = post_ref_grupo.grupo_nome
		WHERE membroGrupo.membro = 1
	)

/* Add own posts */
UNION
SELECT	usuario.id as "writerID", 
		usuario.nome as "writerProfileName", 
		usuario.midia_path as "writerPicturePath", 

		post.id as "id", 
		post.conteudo as "content", 
		post.data as "date", 
		post.rankpos as "likes", 
		post.rankneg as "dislikes",

		rank.tipo as "userRank"
FROM post 
JOIN usuario 
	ON post.escritor = usuario.id
LEFT JOIN rank /* We want the current user's ranking of this post */
	ON rank.post = post.id
	AND rank.avaliador = usuario.id
WHERE
	usuario.id = 1

/* Add posts from users he is following */
UNION
SELECT	usuario.id as "writerID", 
		usuario.nome as "writerProfileName", 
		usuario.midia_path as "writerPicturePath", 

		post.id as "id", 
		post.conteudo as "content", 
		post.data as "date", 
		post.rankpos as "likes", 
		post.rankneg as "dislikes",

		rank.tipo as "userRank"
FROM post 
JOIN usuario 
	ON post.escritor = usuario.id
LEFT JOIN rank /* We want the current user's ranking of this post */
	ON rank.post = post.id
	AND rank.avaliador = usuario.id
JOIN seguir
	ON usuario.id = seguir.seguido
WHERE
	seguir.seguidor = 1

/* Group and order results */
GROUP BY
	usuario.id, usuario.nome, usuario.midia_path, post.id, post.conteudo, 
	post.data, post.rankpos, post.rankneg, rank.tipo
ORDER BY "date" DESC;





