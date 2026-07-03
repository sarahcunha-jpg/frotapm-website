-- SQL migrations: create core tables for Frota PM

CREATE TABLE IF NOT EXISTS viaturas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  placa varchar(20) UNIQUE,
  modelo varchar(100),
  prefixo varchar(50),
  status varchar(30),
  criado_em timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ordens_servico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero varchar(50),
  viatura_id uuid REFERENCES viaturas(id),
  viatura varchar(100),
  tipo varchar(50),
  descricao text,
  custo numeric(10,2),
  status varchar(30),
  data_abertura date,
  data_fechamento date,
  tempo_parada numeric,
  criado_por uuid,
  criado_em timestamp with time zone DEFAULT now(),
  atualizado_em timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS manutencoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  viatura_id uuid REFERENCES viaturas(id),
  tipo varchar(50),
  descricao text,
  custo numeric(10,2),
  status varchar(30),
  data_abertura date,
  data_fechamento date,
  tempo_parada numeric,
  criado_em timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS historico_alteracoes (
  id bigserial PRIMARY KEY,
  usuario_id uuid,
  tabela varchar(100),
  registro_id uuid,
  acao varchar(20),
  data timestamp with time zone DEFAULT now(),
  detalhe jsonb
);

CREATE TABLE IF NOT EXISTS notificacoes (
  id bigserial PRIMARY KEY,
  usuario_id uuid,
  mensagem text,
  lida boolean DEFAULT false,
  data timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rastreamento (
  id bigserial PRIMARY KEY,
  viatura_id uuid,
  latitude double precision,
  longitude double precision,
  velocidade numeric,
  dispositivo varchar(100),
  registrado_em timestamp with time zone DEFAULT now()
);
