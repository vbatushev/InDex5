function IndexDialog(indexver) {
    // app.open(app.activeBook.bookContents[0].fullName);
    var res =
        "dialog {\
            text:' inDex 6 ', \
            properties: { \
                resizeable: false, \
                maximizeButton: false, \
                minimizeButton: false, \
                bounds: [100, 100, 380, 245] \
            }, \
            topGroup:Group {orientation:'row', alignChildren:['left','center'] \
                lbl:StaticText {text:'Select'}, \
                path:EditText {size:[360,24]}, \
                browse: Button{ text:'Browse...'},\
            },\
            bigGroup:Group {orientation:'row', alignChildren:['fill','fill'], \
                sGroup:Group {orientation:'column', alignChildren:['fill','top'], \
                    paraPanel:Panel {orientation:'row', alignChildren:['fill', 'fill'], margins:[10,16,10,10], text:'Select paragraph styles', \
                        lb:ListBox{size:[200,242], properties:{multiselect:true}},\
                    },\
                },\
                csGroup:Group {orientation:'column', alignChildren:['fill','top'], \
                    paraPanel:Panel {orientation:'row', alignChildren:['fill', 'fill'], margins:[10,16,10,10], text:'Select character styles', \
                        lb:ListBox{size:[200,242], properties:{multiselect:true}},\
                    },\
                },\
                fGroup:Group {orientation:'column', alignChildren:['fill','top'], \
                    tpPanel:Panel {orientation:'row', alignChildren:['fill', 'fill'], margins:[10,16,10,10], text:'Old topics in index', \
                        chkRemoveTopics:Checkbox{text:'Remove all', size:[130,16]},\
                    },\
                    casePanel:Panel {orientation:'column', alignChildren:['fill', 'fill'], margins:[10,16,10,10], text:'Search', \
                        chk:Checkbox {text:'with Case Sensitive', size:[130,16]}, \
                    },\
                    prPanel:Panel {orientation:'column', margins:[10,16,10,10], alignChildren:['fill', 'fill'], text:'Include', \
                            chk1:Checkbox {text:'Footnotes', size:[130,16]}, value: true, \
                            chk2:Checkbox {text:'Hidden layers', size:[130,16]}, \
                            chk3:Checkbox {text:'Locked layers', size:[130,16]}, \
                            chk4:Checkbox {text:'Locked stories', size:[130,16]}, \
                            chk5:Checkbox {text:'MasterPages', size:[130,16]}, \
                    },\
                },\
            },\
            bottomGroup:Group {orientation:'row', size: [630, 24], alignChildren:['right','center'], \
                btnOK:Button{name:'ok', text:'OK', enabled: false },\
                btnCancel:Button{name:'cancel', text:'Cancel'},\
            },\
        }";
    var win = new Window(res);

    win.text = ' InDex ' + indexver + ' by Vitaly Batushev';
    win.topGroup.lbl.text = docOpenDialogHead;

    win.topGroup.browse.onClick = function() {
        var f = File.openDialog(docOpenDialogHead, 'Text Files:*.txt', false);
        if (!!f) {
            win.topGroup.path.text = f.fullName;
            win.bottomGroup.btnOK.enabled = File(win.topGroup.path.text).exists;
        }
    }

    loadParagraphStyles(win.bigGroup.sGroup.paraPanel.lb, app.activeDocument);
    loadCharacterStyles(win.bigGroup.csGroup.paraPanel.lb, app.activeDocument);

    win.topGroup.path.onChanging = function() {
        if (trim(win.topGroup.path.text) == "") win.bottomGroup.btnOK.enabled = false;
        win.bottomGroup.btnOK.enabled = File(win.topGroup.path.text).exists;
    }

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
            workFile: File(win.topGroup.path.text)
        };

        if (win.bigGroup.sGroup.paraPanel.lb.selection) {
            for (var a = 0; a < win.bigGroup.sGroup.paraPanel.lb.selection.length; a++) {
                props.paragaphStyles[a] = win.bigGroup.sGroup.paraPanel.lb.selection[a].styleRef;
            }
        }

        if (win.bigGroup.csGroup.paraPanel.lb.selection) {
            for (var a = 0; a < win.bigGroup.csGroup.paraPanel.lb.selection.length; a++) {
                props.characterStyles[a] =  win.bigGroup.csGroup.paraPanel.lb.selection[a].styleRef;
            }
        }

        if (win.bigGroup.fGroup.tpPanel.chkRemoveTopics.value) IndexFinder.clearIndex(app.activeDocument);

        if (app.activeDocument.indexes.length == 0) {
            props.workIndex = app.activeDocument.indexes.add();
        } else {
            props.workIndex = app.activeDocument.indexes[0];
        }

        if (app.selection.length == 0 || app.selection[0].constructor.name != 'TextFrame') {
            props.workObjects.push(app.activeDocument);
        } else {
            if (app.selection[0].constructor.name == 'TextFrame') {
                props.workObjects.push (app.selection[0].parentStory);
            }
        }
        IndexFinder.run(props);
        alert('Index is marked.', 'Ready!');
    }

    function loadParagraphStyles(listBox, doc, suffix) {
        for (var a = 0; a < doc.paragraphStyles.length; a++) {
            var styleItem = listBox.add('item', doc.paragraphStyles[a].name);
            listBox.items[styleItem.index].styleRef = doc.paragraphStyles[a];
        }

        for (var a = 0; a < doc.paragraphStyleGroups.length; a++) {
            for (var b = 0, l = doc.paragraphStyleGroups.item(a).paragraphStyles.length; b < l; b++) {
                var itemName = '[' + doc.paragraphStyleGroups.item(a).name + '] ' + doc.paragraphStyleGroups.item(a).paragraphStyles.item(b).name,
                    styleItem = listBox.add('item', itemName);
                listBox.items[styleItem.index].styleRef = doc.paragraphStyleGroups.item(a).paragraphStyles.item(b);
            }
        }
    }

    function loadCharacterStyles(listBox, doc) {
        for (var a = 0; a < doc.characterStyles.length; a++) {
            var styleItem = listBox.add('item', doc.characterStyles[a].name);
            listBox.items[styleItem.index].styleRef = doc.characterStyles[a];
        }

        for (var a = 0; a < doc.characterStyleGroups.length; a++) {
            for (var b = 0, l = doc.characterStyleGroups.item(a).characterStyles.length; b < l; b++) {
                var itemName = '[' + doc.characterStyleGroups.item(a).name + '] ' + doc.characterStyleGroups.item(a).characterStyles.item(b).name,
                    styleItem = listBox.add('item', itemName);
                listBox.items[styleItem.index].styleRef = doc.characterStyleGroups.item(a).characterStyles.item(b);
            }
        }
    }

    function trim(str) {
        return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    }
};
