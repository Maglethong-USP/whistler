Instruções de criação do banco de dados:


Criação do banco [executar como psql admin]:

CREATE USER whistler WITH PASSWORD 'qwert';
CREATE DATABASE whistler OWNER whistler;


Script de criação [executar no terminal]
psql -U whistler -d whistler -a -f create.sql
