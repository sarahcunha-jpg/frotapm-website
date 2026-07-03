-- name=rastreio/sql/create_rastreamento.sql
CREATE TABLE IF NOT EXISTS rastreamento (
  id CHAR(36) NOT NULL PRIMARY KEY,
  viatura_id CHAR(36) NOT NULL,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  velocidade DECIMAL(6,2) NULL,
  heading DECIMAL(6,2) NULL,
  data_hora TIMESTAMP NOT NULL,
  origem VARCHAR(50) DEFAULT 'gps',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_viatura_data (viatura_id, data_hora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
