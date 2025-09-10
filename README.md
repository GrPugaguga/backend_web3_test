Для тестов и проверки работы добавил OpenAPI схему через swagger и развернул сервер на railway 

https://backendweb3test-production.up.railway.app/docs

Задача 1 - выполненно.
  
  С evm не было никаких проблем - простые аксиос запросы с понытным форматом ответа.

  С cosmos возникли проблемы, предоставленный https://sei-m.rpc.n0ok.net:443 выдавал 502 ошибку, взял подобно евм примеру ссылку с publicnode. С RPC также летели ошибки, выбрал https://sei-rest.publicnode.com для работы с cosmos. Видимо из-за полной миграции сети (https://docs.sei.io/cosmos-sdk) есть проблемы с парсингом транзакций через космос, fee прилетает пустым массивом, вариант поиска gas_price и умножение его на gas_used также не всегда отрабатывает. В документации по космосу нашел сдк @cosmjs/stargate, но по запросу 
  {
  const client = await StargateClient.connect(rpcEndpoint);
  const tx = await client.getTx(txHash);
  }
  также получаем пустой массив вместо fee, из сдк по итогу использовал только { decodeTxRaw } from "@cosmjs/proto-signing" , чтобы декодировать event signer для получения отправителя 

Задача 2 - выполненно 
  Весь код записан в отдельном мд файле task 2 