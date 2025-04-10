CREATE TABLE `Cliente` (
  `id_cliente` int PRIMARY KEY,
  `nome` varchar(255),
  `email` varchar(255),
  `telefone` varchar(255),
  `cpf` varchar(255),
  `data_cadastro` date
);

CREATE TABLE `Produto` (
  `id_produto` int PRIMARY KEY,
  `nome` varchar(255),
  `preco` decimal,
  `qtde_estoque` int
);

CREATE TABLE `Compra` (
  `id_compra` int PRIMARY KEY,
  `data` date,
  `total` decimal,
  `cliente_id` int,
  `produto_id` int
);

CREATE TABLE `Pagamento` (
  `id_pagamento` int PRIMARY KEY,
  `metodo` varchar(255),
  `status` varchar(255),
  `valor` decimal,
  `data_pagamento` date,
  `compra_id` int
);

ALTER TABLE `Compra` ADD FOREIGN KEY (`cliente_id`) REFERENCES `Cliente` (`id_cliente`);

ALTER TABLE `Compra` ADD FOREIGN KEY (`produto_id`) REFERENCES `Produto` (`id_produto`);

ALTER TABLE `Pagamento` ADD FOREIGN KEY (`compra_id`) REFERENCES `Compra` (`id_compra`);
