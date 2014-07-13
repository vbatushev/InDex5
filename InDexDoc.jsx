#include "InDexFind.jsxinc"

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

win.text = "InDex for Document ver. " + indexver + " by Vitaly Batushev ©";
win.bottomGroup.creditGroup.credit.text = "InDex for Document ver. " + indexver + " by Vitaly Batushev © 2014";

for (pr = 0;  pr < app.activeDocument.paragraphStyles.length; pr++) { win.bigGroup.sGroup.paraPanel.lb.add('item',app.activeDocument.paragraphStyles[pr].name); }
for (pr = 0;  pr < app.activeDocument.characterStyles.length; pr++) { win.bigGroup.csGroup.paraPanel.lb.add('item',app.activeDocument.characterStyles[pr].name); }
win.bigGroup.fGroup.casePanel.chk.value = false;

win.center();
result = win.show();
if (result == 1) {
	var processFootnotes = win.bigGroup.fGroup.prPanel.chk1.value; var processHiddenLayers =  win.bigGroup.fGroup.prPanel.chk2.value;  var processMasterPages =  win.bigGroup.fGroup.prPanel.chk5.value; var processLockedLayers =  win.bigGroup.fGroup.prPanel.chk3.value; var processLockedStories =  win.bigGroup.fGroup.prPanel.chk4.value;
	var caseSens = win.bigGroup.fGroup.casePanel.chk.value;

	if (win.bigGroup.sGroup.paraPanel.lb.selection) {
		var  findStyles = [];
		for (fs = 0; fs < win.bigGroup.sGroup.paraPanel.lb.selection.length; fs++) {
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

	var wObjects = new Array();

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

	for (w = 0; w < wObjects.length; w++) {
		var wObject = wObjects[w];
		workfile.open('r');
		do {
			var el = workfile.readln().split('->');
			if (el.length > 0) { 
				wObject.indexFind(el, workIndex, findStyles, findCharStyles, caseSens);
			}
		} while(workfile.eof == false);
		workfile.close();
	}
	alert('Готово!', 'Разметка индекса');
}
