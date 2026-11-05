// TODO: uuid インポート（エイリアス）: v4
const { v4: uuidv4 } = require('uuid');

// TODO: UUID生成: uuidv4
const id = uuidv4()
const name = "Alice";
const email = "alice@test.com";

// TODO: オブジェクトリテラルで代入
const user = { id, name, email }
console.table(user);