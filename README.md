# Crater

Faucet (蛇口) 巡りを便利にするための Google Chrome 拡張機能です。 


## Features

### Auto Fill

Bitcoin アドレスなどを自動入力します。  
自動入力の対象となるフォームは、

* POST でデータを送信しているもの
* タイプ (`type="value"`) が下記以外のもの
  * `file`
  * `color`
  * `tel`
  * `hidden`
  * `password`
  * `email`
  * `submit`
* 名前 (`name="value"`) に下記のワードを含んでいないもの
  * `login`
  * `username`
  * `mail`
  * `tel`
  * `referrer`
  * `button`
  * `2fa`
  * `$`
  * `remember`
* 名前 (`name="value"`) が下記に含まれていない物
  * `q`
* 以下の属性がつけられていないもの
  * `autocomplete="off"`
  * `autocorrect="off"`


自動入力は、 **URL が完全一致** したときのみ行われます。


### Navigation Block

海外の蛇口によくある、偽リンクや JavaScript でのクリックイベントでの画面遷移をブロックします。  
ブロック条件は

* ページのホスト名が、拡張機能の Blocklist に含まれている
* 遷移先ホスト名が、拡張機能の `domains` に含まれている
  * `app/scripts/background.js` の `domains` 定数
* `a` タグによる移動では無い
* `onclick` イベントが指定されていない
* `submit` などによる POST リクエストではない

ものです。


### Show percentage

[FaucetHub.io](https://faucethub.io) の `/dashboard` の Wallet Balance に、以下の機能を追加します。

* 最低出金額までいくら貯まっているかのパーセント表示を追加
  * 出金できる場合は、上記パーセントを緑色で表示
* 現在の残高に対する、出金手数料の表示を追加

参考:

![default](https://user-images.githubusercontent.com/10832834/35092034-86d691b8-fc81-11e7-8b49-1a3ed4d58711.PNG)
