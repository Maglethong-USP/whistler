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
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
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
	id 			SERIAL,
	escritor	INT,
	conteudo	TEXT,
	data 		TIMESTAMP WITH TIME ZONE,
	rankPos 	INT DEFAULT 0,
	rankNeg 	INT DEFAULT 0,
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
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
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
	-- Constraints
	CONSTRAINT comentario_pk
		PRIMARY KEY (post, escritor, data),
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
	"createdAt" timestamp with time zone,
	"updatedAt" timestamp with time zone,
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
	Insere data do sistema no post novo.
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

CREATE TRIGGER user_mensagem BEFORE INSERT ON comentario
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

CREATE TRIGGER user_mensagem BEFORE INSERT ON midia
	FOR EACH ROW EXECUTE PROCEDURE midia_data();