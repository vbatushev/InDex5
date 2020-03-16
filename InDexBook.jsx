var IndexBook = (function(){
    #include "BookDialog.jsx"
    #include "InDexFind.jsxinc"

    var main = function() {
        // if (!app.documents.length && !!app.books.length) {
        //     var bookstyledoc = app.open(app.activeBook.bookContents[0].fullName);
        // } else {
            // if (!!app.documents.length && !!app.books.length) {
            //     alert("Close all open documents\nand run script again.", "Error: open documents.", true);
            //     exit();
            // }
            // if (!!app.documents.length && !app.books.length) {
            //     alert("Not opened books for process.\nClose all open documents,\nopen book and run script again.", "Error: has opened documents and has not opened book", true);
            //     exit();
            // }
            // if (!app.documents.length && !app.books.length) {
            //     alert("Нет открытых книг для обработки.\nОткройте книгу и запустите скрипт еще раз.", "Ошибка: Не открыта книга", true);
            //     exit();
            // }
        // }
        if (!app.books.length) {
            alert("Not opened books for process.\nOpen book and run script again.", "Error: has not opened book", true);
            exit();
        }

        if (!!app.documents.length) {
            for (var a = app.documents.length - 1; a > -1; a--) {
                app.documents.item(a).close(SaveOptions.ASK);
            }
        }

        var workfile = File.openDialog (docOpenDialogHead, 'Text Files:*.txt', false);
        if (!workfile) { exit(); }
        var dlg = new BookDialog(indexver, workfile);
    }

    return {
        run: main
    }
})();

app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
app.doScript("IndexBook.run();", ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT, "IndexBook6");
IndexBook = null;
delete IndexBook;
// Сборщик мусора
// Утверждают, что лучше вызывать два раза подряд
$.gc();$.gc();
