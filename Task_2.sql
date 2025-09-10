create table if not exists test_blocks (
	height int8 primary key
);

create table if not exists test_txs (
	hash varchar(64) primary key,
	block_height int8 not null,
	"from" varchar(64) not null,
	"to" varchar(64) not null,
	value varchar(64) not null,
	gas bigint not null,
	date date not null,
	foreign key (block_height) references test_blocks(height)
);

truncate test_blocks cascade;
truncate test_txs cascade;

insert into test_blocks values 
	(1), (2), (3), (4);

select * from test_blocks;

insert into test_txs values
	('hash1', 3, 'lupa', 'pupa', '1000', 43000, '2024-08-10'),
	('hash2', 3, 'lupa', 'pupa', '2000', 34020, '2024-08-10'),
	('hash3', 3, 'lupa', 'pupa', '3000', 640000, '2024-08-12'),
	('hash4', 3, 'lupa', 'pupa', '4000', 650000, '2024-08-12'),
	('hash5', 3, 'lupa', 'pupa', '5000', 50060, '2024-08-10'),
	('hash6', 3, 'lupa', 'pupa', '1000', 95000, '2024-08-12'),
	('hash7', 3, 'lupa', 'pupa', '2000', 10900, '2024-08-11'),
	('hash8', 3, 'lupa', 'pupa', '3000', 20300, '2024-08-11'),
	('hash9', 3, 'lupa', 'pupa', '4000', 45000, '2024-08-11'),
	('hash10', 2, 'lupa', 'pupa', '4000', 75600, '2024-08-05'),
	('hash11', 2, 'lupa', 'pupa', '1000', 86500, '2024-08-07'),
	('hash12', 2, 'lupa', 'pupa', '1000', 32400, '2024-08-07'),
	('hash13', 2, 'lupa', 'pupa', '1000', 100200, '2024-08-05'),
	('hash14', 1, 'lupa', 'pupa', '2000', 32000, '2024-08-01'),
	('hash15', 1, 'lupa', 'pupa', '3000', 50000, '2024-08-01'),
	('hash16', 1, 'lupa', 'pupa', '1000', 43500, '2024-08-01'),
	('hash17', 1, 'lupa', 'pupa', '1000', 78000, '2024-08-02');
	
-- 	добавил индекс для уменьшения костов
create index if not exists idx_test_txs_block_height_desc
  on test_txs (block_height desc);


-- WITH TIES - помогает избежать обрезание и выдает все транзакции с последнего блока 

SELECT *
FROM test_txs
ORDER BY block_height DESC
FETCH FIRST $1 ROWS WITH TIES;
