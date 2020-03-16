function BookDialog(indexver, workfile) {
    var res =
        "palette {\
            text:' inDex 6 ', \
            properties: { \
                resizeable: false, \
                maximizeButton: false, \
                minimizeButton: false, \
                bounds: [100, 100, 380, 245] \
            }, \
            bigGroup:Group {orientation:'row', alignChildren:['fill','fill'], \
                fGroup:Group {orientation:'column', alignChildren:['fill','top'], \
                    tpPanel:Panel {orientation:'row', alignChildren:['fill', 'fill'], margins:[10,16,10,10], text:'Old Topics in Index', \
                        chkRemoveTopics:Checkbox{text:' Remove all', size:[120,16]},\
                    },\
                    casePanel:Panel {orientation:'column', alignChildren:['fill', 'fill'], margins:[10,16,10,10], text:'Search', \
                        chk:Checkbox {text:'  Case Sensitive', size:[120,16]}, \
                    },\
                    prPanel:Panel {orientation:'column', margins:[10,16,10,10], alignChildren:['fill', 'fill'], text:'Process', \
                            chk1:Checkbox {text:'  Footnotes', size:[120,16]}, value: true, \
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
                docGroup:Group {orientation:'column',\
                    docPanel:Panel {text:'Documents', alignChildren:['fill', 'fill'], \
                        chkall:Checkbox {text:'Select all', size:[120,26]}, value: true, \
                        lb:ListBox {size:[200,185], properties: {multiselect:true}},\
                    },\
                },\
            },\
            bottomGroup:Group {orientation:'row', size: [630, 24], alignChildren:['right','center'], \
                btnOK:Button{name:'ok', text:'OK'},\
                btnCancel:Button{name:'cancel', text:'Cancel'},\
            },\
        }";
    var win = new Window(res);

    win.text = 'InDex for Books ' + indexver + ' by Vitaly Batushev ©';

    var findParaStyles = [];
    if (win.bigGroup.sGroup.paraPanel.lb.selection) {
        for (var fs = 0; fs < win.bigGroup.sGroup.lb.selection.length; fs++) {
            findParaStyles[fs] = app.activeDocument.paragraphStyles.itemByName(win.bigGroup.sGroup.paraPanel.lb.selection[fs].text);
        }
    }

    var findCharStyles = [];
    if (win.bigGroup.csGroup.paraPanel.lb.selection) {
        for (var fs = 0; fs < win.bigGroup.csGroup.paraPanel.lb.selection.length; fs++) {
            findCharStyles[fs] = app.activeDocument.characterStyles.itemByName(win.bigGroup.csGroup.paraPanel.lb.selection[fs].text);
        }
    }

    for (var d = 0; d < app.activeBook.bookContents.length; d++) {
        win.bigGroup.docGroup.docPanel.lb.add('item', app.activeBook.bookContents[d].name);
    }

    win.bigGroup.docGroup.docPanel.chkall.onClick = function() {
        if (win.bigGroup.docGroup.docPanel.chkall.value) {
            win.bigGroup.docGroup.docPanel.lb.enabled = false;
        } else {
            win.bigGroup.docGroup.docPanel.lb.enabled = true;
        }
    };

    win.center();

    result = win.show();

    if (result == 1) {
        var processFootnotes = win.bigGroup.fGroup.prPanel.chk1.value;
        processHiddenLayers = win.bigGroup.fGroup.prPanel.chk2.value;
        processMasterPages = win.bigGroup.fGroup.prPanel.chk5.value;
        processLockedLayers = win.bigGroup.fGroup.prPanel.chk3.value;
        processLockedStories = win.bigGroup.fGroup.prPanel.chk4.value;
        caseSens = win.bigGroup.fGroup.casePanel.chk.value;
        allDocs = win.bigGroup.docGroup.docPanel.chkall.value;

        var wObjects = [];
        if (allDocs) {
            for (var a = 0; a < app.activeBook.bookContents.length; a++) {
                wObjects.push(app.activeBook.bookContents[a].fullName);
            }
        } else {
            for (var a = 0; a < win.bigGroup.docGroup.docPanel.lb.selection.length; a++) {
                var bookCont = app.activeBook.bookContents.itemByName(win.bigGroup.docGroup.docPanel.lb.selection[a].text);
                wObjects[a] = bookCont.fullName;
            }
        }

        var findParaStyles = [];
        if (win.bigGroup.sGroup.paraPanel.lb.selection) {
            for (var a = 0; a < win.bigGroup.sGroup.lb.selection.length; a++) {
                findParaStyles[a] = app.activeDocument.paragraphStyles.itemByName(win.bigGroup.sGroup.paraPanel.lb.selection[a].text);
            }
        }

        var findCharStyles = [];
        if (win.bigGroup.csGroup.paraPanel.lb.selection) {
            for (var a = 0; fs < win.bigGroup.csGroup.paraPanel.lb.selection.length; a++) {
                findCharStyles[a] = app.activeDocument.characterStyles.itemByName(win.bigGroup.csGroup.paraPanel.lb.selection[a].text);
            }
        }

        app.findChangeGrepOptions.includeFootnotes = processFootnotes;
        app.findChangeGrepOptions.includeHiddenLayers = processHiddenLayers;
        app.findChangeGrepOptions.includeMasterPages = processMasterPages;
        app.findChangeGrepOptions.includeLockedLayersForFind = processLockedLayers;
        app.findChangeGrepOptions.includeLockedStoriesForFind = processLockedStories;

        try {
            bookstyledoc.close(SaveOptions.NO);
        } catch (e) {}

        var maxvalue = IndexFinder.lineCounts(workfile) * wObjects.length,
            progress = new ProgressbarClass(maxvalue, 'Process index strings', 'InDex ' + indexver, false);

        progress.increase();
        for (var i = 0, l = wObjects.length; i < l; i++) {
            var wObject = wObjects[i];
            workfile.open('r');
            do {
                var cstr = workfile.readln();
                if (cstr.substr(0, 2) != '##') {
                    var el = cstr.split('->');
                    if (el.length > 0) {
                        progress.setLabel('Process ' + cstr + '...');
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
            } while (workfile.eof == false);
            workfile.close();
        }
        progress.close();
        alert('Index is marked.', 'Ready!');
    }
};
