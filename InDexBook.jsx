#include "InDexFind.jsxinc"

if (app.documents.length == 0 && app.books.length > 0) {
	var bookstyledoc = app.open(app.activeBook.bookContents[0].fullName);
} else {
	if (app.documents.length > 0 && app.books.length > 0) { alert("Закройте все открытые публикации\nи запустите скрипт еще раз.", "Ошибка: Открыты публикации", true);  exit();}
	if (app.documents.length > 0 && app.books.length == 0) { alert("Нет открытых книг для обработки.\nЗакройте все открытые публикации,\nоткройте книгуи запустите скрипт еще раз.", "Ошибка: Открыты публикации и не открыта книга", true); exit(); }
	if (app.documents.length == 0 && app.books.length == 0) { alert("Нет открытых книг для обработки.\nОткройте книгу и запустите скрипт еще раз.", "Ошибка: Не открыта книга", true); exit(); }
}
var workfile = File.openDialog ('Выберите файл с данными', 'Text Files:*.txt', false); if (!workfile) { exit(); }
var res =  "dialog {\
		text:' inDex 5 ', properties: { }, \
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
			docGroup:Group {orientation:'column',\
				docPanel:Panel {text:'Documents', alignChildren:['fill', 'fill'], \
					chkall:Checkbox {text:'Select all', size:[120,26]},\
					lb:ListBox {size:[200,185], properties: {multiselect:true}},\
				},\
			},\
		},\
		bottomGroup:Group {orientation:'row', alignChildren:['fill','fill'], \
			creditGroup:Group {orientation:'row', alignChildren:['bottom','right'],\
				credit:StaticText{'text':'Vitaly Batushev / 2014'},\
			},\
			btnGroup:Group {orientation:'row', alignChildren:['bottom','right'],\
				btnOK:Button{name:'ok', text:'OK'},\
				btnCancel:Button{name:'cancel', text:'Cancel'},\
			},\
		},\
	}";
var win = new Window (res);

win.text = "InDex for Books ver. " + indexver + " by Vitaly Batushev ©";
win.bottomGroup.creditGroup.credit.text = "InDex for Books ver. " + indexver + " by Vitaly Batushev © 2014";

for (pr = 0;  pr < app.activeDocument.paragraphStyles.length; pr++) { win.bigGroup.sGroup.paraPanel.lb.add('item',app.activeDocument.paragraphStyles[pr].name); }
win.bigGroup.fGroup.casePanel.chk.value = false;

for (d = 0; d < app.activeBook.bookContents.length; d++) {
	win.bigGroup.docGroup.docPanel.lb.add('item', app.activeBook.bookContents[d].name);
}

win.bigGroup.docGroup.docPanel.chkall.onClick = function() {
	if (win.bigGroup.docGroup.docPanel.chkall.value) {
		win.bigGroup.docGroup.docPanel.lb.enabled = false;
	} else {
		win.bigGroup.docGroup.docPanel.lb.enabled = true;
	}
}

win.center();
result = win.show();
if (result == 1) {
	var processFootnotes = win.bigGroup.fGroup.prPanel.chk1.value; var processHiddenLayers =  win.bigGroup.fGroup.prPanel.chk2.value;  var processMasterPages =  win.bigGroup.fGroup.prPanel.chk5.value; var processLockedLayers =  win.bigGroup.fGroup.prPanel.chk3.value; var processLockedStories =  win.bigGroup.fGroup.prPanel.chk4.value;
	var caseSens = win.bigGroup.fGroup.casePanel.chk.value;
	var allDocs = win.bigGroup.docGroup.docPanel.chkall.value;

	if (!allDocs) {
		var findDocs = [];
		for (dd = 0; dd < win.bigGroup.docGroup.docPanel.lb.selection.length; dd++) {
			var bookCont= app.activeBook.bookContents.itemByName(win.bigGroup.docGroup.docPanel.lb.selection[dd].text);
			findDocs[dd] = bookCont.fullName;
		}
	}
	
    if (win.bigGroup.sGroup.paraPanel.lb.selection) {
		var  findStyles = [];
		for (fs = 0; fs < win.bigGroup.sGroup.lb.selection.length; fs++) {
			findStyles[fs] =  app.activeDocument.paragraphStyles.itemByName(win.bigGroup.sGroup.paraPanel.lb.selection[fs].text);
		}
	} else {
		var findStyles = '';
	}

	if (win.bigGroup.csGroup.paraPanel.lb.selection) {
		var findCharStyles = [];
		for (fs = 0; fs < win.bigGroup.csGroup.paraPanel.lb.selection.length; fs++) {
			findCharStyles[fs] =  app.activeDocument.characterStyles.itemByName(win.bigGroup.csGroup.paraPanel.lb.selection[fs].text);
		}
	} else {
		var findCharStyles = '';
	}

	app.findChangeGrepOptions.includeFootnotes = processFootnotes;
	app.findChangeGrepOptions.includeHiddenLayers = processHiddenLayers;
	app.findChangeGrepOptions.includeMasterPages = processMasterPages;
	app.findChangeGrepOptions.includeLockedLayersForFind = processLockedLayers;
	app.findChangeGrepOptions.includeLockedStoriesForFind = processLockedStories;

	try {
		bookstyledoc.close(SaveOptions.NO);
	} catch(e) {}

	var wObjects = new Array();
	if (app.books.length > 0) {
		if (allDocs) {
			for (ab = 0; ab < app.activeBook.bookContents.length; ab++) {
				wObjects.push(app.activeBook.bookContents[ab].fullName);
				var files = true;
			}
		} else {
			wObjects = findDocs;
		}
	} else {
		if (app.activeDocument.indexes.length == 0) { 
            var workIndex = app.activeDocument.indexes.add();
         } else {
             var workIndex = app.activeDocument.indexes[0];
          }
		workIndex.topics.everyItem().remove();
		if (app.selection.length == 0 || app.selection[0].constructor.name != 'TextFrame') { 
			wObjects.push(app.activeDocument);
		} else {
			if (app.selection[0].constructor.name == 'TextFrame') { 
				wObjects.push (app.selection[0].parentStory);
			}
		}
		var files = false;
	}

	for (w = 0; w < wObjects.length; w++) {
		if (files) {
			var wObject = app.open(wObjects[w]);
			if (wObject.indexes.length == 0) { var workIndex = wObject.indexes.add(); } else { var workIndex = wObject.indexes[0]; }
			workIndex.topics.everyItem().remove();
		} else {
			var wObject = wObjects[w];
		}
		workfile.open('r');
		do {
			var cstr = workfile.readln();
			if (cstr.substr(0,2) != '##') {
				var el = cstr.split('->');
				if (el.length > 0) { 
					wObject.indexFind(el, workIndex, findStyles, findCharStyles, caseSens);
				}
			}
		} while(workfile.eof == false);
		workfile.close();
		if (files) {
			wObject.close(SaveOptions.YES);
		}
	}
	alert('Готово!', 'Разметка индекса');
}
