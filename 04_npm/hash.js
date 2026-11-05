// TODO: bcrypt インポート
const bcrypt = require('bcrypt');

/**
 * 平文パスワードとハッシュの比較
 */
// 既存のハッシュ値
const hash = '$2b$10$DZfvGBqDyS2TVal7PfxpreZMIyG7OWu4ocUodf3FhfYtJmasfujYq';
// TODO: 平文パスワード
const password = '9999';
// TODO: 平文とハッシュの比較: compareSync()
const isAuth = bcrypt.compareSync(password, hash)

// 結果表示
let result = { password, hash, isAuth }
console.log('平文とハッシュの比較結果:');
console.table(result);

/**
 * 新しいハッシュ作成
 */ 
// 新しいパスワード（平文）
const newPassword = '2222';
// TODO: ソルト生成（文字）: genSaltSync() 
// TODO: ハッシュ化: hashSync()
const newHash = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10))

// 結果表示
result = { newPassword, newHash }
console.log('新しいパスワードのハッシュ化結果:');
console.table(result);

// 新しいハッシュと既存のハッシュの比較
const isNewAuth = bcrypt.compareSync(newPassword, newHash)
result = { newPassword, newHash, isNewAuth }
console.log('新しいハッシュと平文の比較結果:');
console.table(result);