SforceTerminal
====================

Salesforce用のUserScriptです。  
コマンド打って色々便利なことします。  


Ctrl + M ->コマンド用プロンプトの表示  


#コマンド一覧

###view [オブジェクトAPI参照名]
オブジェクトのリストビュー画面に画面遷移する。  
vでもOK(alias)  
  
ex) view account  
ex) v sobjecttest__c  

###action delete
リストビューでチェックをつけたレコードを全て削除する。  
関連リストのリストでも動きます。  

###action hidesection
詳細画面のセクションを全て閉じる。  

###action showsection
詳細画面のセクションを全て開く。  

###action checkdisplay
プロファイルの項目レベルセキュリティ編集画面で"参照可能"のチェックボックス全てにチェックをつける。  

###action checkedit
プロファイルの項目レベルセキュリティ編集画面で"参照のみ"のチェックボックス全てにチェックをつける。  

###action checkall
プロファイルの項目レベルセキュリティ編集画面で全てのチェックボックスにチェックをつける。  

###action uncheckdisplay
プロファイルの項目レベルセキュリティ編集画面で"参照可能"のチェックボックス全てのチェックを外す。  

###action uncheckedit
プロファイルの項目レベルセキュリティ編集画面で"参照のみ"のチェックボックス全てのチェックを外す。  

###action uncheckall
プロファイルの項目レベルセキュリティ編集画面で全てのチェックボックスのチェックを外す。  

###search [オブジェクトAPI参照名] [検索名]
Name項目に対して指定した検索名であいまい検索を実行し、  
最初にヒットしたレコードの詳細画面に遷移する。  
sでもOK(alias)  
  
ex) search contact test太郎  
ex) s account 企業  
  
###create [オブジェクトAPI参照名]
指定オブジェクトのレコード作成画面に遷移する。  
cでもOK(alias)  
  
ex) create contact  
ex) c account  
  
###cd [ルートからのパス]
ルートディレクトリからのパスに画面遷移する。  
  
ex) cd /home/home.jsp  
ex) cd 001  
ex) cd /006  
  
###pwd
現在のURLを返す。  
  
###copy [オブジェクトAPI参照名] [検索名]
searchと同じロジックでヒットしたレコードに対するコピー画面に遷移する。  
  
