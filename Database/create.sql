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
DROP TABLE rankPos			CASCADE;
DROP TABLE rankNeg			CASCADE;
DROP TABLE grupo			CASCADE;
DROP TABLE membroGrupo		CASCADE;
DROP TABLE midia			CASCADE;
DROP TABLE seguir			CASCADE;

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
	escritor	INT,
	conteudo	TEXT,
	data 		TIMESTAMP,
	rankPos 	INT DEFAULT 0,
	rankNeg 	INT DEFAULT 0,
	-- Constraints
	CONSTRAINT post_pk
		PRIMARY KEY (escritor, data),
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
	post_escritor 	INT,
	post_data 		TIMESTAMP,
	escritor		INT,
	conteudo		TEXT,
	data 			TIMESTAMP,
	-- Constraints
	CONSTRAINT comentario_pk
		PRIMARY KEY (post_escritor, post_data, escritor, data),
	CONSTRAINT comentario_fk_post 
		FOREIGN KEY (post_escritor, post_data)
		REFERENCES post (escritor, data)
		ON DELETE CASCADE,
	CONSTRAINT comentario_fk_usuario 
		FOREIGN KEY (escritor)
		REFERENCES usuario (id)
		ON DELETE CASCADE
);


/** ==================== Tabela Rank positivo ====================
	
 */
CREATE TABLE rankPos
(
	-- Atributos
	post_escritor 	INT,
	post_data 		TIMESTAMP,
	avaliador		INT,
	-- Constraints
	CONSTRAINT rankPos_pk
		PRIMARY KEY (post_escritor, post_data, avaliador),
	CONSTRAINT rankPos_fk_post 
		FOREIGN KEY (post_escritor, post_data)
		REFERENCES post (escritor, data)
		ON DELETE CASCADE,
	CONSTRAINT rankPos_fk_usuario 
		FOREIGN KEY (avaliador)
		REFERENCES usuario (id)
		ON DELETE CASCADE
);


/** ==================== Tabela Rank Negativo ====================
	
 */
CREATE TABLE rankNeg
(
	-- Atributos
	post_escritor 	INT,
	post_data 		TIMESTAMP,
	avaliador		INT,
	-- Constraints
	CONSTRAINT rankNeg_pk
		PRIMARY KEY (post_escritor, post_data, avaliador),
	CONSTRAINT rankNeg_fk_post 
		FOREIGN KEY (post_escritor, post_data)
		REFERENCES post (escritor, data)
		ON DELETE CASCADE,
	CONSTRAINT rankNeg_fk_usuario 
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



/** ========================================
 *					Triggers
 * =========================================
 */

/** ==================== Contagem de Rank Positivo ====================

 */
CREATE OR REPLACE FUNCTION rankPos_post() 
RETURNS TRIGGER AS $rankPos_post$
	BEGIN
		IF (TG_OP = 'DELETE') THEN
			UPDATE post SET rankPos = rankPos -1
			WHERE post.escritor = OLD.post_escritor
			AND post.data = OLD.post_data;
			RETURN OLD;
		ELSIF (TG_OP = 'UPDATE') THEN
			IF (OLD.id = NEW.id) THEN

			ELSE
				UPDATE post SET rankPos = rankPos -1
				WHERE post.escritor = OLD.post_escritor
				AND post.data = OLD.post_data;

				UPDATE post SET rankPos = rankPos +1
				WHERE post.escritor = NEW.post_escritor
				AND post.data = NEW.post_data;
				RETURN NEW;
			END IF;
		ELSIF (TG_OP = 'INSERT') THEN
			UPDATE post SET rankPos = rankPos +1
			WHERE post.escritor = NEW.post_escritor
			AND post.data = NEW.post_data;
			RETURN NEW;
		END IF;

	END;
$rankPos_post$ LANGUAGE plpgsql;

CREATE TRIGGER rankPos_post BEFORE INSERT OR UPDATE OR DELETE ON rankPos
	FOR EACH ROW EXECUTE PROCEDURE rankPos_post();

/** ==================== Contagem de Rank Negativo ====================

 */
CREATE OR REPLACE FUNCTION rankNeg_post() 
RETURNS TRIGGER AS $rankNeg_post$
	BEGIN
		IF (TG_OP = 'DELETE') THEN
			UPDATE post SET rankNeg = rankNeg -1
			WHERE post.escritor = OLD.post_escritor
			AND post.data = OLD.post_data;
			RETURN OLD;
		ELSIF (TG_OP = 'UPDATE') THEN
			IF (OLD.id = NEW.id) THEN
			
			ELSE
				UPDATE post SET rankNeg = rankNeg -1
				WHERE post.escritor = OLD.post_escritor
				AND post.data = OLD.post_data;

				UPDATE post SET rankNeg = rankNeg +1
				WHERE post.escritor = NEW.post_escritor
				AND post.data = NEW.post_data;
				RETURN NEW;
			END IF;
		ELSIF (TG_OP = 'INSERT') THEN
			UPDATE post SET rankNeg = rankNeg +1
			WHERE post.escritor = NEW.post_escritor
			AND post.data = NEW.post_data;
			RETURN NEW;
		END IF;

	END;
$rankNeg_post$ LANGUAGE plpgsql;

CREATE TRIGGER rankNeg_post BEFORE INSERT OR UPDATE OR DELETE ON rankNeg
	FOR EACH ROW EXECUTE PROCEDURE rankNeg_post();

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

CREATE TRIGGER user_mensagem BEFORE INSERT ON post
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