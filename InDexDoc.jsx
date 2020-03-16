var IndexDoc = (function(){
    #include "InDexFind.jsxinc"

    var main = function() {
        if (app.documents.length == 0) {
            alert(docAlertText, docAlertHead, true);  exit();
        }

        var workfile = File.openDialog (docOpenDialogHead, 'Text Files:*.txt', false); if (!workfile) { exit(); }
        var res =  "dialog {\
                text:' InDex " + indexver +  " ', properties: { }, \
                bigGroup:Group {orientation:'row', alignChildren:['fill','fill'], \
                    fGroup:Group {orientation:'column', alignChildren:['fill','top'], \
                        tpPanel:Panel {orientation:'row', alignChildren:['fill', 'fill'], margins:[10,16,10,10], text:'Old Topics in Index', \
                            chkRemoveTopics:Checkbox{text:' Remove all', size:[120,16]},\
                        },\
                        casePanel:Panel {orientation:'column', alignChildren:['fill', 'fill'], margins:[10,16,10,10], text:'Search', \
                            chk:Checkbox {text:'  Case Sensitive', size:[120,16]}, \
                        },\
                        prPanel:Panel {orientation:'column', margins:[10,16,10,10], alignChildren:['fill', 'fill'], text:'Process', \
                                chk1:Checkbox {text:'  Footnotes', size:[120,16]}, \
                                chk2:Checkbox {text:'  Hidden Layers', size:[120,16]}, \
                                chk3:Checkbox {text:'  Locked Layers', size:[120,16]}, \
                                chk4:Checkbox {text:'  Locked Stories', size:[120,16]}, \
                                chk5:Checkbox {text:'  Master Pages', size:[120,16]}, \
                        },\
                    },\
                    sGroup:Group {orientation:'column', alignChildren:['fill','top'], \
                        paraPanel:Panel {orientation:'row', alignChildren:['fill', 'fill'], text:'Select Paragraph Styles', \
                            lb:ListBox{size:[200,250], properties:{multiselect:true}},\
                        },\
                    },\
                    csGroup:Group {orientation:'column', alignChildren:['fill','top'], \
                        paraPanel:Panel {orientation:'row', alignChildren:['fill', 'fill'], text:'Select Character Styles', \
                            lb:ListBox{size:[200,250], properties:{multiselect:true}},\
                        },\
                    },\
                },\
                bottomGroup:Group {orientation:'row', size: [630, 24], alignChildren:['right','center'], \
                   btnOK:Button{name:'ok', text:'OK'},\
                   btnCancel:Button{name:'cancel', text:'Cancel'},\
                },\
            }";
        var win = new Window (res);

        win.text = "InDex for Document " + indexver + " by Vitaly Batushev ©";

        for (var a = 0;  a < app.activeDocument.paragraphStyles.length; a++) {
            var styleItem = win.bigGroup.sGroup.paraPanel.lb.add('item',app.activeDocument.paragraphStyles[a].name);
            win.bigGroup.sGroup.paraPanel.lb.items[styleItem.index].styleRef = app.activeDocument.paragraphStyles[a];
        }

        for (var a = 0; a < app.activeDocument.paragraphStyleGroups.length; a++) {
            for (var b = 0, l = app.activeDocument.paragraphStyleGroups.item(a).paragraphStyles.length; b < l; b++) {
                var itemName = "[" + app.activeDocument.paragraphStyleGroups.item(a).name + "] " + app.activeDocument.paragraphStyleGroups.item(a).paragraphStyles.item(b).name;
                var styleItem = win.bigGroup.sGroup.paraPanel.lb.add('item', itemName);
                win.bigGroup.sGroup.paraPanel.lb.items[styleItem.index].styleRef = app.activeDocument.paragraphStyleGroups.item(a).paragraphStyles.item(b);
            }
        }

        for (var a = 0;  a < app.activeDocument.characterStyles.length; a++) {
            var styleItem = win.bigGroup.csGroup.paraPanel.lb.add('item',app.activeDocument.characterStyles[a].name);
            win.bigGroup.csGroup.paraPanel.lb.items[styleItem.index].styleRef = app.activeDocument.characterStyles[a];
        }
        for (var a = 0; a < app.activeDocument.characterStyleGroups.length; a++) {
            for (var b = 0, l = app.activeDocument.characterStyleGroups.item(a).characterStyles.length; b < l; b++) {
                var itemName = "[" + app.activeDocument.characterStyleGroups.item(a).name + "] " + app.activeDocument.characterStyleGroups.item(a).characterStyles.item(b).name;
                var styleItem = win.bigGroup.csGroup.paraPanel.lb.add('item', itemName);
                win.bigGroup.csGroup.paraPanel.lb.items[styleItem.index].styleRef = app.activeDocument.characterStyleGroups.item(a).characterStyles.item(b);
            }
        }
        win.bigGroup.fGroup.casePanel.chk.value = false;

        win.center();
        result = win.show();

        if (result == 1) {
            var processFootnotes = win.bigGroup.fGroup.prPanel.chk1.value;
                processHiddenLayers =  win.bigGroup.fGroup.prPanel.chk2.value,
                processMasterPages =  win.bigGroup.fGroup.prPanel.chk5.value,
                processLockedLayers =  win.bigGroup.fGroup.prPanel.chk3.value,
                processLockedStories =  win.bigGroup.fGroup.prPanel.chk4.value,
                isCaseSens = win.bigGroup.fGroup.casePanel.chk.value;

            app.findChangeGrepOptions.includeFootnotes = processFootnotes;
            app.findChangeGrepOptions.includeHiddenLayers = processHiddenLayers;
            app.findChangeGrepOptions.includeMasterPages = processMasterPages;
            app.findChangeGrepOptions.includeLockedLayersForFind = processLockedLayers;
            app.findChangeGrepOptions.includeLockedStoriesForFind = processLockedStories;

            var findParaStyles = [];
            if (win.bigGroup.sGroup.paraPanel.lb.selection) {
                for (var a = 0; a < win.bigGroup.sGroup.paraPanel.lb.selection.length; a++) {
                    findParaStyles[a] = win.bigGroup.sGroup.paraPanel.lb.selection[a].styleRef;
                }
            }

            var findCharStyles = [];
            if (win.bigGroup.csGroup.paraPanel.lb.selection) {
                for (var a = 0; a < win.bigGroup.csGroup.paraPanel.lb.selection.length; a++) {
                    findCharStyles[a] =  win.bigGroup.csGroup.paraPanel.lb.selection[a].styleRef;
                }
            }

            var wObjects = [], workIndex;

            if (win.bigGroup.fGroup.tpPanel.chkRemoveTopics.value) IndexFinder.clearIndex(app.activeDocument);

            if (app.activeDocument.indexes.length == 0) {
                workIndex = app.activeDocument.indexes.add();
            } else {
                workIndex = app.activeDocument.indexes[0];
            }


            if (app.selection.length == 0 || app.selection[0].constructor.name != 'TextFrame') {
                wObjects.push(app.activeDocument);
            } else {
                if (app.selection[0].constructor.name == 'TextFrame') {
                    wObjects.push (app.selection[0].parentStory);
                }
            }

            var maxvalue = IndexFinder.lineCounts(workfile) * wObjects.length,
                progress = new ProgressbarClass(maxvalue, "Process index strings", "InDex " + indexver, false);

            progress.increase();
            for (var i = 0, l = wObjects.length; i < l; i++) {
                var wObject = wObjects[i];
                workfile.open('r');
                do {
                    var cstr = workfile.readln();
                    if (cstr.substr(0,2) != '##') {
                        var el = cstr.split('->');
                        if (el.length > 0) {
                            progress.setLabel("Process " + cstr + "...");
                            IndexFinder.execute({
                                obj: wObject,
                                finds: el,
                                docIndex: workIndex,
                                paraStyles: findParaStyles,
                                charStyles: findCharStyles,
                                isCaseSens: isCaseSens
                            });
                            progress.increase();
                        }
                    }
                } while(workfile.eof == false);
                workfile.close();
            }
            progress.close();
            alert('Index is marked.', 'Ready!');
        }
    }

    return {
        run: main
    }
})();

app.doScript("IndexDoc.run();", ScriptLanguage.JAVASCRIPT, [], UndoModes.ENTIRE_SCRIPT, "Index6");
IndexDoc = null;
delete IndexDoc;
// Сборщик мусора
// Утверждают, что лучше вызывать два раза подряд
$.gc();$.gc();
