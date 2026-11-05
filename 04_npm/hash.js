// TODO: bcrypt インポート
// const bcrypt = require('bcrypt');

/**
 * 平文パスワードとハッシュの比較
 */
// 既存のハッシュ値
const hash = '$2b$10$DZfvGBqDyS2TVal7PfxpreZMIyG7OWu4ocUodf3FhfYtJmasfujYq';
// TODO: 平文パスワード
const password = '1111';
// TODO: 平文とハッシュの比較: compareSync()
const isAuth = false;

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
const newHash = "";

// 結果表示
result = { newPassword, newHash }
console.log('新しいパスワードのハッシュ化結果:');
console.table(result);