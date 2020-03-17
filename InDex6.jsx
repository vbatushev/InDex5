var Index6 = (function(){
    #include "IndexDialog.jsxinc"
    #include "InDexFind.jsxinc"

    var main = function() {
        if (app.documents.length == 0) {
            alert(docAlertText, docAlertHead, true);  exit();
        }
        new IndexDialog(indexver);
    }

    return {
        run: main
    }
})();

app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
app.doScript("Index6.run();", ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT, "Index 6");
Index6 = null;
delete Index6;
$.gc();$.gc();
