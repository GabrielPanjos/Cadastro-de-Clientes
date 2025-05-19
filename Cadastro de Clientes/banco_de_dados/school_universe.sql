-- Cria o banco de dados chamado 'school_universe'
# CREATE DATABASE school_universe;

-- Seleciona o banco de dados 'school_universe' para uso
USE school_universe;

-- Remove as tabelas se existirem (ordem importa por causa das dependências)
# DROP TABLE IF EXISTS Pagamento;
# DROP TABLE IF EXISTS Compra;
# DROP TABLE IF EXISTS Produto;
# DROP TABLE IF EXISTS Clientes;

-- Tabela de clientes
CREATE TABLE Clientes (
    id_clientes INT AUTO_INCREMENT PRIMARY KEY,       -- ID único com incremento automático
    nome VARCHAR(255) NOT NULL,                        -- Nome completo do cliente
    cpf VARCHAR(11) UNIQUE NOT NULL,                   -- CPF sem formatação
    rg VARCHAR(20),                                    -- RG do cliente
    data_nascimento DATE,                              -- Data de nascimento
    numero_telefone VARCHAR(20),                       -- Número de telefone
    email VARCHAR(255),                                -- Email do cliente
    estado VARCHAR(100),                               -- Estado de residência
    cidade VARCHAR(100),                               -- Cidade de residência
    rua VARCHAR(255),                                  -- Nome da rua
    cep VARCHAR(10),                                   -- CEP
    bairro VARCHAR(100),                               -- Bairro
    complemento VARCHAR(255),                          -- Complemento (ex: apto, bloco)
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Data de cadastro automática
);

# DESCRIBE Clientes;
# SELECT * FROM Clientes;

# SELECT COUNT(*) FROM clientes;
# SELECT DATABASE();

-- Tabela de produtos disponíveis
CREATE TABLE Produto (
    `id_produto` INT AUTO_INCREMENT PRIMARY KEY,       -- ID do produto
    `nome` VARCHAR(255) NOT NULL,                      -- Nome do produto
    `marca` VARCHAR(255) NOT NULL,                     -- Marca do produto
    `preco` DECIMAL(10,2) NOT NULL,                    -- Preço do produto
    `quantidade_estoque` INT NOT NULL DEFAULT 0        -- Quantidade disponível em estoque
);

-- Tabela de compras realizadas
CREATE TABLE Compra (
    `id_compra` INT AUTO_INCREMENT PRIMARY KEY,        -- ID da compra
    `data` DATE NOT NULL,                              -- Data da compra
    `total` DECIMAL(10,2) NOT NULL,                    -- Valor total da compra
    `cliente_id` INT,                                  -- Cliente que fez a compra
    FOREIGN KEY (cliente_id) REFERENCES Clientes(id_clientes)
);

-- Tabela de pagamento das compras
CREATE TABLE Pagamento (
    `id_pagamento` INT AUTO_INCREMENT PRIMARY KEY,     -- ID do pagamento
    `metodo` VARCHAR(255) NOT NULL,                    -- Método usado no pagamento
    `status` VARCHAR(255) NOT NULL,                    -- Status do pagamento (aprovado, pendente, etc.)
    `valor` DECIMAL(10,2) NOT NULL,                    -- Valor pago
    `data_pagamento` DATE NOT NULL,                    -- Data do pagamento
    `compra_id` INT,                                   -- Compra relacionada a este pagamento
    FOREIGN KEY (compra_id) REFERENCES Compra(id_compra)
);

INSERT INTO Produto (nome, marca, preco, quantidade_estoque) VALUES 
('Lápis Preto HB', 'Faber-Castell', 1.50, 100),
('Caneta Azul', 'BIC', 2.00, 150),
('Caderno 10 matérias', 'Tilibra', 18.90, 50),
('Borracha Branca', 'Mercur', 1.20, 200),
('Apontador com depósito', 'Maped', 3.50, 120),
('Mochila Escolar', 'Sestini', 89.90, 30),
('Estojo Grande', 'Capricho', 19.90, 40),
('Régua 30cm', 'Trident', 2.50, 100),
('Tesoura Escolar', 'Mundial', 4.99, 80),
('Cola Branca 90g', 'Pritt', 2.99, 90),
('Marca Texto', 'Faber-Castell', 3.99, 70),
('Canetinha Hidrocor', 'Faber-Castell', 12.50, 60),
('Caderno de Desenho', 'Tilibra', 15.00, 55),
('Bloco de Anotações', 'Chamex', 5.50, 70),
('Papel Sulfite A4 (500 folhas)', 'Chamex', 24.90, 20),
('Pasta com elástico', 'Dello', 4.00, 60),
('Grafite 0.7mm', 'Pentel', 2.30, 100),
('Compasso Escolar', 'Trident', 7.90, 35),
('Transferidor', 'Trident', 3.00, 50),
('Agenda Escolar', 'Tilibra', 14.50, 25);

-- Exibe a estrutura da tabela 'Clientes'
# DESCRIBE Produto;
# select * from Produto;
