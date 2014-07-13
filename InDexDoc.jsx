var indexver = 5.3;

function trim (str, charlist) { var whitespace, l = 0, i = 0; str += ''; if (!charlist) { whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000"; } else { charlist += ''; whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1'); } l = str.length; for (i = 0; i < l; i++) { if (whitespace.indexOf(str.charAt(i)) === -1) { str = str.substring(i); break; } } l = str.length; for (i = l - 1; i >= 0; i--) { if (whitespace.indexOf(str.charAt(i)) === -1) { str = str.substring(0, i + 1);break;}} return whitespace.indexOf(str.charAt(0)) === -1 ? str : ''; }

Object.prototype.indexFind = function (findArray, workIndex, fStyles, fcStyles, caseSens) {

	app.findGrepPreferences = null; app.changeGrepPreferences = null;
	var parentObject = workIndex;
	for (var fa = 0; fa < findArray.length; fa++) {

		if (!caseSens) { var ss = "(?i)"; } else { var ss = "";}
		
		var findStrings = trim(findArray[fa]);
		
		var fss = findStrings.split('=>');
		if (fss.length > 1) {
			var topicName = fss[0];
			var findString = fss[1];
		} else {
			var findString = findStrings;
			var topicName = findStrings;
		}
		
		findFindString = ss + findString;
		if (parentObject.topics.itemByName(topicName).isValid) {
			var parObject = parentObject.topics.itemByName(topicName);
		} else {
			var parObject = parentObject.topics.add(topicName);
			app.findGrepPreferences.findWhat = findFindString;
			var myFinds = this.findGrep(true);
			app.findGrepPreferences = null; app.changeGrepPreferences = null;
			if (myFinds) {
				for (f = 0; f < myFinds.length; f++) {
					myFinds[f].select(); var FindSelection = app.activeDocument.selection[0];
					if (fStyles == '') {
						for (cf = 0; cf < fcStyles.length; cf++) {
							if (FindSelection.appliedCharacterStyle == fcStyles[cf] || fcStyles[cf] == "") { 
								parObject.pageReferences.add(FindSelection, PageReferenceType.currentPage);
							}
						}
					} else {
						var test = false;
						for (tf = 0; tf < fStyles.length; tf++) {
							if (FindSelection.appliedParagraphStyle == fStyles[tf]) { test =true; }
							for (cf = 0; cf < fcStyles.length; cf++) {
								if (FindSelection.appliedCharacterStyle == fcStyles[cf] || fcStyles[cf] == "") { 
									test =true;
								} else {
									test = false;
								}
							}
						}
						if (test) {
							parObject.pageReferences.add(FindSelection, PageReferenceType.currentPage);
						}
					}
				}
			}
		}

		parentObject = parObject;
	}
}

if (app.documents.length == 0) {
	alert("Нет открытых публикаций. Откройте публикацию \nи запустите скрипт еще раз.", "Ошибка: Нет открытых публикаций", true);  exit();
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
