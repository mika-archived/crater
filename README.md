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

FaucetHub.io の `/dashboard` の Wallet Balance で、現在どの程度貯まっているのか、出金手数料がどれくらいかを表示します。