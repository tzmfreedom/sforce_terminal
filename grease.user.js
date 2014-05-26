// ==UserScript==
// @name           SForceTerminal
// @namespace      SForceTerminal
// @include        https://*force.com/*
// @exclude       https://*umps*force.com/*
// @exclude       https://*force.com/umps/*
// ==/UserScript==

(function () { 


    var main = function(){
        var addition = {
            TEST : function(){
                alert("this is plugin");
            },
            DELETE : function() {
                deleteAction();
            },
            DEBUG : function() {
                window.open('/_ui/common/apex/debug/ApexCSIPage', "terminal_create_view" + new Date().getTime());
            },
            //詳細画面のセクションを開く
            SHOWSECTION : function(){
                var list = document.getElementsByClassName('showListButton');

                var idlist = [];
                for(var i = 0; i < list.length; i++){
                    idlist[i] = list[i].id;
                }

                for(var i = 0; i < idlist.length; i++){
                    twistSection(document.getElementById(idlist[i]));
                }
            },
            //詳細画面のセクションを閉じる
            HIDESECTION : function(){
                var list = document.getElementsByClassName('hideListButton');

                var idlist = [];
                for(var i = 0; i < list.length; i++){
                    idlist[i] = list[i].id;
                }


                for(var i = 0; i < idlist.length; i++){
                    twistSection(document.getElementById(idlist[i]));
                }
            },
            //プロファイルのチェックボックス操作
            CHECKDISPLAY : function(){
                var selectObj = document.getElementsByTagName('input');
                var matchObj= new RegExp('display_');
                for(var i = 0; i < selectObj.length; i++) {
                    if(selectObj[i].id.match(matchObj)){
                        selectObj[i].checked = true; 
                    }
                }
            },
            //プロファイルのチェックボックス操作
            CHECKEDIT : function(){
                var selectObj = document.getElementsByTagName('input');
                var matchObj= new RegExp('edit_');
                for(var i = 0; i < selectObj.length; i++) {
                    if(selectObj[i].id.match(matchObj)){
                        selectObj[i].checked = true; 
                    }
                }
            },
            //プロファイルのチェックボックス操作
            CHECKALL : function(){
                var selectObj = document.getElementsByTagName('input');
                for(var i = 0; i < selectObj.length; i++) {
                    if(selectObj[i].type == "checkbox"){
                        selectObj[i].checked = true; 
                    }
                }
            },
            //プロファイルのチェックボックス操作
            UNCHECKDISPLAY : function(){
                var selectObj = document.getElementsByTagName('input');
                var matchObj= new RegExp('display_');
                for(var i = 0; i < selectObj.length; i++) {
                    if(selectObj[i].id.match(matchObj)){
                        selectObj[i].checked = false; 
                    }
                }
            },
            //プロファイルのチェックボックス操作
            UNCHECKEDIT : function(){
                var selectObj = document.getElementsByTagName('input');
                var matchObj= new RegExp('edit_');
                for(var i = 0; i < selectObj.length; i++) {
                    if(selectObj[i].id.match(matchObj)){
                        selectObj[i].checked = false; 
                    }
                }
            },
            //プロファイルのチェックボックス操作
            UNCHECKALL : function(){
                var selectObj = document.getElementsByTagName('input');
                for(var i = 0; i < selectObj.length; i++) {
                    if(selectObj[i].type == "checkbox"){
                        selectObj[i].checked = false; 
                    }
                }
            }
        };

        //レコードを検索
        var getSearchUrl = function(sObject,sName){
            var sQuery = 'SELECT id FROM ' + sObject;
            if( sName !== 'ALL' ){
                sQuery += ' WHERE name LIKE \'%' + sName + '%\'';
            }
            var records = sforce.connection.query(sQuery).records;
            var sUrl = '';
            if( records instanceof Array ){
                sUrl = '/' + records[0].Id;
            } else if( records.length != 0 ){
                sUrl = '/' + records.Id;
            }

            return sUrl;
        };

        //$ view {parameter}で画面移動
        var getViewUrl = function(param){
            var sUrl = "";
            var sUpperParam = param.toUpperCase();
            if( sUpperParam == 'COBJECT' ){
                sUrl = '/p/setup/custent/CustomObjectsPage?setupid=CustomObjects&retURL=%2Fui%2Fsetup%2FSetup%3Fsetupid%3DDevTools';
            } else if( sUpperParam == 'WORKFLOW' ){
                sUrl = '/01Q?retURL=%2Fui%2Fsetup%2FSetup%3Fsetupid%3DWorkflow&setupid=WorkflowRules'
            } else if( sUpperParam == 'ALLTAB'){
                sUrl = '/home/showAllTabs.jsp';
            } else if( sUpperParam == 'HOME' ){
                sUrl = '/home/home.jsp';
            } else { 
                sUrl = '/' + getObjectPrefix(param);
            } 
            return sUrl;
        };

        //レコード作成orカスタムオブジェクト作成ページヘの遷移
        var getCreateUrl = function(param){
            var sUrl;
            var sUpperParam = param.toUpperCase();
            if( sUpperParam == 'COBJECT'){
                sUrl = '/01I/e?setupid=CustomObjects&retURL=%2Fp%2Fsetup%2Fcustent%2FCustomObjectsPage%3Fsetupid%3DCustomObjects%26retURL%3D%252Fui%252Fsetup%252FSetup%253Fsetupid%253DDevTools';
            } else{
                sUrl = '/' + getObjectPrefix(param) + '/e';
            }
            return sUrl;
        };

        //Aliasを取得
        var getAlias = function(param){
            var sParam = param;
            if( param == 'C' ){
                sParam = 'CREATE';
            } else if( param == 'V' ){
                sParam = 'VIEW';
            } else if( param == 'S' || param == 'LS'){
                sParam = 'SEARCH';
            } else if( param == 'A' ){
                sParam = 'ACTION';
            }
            return sParam;
        };


        //削除処理
        var deleteAction = function(){
            var deleteIds = [];
            var domSelected = document.getElementsByName('ids');
            var deleteCallback = {
                onSuccess: function(res){
                    var mes = [];
                    if( res.length > 10){
                        var successCnt = 0;
                        var errorCnt = 0;
                        for(var i = 0; i < res.length; i++){ 
                            if(res[i].success === "true"){
                                successCnt ++;
                            } else {
                                errorCnt ++;
                            }
                        }
                        alert("削除成功：" + successCnt + "件" + "削除失敗" + errorCnt + "件");
                        return;
                    }
                    for(var i = 0; i < res.length; i++){ 
                        if(res[i].success === "true"){
                            mes.push("Id: " + res[i].id + " => 削除成功");
                        } else {
                            mes.push("message => " + res[i].errors.message);
                        }
                    }
                    if(mes.length > 0){
                        alert(mes.join("\n"));
                        location.reload(true)
                    }
                },
                onFailure: function(res){
                    alert("削除処理に失敗しました。");
                }
            };
            var result;

            for(var i = 0; i < domSelected.length; i++){
                if( domSelected[i].checked ){
                    deleteIds.push(domSelected[i].value);
                }
            }
            if ( deleteIds.length > 10 ) {
                if( window.confirm(deleteIds.length + '件\n\n削除しますか？') ){
                    result = sforce.connection.deleteIds(deleteIds, deleteCallback);
                }
                return;
            }
            if( window.confirm(deleteIds + '\n\n削除しますか？') ){
                result = sforce.connection.deleteIds(deleteIds, deleteCallback);
            }
            return;
        };

        //アクションプロシージャ
        var actionProc = function(param){
            var command = param[0].toUpperCase();
            var commandParam = param.slice(1,param.length);
            //追加アクションに関数として登録されていれば実行
            if( typeof addition[command] === "function" ){
                return addition[command](commandParam);
            }
        };

        //オブジェクトのprefixを取得
        var getObjectPrefix = function(sObjectName){
            return sforce.connection.describeSObject(sObjectName).keyPrefix;
        };

        //SessionIDを取得
        var getSessionId = function(){
            return document.cookie.substring(document.cookie.indexOf("sid=") + 4, document.cookie.indexOf(";", document.cookie.search("sid=")));
        };

        //キーダウン時の処理
        document.onkeydown = function(e){
            if( !e.ctrlKey || e.keyCode != 77 ){
                return;
            }

            sforce.connection.sessionId = getSessionId();
            var command = window.prompt('コマンドを入力してください','');
            if( command == '' || command == null){
                return;
            }
            var spl = command.trim().split(/\s+/);
            var command = getAlias(spl[0].toUpperCase());
            var commandParam = spl.slice(1, spl.length);
            console.log(commandParam);

            var url = '';
            switch(command){
                case 'VIEW':
                    if( commandParam.length === 1){
                        url = getViewUrl(commandParam[0]);
                    } else {
                        alert('usage: VIEW <オブジェクトAPI参照名>');
                    }
                    break;
                case 'CREATE':
                    if( commandParam.length === 1 ){
                        url = getCreateUrl(commandParam[0]);
                    } else {
                        alert('usage: CREATE <オブジェクトAPI参照名>');
                    }
                    break;
                case 'SEARCH':
                    if( commandParam.length === 2 ){
                        url = getSearchUrl(commandParam[0],commandParam[1]);
                    } else {
                        alert('usage: ' + arg1 + ' <オブジェクトAPI参照名> <検索Name>');
                    }
                    break;
                case 'ACTION':
                    actionProc(commandParam);
                    return;
                case 'CD':
                    if( commandParam.length === 1 ){
                        if( commandParam[0].charAt(0) != '/' ){
                            window.location.href = '/' + commandParam[0];
                        } else {
                            window.location.href = commandParam[0];
                        }
                    } else {
                        alert('usage: ' + arg1 + ' <相対パス>');
                    }
                    break;
                case 'PWD':
                    alert(document.URL);
                    break;
                case 'COPY':
                    if( commandParam.length === 2 ){
                        url = getSearchUrl(commandParam[0], commandParam[1]) + '/e?clone=1';
                    } else {
                        alert('usage: ' + arg1 + ' <オブジェクトAPI参照名>');
                    }
                    break;

            }
            if( url != '' ){
                //window.location.href = url;
                console.log(url);
                window.open(url, "terminal_create_view" + new Date().getTime());
            }
        };
    };

    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = '/soap/ajax/25.0/connection.js';
    script.addEventListener('load',function(){
        var script = document.createElement('script');
        script.textContent = '(' + main.toString() + ')()';
        head.appendChild(script);
    });

    if( head != null){
        head.appendChild(script);
    }
})();
