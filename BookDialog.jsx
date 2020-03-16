function BookDialog(indexver, workfile) {
    app.open(app.activeBook.bookContents[0].fullName);
    var res =
        "dialog {\
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

    for (var a = 0; a < app.activeDocument.paragraphStyles.length; a++) {
        var styleItem = win.bigGroup.sGroup.paraPanel.lb.add('item', app.activeDocument.paragraphStyles[a].name);
        win.bigGroup.sGroup.paraPanel.lb.items[styleItem.index].styleRef = app.activeDocument.paragraphStyles[a];
    }

    for (var a = 0; a < app.activeDocument.paragraphStyleGroups.length; a++) {
        for (var b = 0, l = app.activeDocument.paragraphStyleGroups.item(a).paragraphStyles.length; b < l; b++) {
            var itemName =
                '[' +
                app.activeDocument.paragraphStyleGroups.item(a).name +
                '] ' +
                app.activeDocument.paragraphStyleGroups.item(a).paragraphStyles.item(b).name;
            var styleItem = win.bigGroup.sGroup.paraPanel.lb.add('item', itemName);
            win.bigGroup.sGroup.paraPanel.lb.items[styleItem.index].styleRef = app.activeDocument.paragraphStyleGroups.item(a).paragraphStyles.item(b);
        }
    }

    for (var a = 0; a < app.activeDocument.characterStyles.length; a++) {
        var styleItem = win.bigGroup.csGroup.paraPanel.lb.add('item', app.activeDocument.characterStyles[a].name);
        win.bigGroup.csGroup.paraPanel.lb.items[styleItem.index].styleRef = app.activeDocument.characterStyles[a];
    }
    for (var a = 0; a < app.activeDocument.characterStyleGroups.length; a++) {
        for (var b = 0, l = app.activeDocument.characterStyleGroups.item(a).characterStyles.length; b < l; b++) {
            var itemName =
                '[' +
                app.activeDocument.characterStyleGroups.item(a).name +
                '] ' +
                app.activeDocument.characterStyleGroups.item(a).characterStyles.item(b).name;
            var styleItem = win.bigGroup.csGroup.paraPanel.lb.add('item', itemName);
            win.bigGroup.csGroup.paraPanel.lb.items[styleItem.index].styleRef = app.activeDocument.characterStyleGroups.item(a).characterStyles.item(b);
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
        var props = {
            footnotes: win.bigGroup.fGroup.prPanel.chk1.value,
            hiddenLayers: win.bigGroup.fGroup.prPanel.chk2.value,
            masterPages: win.bigGroup.fGroup.prPanel.chk5.value,
            lockedLayers: win.bigGroup.fGroup.prPanel.chk3.value,
            lockedStories: win.bigGroup.fGroup.prPanel.chk4.value,
            isCaseSens: win.bigGroup.fGroup.casePanel.chk.value,
            paragaphStyles: [],
            characterStyles: [],
            workObjects: [],
            workFile: workfile
        };
        allDocs = win.bigGroup.docGroup.docPanel.chkall.value;

        var docs = [];
        if (allDocs) {
            for (var a = 0; a < app.activeBook.bookContents.length; a++) {
                docs.push(app.activeBook.bookContents[a].fullName);
            }
        } else {
            for (var a = 0; a < win.bigGroup.docGroup.docPanel.lb.selection.length; a++) {
                var bookCont = app.activeBook.bookContents.itemByName(win.bigGroup.docGroup.docPanel.lb.selection[a].text);
                docs.push(bookCont.fullName);
            }
        }

        if (win.bigGroup.sGroup.paraPanel.lb.selection) {
            for (var a = 0; a < win.bigGroup.sGroup.lb.selection.length; a++) {
                props.paragaphStyles[a] = win.bigGroup.sGroup.paraPanel.lb.selection[a].styleRef;
            }
        }

        if (win.bigGroup.csGroup.paraPanel.lb.selection) {
            for (var a = 0; fs < win.bigGroup.csGroup.paraPanel.lb.selection.length; a++) {
                props.characterStyles[a] = win.bigGroup.csGroup.paraPanel.lb.selection[a].styleRef;
            }
        }
        app.activeDocument.close(SaveOptions.NO);

        for (var a = 0, l = docs.length; a < l; a++) {
            app.open(docs[a]);
            props.workObjects = [app.activeDocument];
            if (app.activeDocument.indexes.length == 0) {
                props.workIndex = app.activeDocument.indexes.add();
            } else {
                props.workIndex = app.activeDocument.indexes[0];
            }
            IndexFinder.run(props);
        }
        alert('Index is marked.', 'Ready!');
    }
};
