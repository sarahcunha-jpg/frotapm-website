-- Frota PM Database Schema

-- Users Table
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles Table
CREATE TABLE IF NOT EXISTS viaturas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prefixo VARCHAR(50) NOT NULL UNIQUE,
    placa VARCHAR(20) NOT NULL UNIQUE,
    modelo VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    ano INTEGER NOT NULL,
    quilometragem INTEGER DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'operacional',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Table
CREATE TABLE IF NOT EXISTS manutencoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    viatura_id UUID NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    descricao TEXT,
    data DATE NOT NULL,
    quilometragem INTEGER,
    valor DECIMAL(10, 2),
    oficina VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (viatura_id) REFERENCES viaturas(id) ON DELETE CASCADE
);

-- Tracking Table
CREATE TABLE IF NOT EXISTS rastreamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    viatura_id UUID NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (viatura_id) REFERENCES viaturas(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_viaturas_status ON viaturas(status);
CREATE INDEX idx_manutencoes_viatura_id ON manutencoes(viatura_id);
CREATE INDEX idx_manutencoes_data ON manutencoes(data);
CREATE INDEX idx_rastreamento_viatura_id ON rastreamento(viatura_id);