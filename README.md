InDex5
======

Скрипт для Adobe InDesign CS3+ для создания предметных указателей

###Преамбула
Скрипт InDex5 предназначен для поиска и маркировки для предметного указателя слов или выражений в публикациях Adobe InDesign на основе списка слов, составленных пользователем.

Скрипт состоит из двух исполняемых файлов:
- InDexBook.jsx, предназначенный для обработки книг (book) в Adobe InDesign
- InDexDoc.jsx, предназначенный для обработки отдельных публикаций (document)

Кроме того, в файле InDexFind.jsxinc находится общий для обоих исполняемых файлов код для поиска слов.

Скрипт **не составляет** предметный указатель, а расставляет метки pageReference в тексте, прописывая в объект Index публикации необходимые темы (topics).

После работы скрипта вы можете собрать предметный указатель штатным средство Adobe InDesign **Указатель (Index)**.

![Панель Указатель](https://raw.githubusercontent.com/vbatushev/InDex5/master/images/index_panel.png)

###Использование

Для работы со скриптом необходимо создать текстовый файл (.txt) с перечнем слов и выражений для поиска.

Каждое слово или выражение, предназначенное для поиска, должно находится в отдельной строке файла.

В скрипте приняты следующие разделители полей в строке:

**->** — данный символ разделяет наименования вложенных тем (topic).

Например:
> Уровень 1->Уровень 2->Уровень 3->Термин

Необходимо помнить, что Adobe InDesign поддерживает только 

Отсутствие вложенности указывает скрипту, что выражение должно быть помещено в корень индекса.

Например:
> Термин

**=>** — данный символ позволяет разделить слово или выражение, записываемое в качестве наименования, и поисковый запрос, который можно оформить в виде GREP-выражения. Грамотное использование регулярных выражений позволит вам найти все словоформы искомого слова.

Например, приведенная строка позволяет найти все формы слова "термин" — термин, термина, термином, термину, терминами и т.д.:
> Термин=>термин[а-я]{0,3}

![Диалоговое окно скрипт InDexDoc.jsx](https://raw.githubusercontent.com/vbatushev/InDex5/master/images/index_dialog.png)
