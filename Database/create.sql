/**
	Whistler
	Trabalho Prático de Introdução ao Desenvolvimento Web
	SCC0219 - 2016

	Script de Criação de Tabelas


	Legenda de Comentários:
	- [PK]	- Chave Primária
	- [Un]	- Chave Secundária [Atributo único]
	- [Dv] 	- Atributo Derivado
	- [FK]	- Chave Estrangeira

	Outras informações
	- Identação usando caractere TAB = 4 espaços
	- Todos os atributos derivados serão calculados por comandos SELECT após todas as inserções iniciais
*/

/** ========================================
 *		Drop em Tabelas e Seqüências
 * =========================================
 */

-- Drop em todas as tabelas, eliminando também suas restrições
DROP TABLE usuario			CASCADE;
DROP TABLE post				CASCADE;
DROP TABLE comentario		CASCADE;
DROP TABLE rank				CASCADE;
DROP TABLE grupo			CASCADE;
DROP TABLE membroGrupo		CASCADE;
DROP TABLE midia			CASCADE;
DROP TABLE seguir			CASCADE;
DROP TABLE post_ref_grupo	CASCADE;
DROP TABLE post_ref_usuario	CASCADE;
DROP TABLE post_ref_tag		CASCADE;

/** ========================================
 *					Tabelas
 * =========================================
 */

/** ==================== Tabela Usuário ====================
	
	Define um usuário do sistema

	Atributos:
	* id 						-- [PK] ID
	* login 					-- [SK] Login de usuário
	* senha 					-- 		Senha do usuário
	* nome	 					-- 		Nome de visualisação
	* foto 						-- 		Caminho para foto
	* descricao 				-- 		
	* nascimento 				-- 		Data de nascimento

	Constraints:
	* usuario_pk 				-- [PK] 
	* usuario_sk_login			-- [SK] Login único
	* 
 */
CREATE TABLE usuario
(
	-- Atributos
	id 			SERIAL,
	login		VARCHAR(64),
	senha		VARCHAR(64),
	nome 		VARCHAR(64),
	midia_path 	VARCHAR(126),
	descricao	TEXT,
	nascimento	TIMESTAMP,
	-- Constraints
	CONSTRAINT usuario_pk
		PRIMARY KEY (id),
	CONSTRAINT usuario_sk_login
		UNIQUE (login)
);

/** ==================== Tabela Post ====================
	
	Define um post de post do sistema
 */
CREATE TABLE post
(
	-- Atributos
	id 					SERIAL,
	escritor			INT,
	conteudo			TEXT,
	data 				TIMESTAMP WITH TIME ZONE,
	rankPos 			INT DEFAULT 0,
	rankNeg 			INT DEFAULT 0,
	comentarios 		INT DEFAULT 0,
	compartilhamentos 	INT DEFAULT 0,
	-- Constraints
	CONSTRAINT post_pk
		PRIMARY KEY (id),
	CONSTRAINT post_sk
		UNIQUE (escritor, data),
	CONSTRAINT post_fk_usuario 
		FOREIGN KEY (escritor)
		REFERENCES usuario (id)
		ON DELETE CASCADE
);

/** ==================== Tabela Comentário ====================
	
	Define um post de Comentário do sistema
 */
CREATE TABLE comentario
(
	-- Atributos
	id 				SERIAL,
	post 			INT,
	escritor		INT,
	conteudo		TEXT,
	data 			TIMESTAMP WITH TIME ZONE,
	-- Constraints
	CONSTRAINT comentario_pk
		PRIMARY KEY (id),
	CONSTRAINT comentario_sk
		UNIQUE (post, escritor, data),
	CONSTRAINT comentario_fk_post 
		FOREIGN KEY (post)
		REFERENCES post (id)
		ON DELETE CASCADE,
	CONSTRAINT comentario_fk_usuario 
		FOREIGN KEY (escritor)
		REFERENCES usuario (id)
		ON DELETE CASCADE
);

/** ==================== Tabela Rank positivo ====================
	
 */
CREATE TABLE rank
(
	-- Atributos
	post 			INT,
	avaliador		INT,
	tipo 			CHAR,
	-- Constraints
	CONSTRAINT rankPos_pk
		PRIMARY KEY (post, avaliador),
	CONSTRAINT rank_tipo 
		CHECK ( UPPER(tipo) IN ( 'P', 'N' ) ),
	CONSTRAINT rankPos_fk_post 
		FOREIGN KEY (post)
		REFERENCES post (id)
		ON DELETE CASCADE,
	CONSTRAINT rankPos_fk_usuario 
		FOREIGN KEY (avaliador)
		REFERENCES usuario (id)
		ON DELETE CASCADE
);

/** ==================== Tabela Grupo ====================
	
 */
CREATE TABLE grupo
(
	-- Atributos
	dono		INT,
	nome		VARCHAR(64),
	-- Constraints
	CONSTRAINT grupo_pk
		PRIMARY KEY (dono, nome),
	CONSTRAINT grupo_fk_usuario 
		FOREIGN KEY (dono)
		REFERENCES usuario (id)
		ON DELETE CASCADE
);

/** ==================== Tabela Membro Grupo ====================
	
 */
CREATE TABLE membroGrupo
(
	-- Atributos
	dono		INT,
	nome		VARCHAR(64),
	membro		INT,
	-- Constraints
	CONSTRAINT membroGrupo_pk
		PRIMARY KEY (dono, nome, membro),
	CONSTRAINT membroGrupo_fk_grupo 
		FOREIGN KEY (dono, nome)
		REFERENCES grupo (dono, nome)
		ON DELETE CASCADE,
	CONSTRAINT membroGrupo_fk_usuario 
		FOREIGN KEY (membro)
		REFERENCES usuario (id)
		ON DELETE CASCADE
);

/** ==================== Tabela Midia ====================
	
 */
CREATE TABLE midia
(
	-- Atributos
	dono		INT,
	data 		TIMESTAMP,
	caminho		VARCHAR(512),
	tipo		CHAR(1) NOT NULL,
	-- Constraints
	CONSTRAINT midia_pk
		PRIMARY KEY (dono, data),
	CONSTRAINT midia_tipo 
		CHECK ( UPPER(tipo) IN ( 'I', 'V' ) ),
	CONSTRAINT midia_fk_usuario 
		FOREIGN KEY (dono)
		REFERENCES usuario (id)
		ON DELETE CASCADE
);

/** ==================== Tabela Seguir ====================
	
 */
CREATE TABLE seguir
(
	-- Atributos
	seguidor	INT,
	seguido 	INT,
	-- Constraints
	CONSTRAINT seguir_pk
		PRIMARY KEY (seguidor, seguido),
	CONSTRAINT seguir_fk_usuario_seguidor 
		FOREIGN KEY (seguidor)
		REFERENCES usuario (id)
		ON DELETE CASCADE,
	CONSTRAINT seguir_fk_usuario_seguido 
		FOREIGN KEY (seguido)
		REFERENCES usuario (id)
		ON DELETE CASCADE
);

/** ==================== Tabela Referencia de Post para Grupo ====================
	Gerenciada automaticamente
 */
CREATE TABLE post_ref_grupo
(
	-- Atributos
	post		INT,
	grupo_dono	INT,
	grupo_nome	VARCHAR(64),
	-- Constraints
	CONSTRAINT post_ref_grupo_pk
		PRIMARY KEY (post, grupo_dono, grupo_nome),
	CONSTRAINT post_ref_grupo_fk_post 
		FOREIGN KEY (post)
		REFERENCES post (id)
		ON DELETE CASCADE,
	CONSTRAINT post_ref_grupo_fk_grupo 
		FOREIGN KEY (grupo_dono, grupo_nome)
		REFERENCES grupo (dono, nome)
		ON DELETE CASCADE
);

/** ==================== Tabela Referencia de Post para Usuario ====================
	Gerenciada automaticamente
 */
CREATE TABLE post_ref_usuario
(
	-- Atributos
	post		INT,
	usuario		INT,
	-- Constraints
	CONSTRAINT post_ref_usuario_pk
		PRIMARY KEY (post, usuario),
	CONSTRAINT post_ref_usuario_fk_post 
		FOREIGN KEY (post)
		REFERENCES post (id)
		ON DELETE CASCADE,
	CONSTRAINT post_ref_usuario_fk_usuario 
		FOREIGN KEY (usuario)
		REFERENCES usuario (id)
		ON DELETE CASCADE
);

/** ==================== Tabela Referencia de Post para Tag ====================
	Gerenciada automaticamente
 */
CREATE TABLE post_ref_tag
(
	-- Atributos
	post		INT,
	tag			VARCHAR(64),
	-- Constraints
	CONSTRAINT post_ref_tag_pk
		PRIMARY KEY (post, tag),
	CONSTRAINT post_ref_tag_fk_post 
		FOREIGN KEY (post)
		REFERENCES post (id)
		ON DELETE CASCADE
);


/** ========================================
 *					Triggers
 * =========================================
 */

/** ==================== Contagem de Rank ====================
	Trigger responsavel por manter a coerencia dos atributos derivados
	renk positivo/negativo de posts.
 */
CREATE OR REPLACE FUNCTION rank_post() 
RETURNS TRIGGER AS $rank_post$
	BEGIN
		IF (TG_OP = 'DELETE') THEN
			IF (OLD.tipo = 'P') THEN
				UPDATE post SET rankPos = rankPos -1
				WHERE post.id = OLD.post;
				RETURN OLD;
			ELSE
				UPDATE post SET rankNeg = rankNeg -1
				WHERE post.id = OLD.post;
				RETURN OLD;
			END IF;
		ELSIF (TG_OP = 'UPDATE') THEN
			IF (OLD.tipo = 'P') THEN
				UPDATE post SET rankPos = rankPos -1
				WHERE post.id = OLD.post;
			ELSE
				UPDATE post SET rankNeg = rankNeg -1
				WHERE post.id = OLD.post;
			END IF;

			IF (NEW.tipo = 'P') THEN
				UPDATE post SET rankPos = rankPos +1
				WHERE post.id = NEW.post;
			ELSE
				UPDATE post SET rankNeg = rankNeg +1
				WHERE post.id = NEW.post;
			END IF;
			RETURN NEW;
		ELSIF (TG_OP = 'INSERT') THEN
			IF (NEW.tipo = 'P') THEN
				UPDATE post SET rankPos = rankPos +1
				WHERE post.id = NEW.post;
			ELSE
				UPDATE post SET rankNeg = rankNeg +1
				WHERE post.id = NEW.post;
			END IF;
			RETURN NEW;
		END IF;

	END;
$rank_post$ LANGUAGE plpgsql;

CREATE TRIGGER rank_post BEFORE INSERT OR UPDATE OR DELETE ON rank
	FOR EACH ROW EXECUTE PROCEDURE rank_post();

/** ==================== Novo Post ====================
	Responsavel por criar e manter as referencias corretas dos psots
	para usuarios/grupos/tags listadas no texto do post.
 */
CREATE OR REPLACE FUNCTION post_refs() 
RETURNS TRIGGER AS $post_refs$
	DECLARE
		post 		TEXT;
		reference 	VARCHAR(64);
		curPos 		INTEGER;
		refPosEnd 	INTEGER;
		tableCheck 	VARCHAR(64);
	BEGIN
		IF (TG_OP = 'UPDATE') THEN
			IF (NEW.conteudo != OLD.conteudo) THEN
			
				DELETE FROM post_ref_grupo WHERE post = OLD.id;
				DELETE FROM post_ref_usuario WHERE post = OLD.id;
				DELETE FROM post_ref_tag WHERE post = OLD.id;
			ELSE
				RETURN NEW;
			END IF;
		END IF;

		/* User/Group checking */
		post = NEW.conteudo;
		LOOP
			curPos = POSITION('@' in post);

			IF curPos = 0 THEN
				EXIT;
			END IF;

			curPos = curPos+1;

			post = SUBSTRING(post FROM curPos);
			refPosEnd = POSITION(' ' in post);
			IF refPosEnd > 0 THEN
				reference = SUBSTRING(post FROM 1 FOR refPosEnd -1);
				post = SUBSTRING(post FROM refPosEnd);
			ELSE
				reference = post;
			END IF;

			SELECT nome FROM grupo WHERE dono = NEW.escritor INTO tableCheck;
			IF (tableCheck IS NULL) THEN /* TODO [Test] */
				SELECT id FROM usuario WHERE nome = reference INTO curPos;
				RAISE NOTICE 'Relacionando post #% com usuario "%(%)"', NEW.id, reference, curPos; /* TODO [debug] */
				INSERT INTO post_ref_usuario (post, usuario) 
					VALUES (NEW.id, curPos);
			ELSE /* TODO [Test] */
				RAISE NOTICE 'Relacionando post #% com grupo "%(%)"', NEW.id, reference, NEW.escritor; /* TODO [debug] */
				INSERT INTO post_ref_grupo (post, grupo_dono, grupo_nome) 
					VALUES (NEW.id, NEW.escritor, reference);
			END IF;

		END LOOP;

		/* Tag checking */
		post = NEW.conteudo;
		LOOP
			curPos = POSITION('#' in post);

			IF curPos = 0 THEN
				EXIT;
			END IF;

			curPos = curPos+1;

			post = SUBSTRING(post FROM curPos);
			refPosEnd = POSITION(' ' in post);
			IF refPosEnd > 0 THEN
				reference = SUBSTRING(post FROM 1 FOR refPosEnd);
				post = SUBSTRING(post FROM refPosEnd);
			ELSE
				reference = post;
			END IF;

			RAISE NOTICE 'Relacionando post #% com tag "%"', NEW.id, reference; /* TODO [debug] */

			INSERT INTO post_ref_tag (post, tag) /* TODO [Test] */
				VALUES (NEW.id, reference);
		END LOOP;

		RETURN NEW;
	END;
$post_refs$ LANGUAGE plpgsql;

CREATE TRIGGER post_refs AFTER INSERT OR UPDATE ON post
	FOR EACH ROW EXECUTE PROCEDURE post_refs();

/** ==================== Novo Comentario ====================
	Responsavel por manter a contagem de comentarios de cada post correta
 */

CREATE OR REPLACE FUNCTION comentario_post() 
RETURNS TRIGGER AS $comentario_post$
	BEGIN
		IF (TG_OP = 'DELETE') THEN
			UPDATE post SET comentarios = comentarios -1
			WHERE post.id = OLD.post;
			RETURN OLD;
		ELSIF (TG_OP = 'UPDATE') THEN
			IF (NEW.post = OLD.post) THEN

			ELSE
				UPDATE post SET comentarios = comentarios -1
				WHERE post.id = OLD.post;
				UPDATE post SET comentarios = comentarios +1
				WHERE post.id = NEW.post;
			END IF;
			RETURN NEW;
		ELSIF (TG_OP = 'INSERT') THEN
			UPDATE post SET comentarios = comentarios +1
			WHERE post.id = NEW.post;
			RETURN NEW;
		END IF;
	END;
$comentario_post$ LANGUAGE plpgsql;

CREATE TRIGGER comentario_post BEFORE INSERT OR UPDATE OR DELETE ON comentario
	FOR EACH ROW EXECUTE PROCEDURE comentario_post();

/** ==================== Novo Post ====================
	Insere data do sistema no post novo
 */

CREATE OR REPLACE FUNCTION post_data() 
RETURNS TRIGGER AS $post_data$
	BEGIN
		NEW.data := current_timestamp;
		RETURN NEW;
	END;
$post_data$ LANGUAGE plpgsql;

CREATE TRIGGER post_data BEFORE INSERT ON post
	FOR EACH ROW EXECUTE PROCEDURE post_data();

/** ==================== Novo Comentario ====================
	Insere data do sistema no comentario novo
 */

CREATE OR REPLACE FUNCTION comentario_data() 
RETURNS TRIGGER AS $comentario_data$
	BEGIN
		NEW.data := current_timestamp;
		RETURN NEW;
	END;
$comentario_data$ LANGUAGE plpgsql;

CREATE TRIGGER comentario_data BEFORE INSERT ON comentario
	FOR EACH ROW EXECUTE PROCEDURE comentario_data();

/** ==================== Nova Midia ====================
	Insere data do sistema na midia novo
 */

CREATE OR REPLACE FUNCTION midia_data() 
RETURNS TRIGGER AS $midia_data$
	BEGIN
		NEW.data := current_timestamp;
		RETURN NEW;
	END;
$midia_data$ LANGUAGE plpgsql;

CREATE TRIGGER midia_data BEFORE INSERT ON midia
	FOR EACH ROW EXECUTE PROCEDURE midia_data();


/** ========================================
 *					Views
 * =========================================
 */

/** ==================== Feed ====================
	Busca pelo feed de um usuario

	Parametro:
	- ID do usuario a buscar o feed

	Feed inclui:
	- Proprios posts
	- Posts com referencia a seu nome
	- Posts com referencia a grupos que o incluem
	- Posts de usuarios que ele segue
 */
CREATE OR REPLACE FUNCTION feed(userid INTEGER)
	RETURNS TABLE (	writerID INTEGER, writerProfileName VARCHAR(64), writerPicturePath VARCHAR(126), 
					id INTEGER, content TEXT, date TIMESTAMP WITH TIME ZONE, likes INTEGER, dislikes INTEGER,
					shares INTEGER, comments INTEGER, userRank CHAR)
AS $body$
	SELECT	usuario.id as "writerID", 
			usuario.nome as "writerProfileName", 
			usuario.midia_path as "writerPicturePath", 

			post.id as "id", 
			post.conteudo as "content", 
			post.data as "date", 
			post.rankpos as "likes", 
			post.rankneg as "dislikes",
			post.compartilhamentos as "shares",
			post.comentarios as "comments",

			rank.tipo as "userRank"
	FROM post 
	JOIN usuario 
		ON post.escritor = usuario.id
	LEFT JOIN rank /* We want the current user's ranking of this post */
		ON rank.post = post.id
		AND rank.avaliador = $1
	WHERE
		post.id IN 
		(
			/* Posts referring to this user */
			SELECT post FROM post_ref_usuario
			WHERE usuario = $1
			UNION

			/* Posts referring to a group with this user */
			SELECT post FROM post_ref_grupo
			JOIN membroGrupo 
				ON membroGrupo.dono = post_ref_grupo.grupo_dono
				AND membroGrupo.nome = post_ref_grupo.grupo_nome
			WHERE membroGrupo.membro = $1
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
			post.compartilhamentos as "shares",
			post.comentarios as "comments",

			rank.tipo as "userRank"
	FROM post 
	JOIN usuario 
		ON post.escritor = usuario.id
	LEFT JOIN rank /* We want the current user's ranking of this post */
		ON rank.post = post.id
		AND rank.avaliador = usuario.id
	WHERE
		usuario.id = $1

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
			post.compartilhamentos as "shares",
			post.comentarios as "comments",

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
		seguir.seguidor = $1

	/* Group and order results */
	GROUP BY
		usuario.id, usuario.nome, usuario.midia_path, post.id, post.conteudo, 
		post.data, post.rankpos, post.rankneg, post.compartilhamentos, rank.tipo
	ORDER BY "date" DESC;
$body$ LANGUAGE sql;

/** ==================== UserPosts ====================
	Busca pelos psots de um determinado usuario

	Parametro:
	- ID do usuario que realiza a busca
	- ID do usuario a buscar os posts
 */
CREATE OR REPLACE FUNCTION userPosts(searcherID INTEGER, targetID INTEGER)
	RETURNS TABLE (	writerID INTEGER, writerProfileName VARCHAR(64), writerPicturePath VARCHAR(126), 
					id INTEGER, content TEXT, date TIMESTAMP WITH TIME ZONE, likes INTEGER, dislikes INTEGER,
					shares INTEGER, comments INTEGER, userRank CHAR)
AS $body$
	SELECT	usuario.id as "writerID", 
			usuario.nome as "writerProfileName", 
			usuario.midia_path as "writerPicturePath", 

			post.id as "id", 
			post.conteudo as "content", 
			post.data as "date", 
			post.rankpos as "likes", 
			post.rankneg as "dislikes",
			post.compartilhamentos as "shares",
			post.comentarios as "comments",

			rank.tipo as "userRank"
	FROM post 
	JOIN usuario 
		ON post.escritor = usuario.id
	LEFT JOIN rank /* We want the current user's ranking of this post */
		ON rank.post = post.id
		AND rank.avaliador = $1
	WHERE /* We want the current searched user's posts */
		usuario.id = $2

	/* Group and order results */
	GROUP BY
		usuario.id, usuario.nome, usuario.midia_path, post.id, post.conteudo, 
		post.data, post.rankpos, post.rankneg, post.compartilhamentos, rank.tipo
	ORDER BY "date" DESC;
$body$ LANGUAGE sql;

/** ==================== Busca ====================
	Realiza uma busca customizada de um usuario

	Parametros:
	- ID do usuario a buscar
	- string contedo a busca a fazer conforme especificacao
 */
CREATE OR REPLACE FUNCTION search(userid INTEGER, query TEXT)
	RETURNS TABLE (	writerID INTEGER, writerProfileName VARCHAR(64), writerPicturePath VARCHAR(126), 
					id INTEGER, content TEXT, date TIMESTAMP WITH TIME ZONE, likes INTEGER, dislikes INTEGER,
					shares INTEGER, comments INTEGER, userRank CHAR)
AS $body$
	DECLARE
		input 		TEXT[];
		length		INTEGER;
		pos 		INTEGER;

		users 		TEXT[];
		tags 		TEXT[];

		usecase 	INTEGER;
	BEGIN
		/* Split users from tags */
		input = STRING_TO_ARRAY($2, ' ');
		length = ARRAY_LENGTH(input, 1);
		pos = 0;

		LOOP
			pos = pos +1;
			IF pos > length THEN
				EXIT;
			END IF;

			/* To short to be something */
			IF LENGTH(input[pos]) < 2 THEN

			/* Is user */
			ELSEIF LEFT(input[pos], 1) = '@' THEN
				users = ARRAY_APPEND(users, SUBSTRING(input[pos] FROM 2));
			/* Is tag */
			ELSEIF LEFT(input[pos], 1) = '#' THEN
				tags = ARRAY_APPEND(tags, SUBSTRING(input[pos] FROM 2));
			/* Is nothing */
			ELSE
				RAISE NOTICE 'Weird query: containing non user/tag element "%"', input[pos]; /* TODO [raise exception] */
			END IF;
		END LOOP;

		/* Figuring what usecase it is [No users/No Tags/Have both] */
		usecase = 0;
		IF ARRAY_LENGTH(users, 1) > 0 THEN
			usecase = usecase +1;
		END IF;
		IF ARRAY_LENGTH(tags, 1) > 0 THEN
			usecase = usecase +2;
		END IF;

		RAISE NOTICE 'case "%"', usecase; /* TODO [Debug] */

		/* Tags array is empty */
		IF usecase = 1 THEN
			RETURN QUERY SELECT	usuario.id as "writerID", 
					usuario.nome as "writerProfileName", 
					usuario.midia_path as "writerPicturePath", 

					post.id as "id", 
					post.conteudo as "content", 
					post.data as "date", 
					post.rankpos as "likes", 
					post.rankneg as "dislikes",
					post.compartilhamentos as "shares",
					post.comentarios as "comments",

					rank.tipo as "userRank"
			FROM post 
			JOIN usuario 
				ON post.escritor = usuario.id
			LEFT JOIN rank /* We want the current user's ranking of this post */
				ON rank.post = post.id
				AND rank.avaliador = $1
			WHERE
				/* User name is in users list */
				usuario.nome = ANY (users)
				/* User is in a group in users list [group of current user] */
				OR post.id IN
				(
					SELECT post.id FROM post
						JOIN usuario ON usuario.id = post.escritor
						JOIN membroGrupo ON usuario.id = membroGrupo.membro
						JOIN grupo
							ON grupo.dono = membroGrupo.dono
							AND grupo.nome = membroGrupo.nome
					WHERE grupo.dono = $1
						AND grupo.nome = ANY(users)
				)

			/* Group and order results */
			GROUP BY
				usuario.id, usuario.nome, usuario.midia_path, post.id, post.conteudo, 
				post.data, post.rankpos, post.rankneg, post.compartilhamentos, rank.tipo
			ORDER BY "date" DESC;

		/* Users array is empty */
		ELSEIF usecase = 2 THEN
			RETURN QUERY SELECT	usuario.id as "writerID", 
					usuario.nome as "writerProfileName", 
					usuario.midia_path as "writerPicturePath", 

					post.id as "id", 
					post.conteudo as "content", 
					post.data as "date", 
					post.rankpos as "likes", 
					post.rankneg as "dislikes",
					post.compartilhamentos as "shares",
					post.comentarios as "comments",

					rank.tipo as "userRank"
			FROM post 
			JOIN usuario 
				ON post.escritor = usuario.id
			LEFT JOIN rank /* We want the current user's ranking of this post */
				ON rank.post = post.id
				AND rank.avaliador = $1
			WHERE post.id IN
				(
					SELECT post FROM post_ref_tag
					WHERE tag = ANY(tags)
				)

			/* Group and order results */
			GROUP BY
				usuario.id, usuario.nome, usuario.midia_path, post.id, post.conteudo, 
				post.data, post.rankpos, post.rankneg, post.compartilhamentos, rank.tipo
			ORDER BY "date" DESC;

		/* Users and Tags array has content */
		ELSE
			RETURN QUERY SELECT	usuario.id as "writerID", 
					usuario.nome as "writerProfileName", 
					usuario.midia_path as "writerPicturePath", 

					post.id as "id", 
					post.conteudo as "content", 
					post.data as "date", 
					post.rankpos as "likes", 
					post.rankneg as "dislikes",
					post.compartilhamentos as "shares",
					post.comentarios as "comments",

					rank.tipo as "userRank"
			FROM post 
			JOIN usuario 
				ON post.escritor = usuario.id
			LEFT JOIN rank /* We want the current user's ranking of this post */
				ON rank.post = post.id
				AND rank.avaliador = $1
			WHERE
				/* User name is in users list */
				usuario.nome = ANY (users)
				/* User is in a group in users list [group of current user] */
				OR post.id IN
				(
					SELECT post.id FROM post
						JOIN usuario ON usuario.id = post.escritor
						JOIN membroGrupo ON usuario.id = membroGrupo.membro
						JOIN grupo
							ON grupo.dono = membroGrupo.dono
							AND grupo.nome = membroGrupo.nome
					WHERE grupo.dono = $1
						AND grupo.nome = ANY(users)
				)
				/* Tag is in tag list */
				AND post.id IN
				(
					SELECT post FROM post_ref_tag
					WHERE tag = ANY(tags)
				)

			/* Group and order results */
			GROUP BY
				usuario.id, usuario.nome, usuario.midia_path, post.id, post.conteudo, 
				post.data, post.rankpos, post.rankneg, post.compartilhamentos, rank.tipo
			ORDER BY "date" DESC;
		END IF;
	END;
$body$ LANGUAGE plpgsql;