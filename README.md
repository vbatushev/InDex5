InDex6
======

Скрипт для Adobe InDesign CS3+ разметки текста для указателей (index)

### Преамбула
Скрипт InDex6 предназначен для поиска и маркировки для предметного указателя слов или выражений в публикациях Adobe InDesign на основе списка слов, составленных пользователем.

Скрипт представлен в двух видах:
- InDex6.jsx, нескомпилированный файл, для его работы требуются файлы IndexDialog.jsxinc и InDexFind.jsxinc
- InDex6.jsxbin, скомпилированный файл, который можно использовать сам по себе

Скрипт **не составляет** предметный указатель, а расставляет метки pageReference в тексте, прописывая в объект Index публикации необходимые темы (topics).

После работы скрипта вы можете собрать предметный указатель штатным средством Adobe InDesign **Указатель (Index)** (Окно > Текст и таблицы > Указатель, Shift + F8).

![Панель Указатель](https://raw.githubusercontent.com/vbatushev/InDex5/master/images/index_panel.png)

### Установка

Скачайте файл InDex6.jsxbin(https://raw.githubusercontent.com/vbatushev/InDex5/master/InDex6.jsxbin), поместите его в папку InDesign для скриптов и запустите.

Либо склонируйте репозиторий (git clone) в папку скриптов InDesign и запустите либо InDex6.jsxbin, либо InDex6.jsx.

### Использование

Для работы со скриптом необходимо создать текстовый файл (.txt) с перечнем слов и выражений для поиска.

Каждое слово или выражение, предназначенное для поиска, должно находится в отдельной строке файла.

В скрипте приняты следующие разделители полей в строках файла со списком обрабатываемых слов:

**->** — разделяет наименования вложенных тем (topic).

Например:
> Уровень 1->Уровень 2->Уровень 3->Термин

Необходимо помнить, что Adobe InDesign поддерживает **только 4 уровня** указателя.

Отсутствие вложенности указывает скрипту, что выражение должно быть помещено в корень индекса.

Например:
> Термин

**=>** — позволяет разделить слово или выражение, записываемое в качестве наименования, и поисковый запрос, который можно оформить в виде GREP-выражения. Грамотное использование регулярных выражений позволит вам найти все словоформы искомого слова.

Например, приведенная строка позволяет найти все формы слова "термин" — термин, термина, термином, термину, терминами и т.д.:
> Термин=>термин[а-я]{0,3}

В качестве символа комментария используется двойной символ **#**.

Например, нижеследующая строка обрабатываться не будет:
> \#\#Термин=>термин[а-я]{0,3}

![Диалоговое окно скрипт InDexDoc.jsx](https://raw.githubusercontent.com/vbatushev/InDex5/master/images/index_dialog.png)

В диалоговом окне необходимо выбрать (1) текстовый файл с перечнем слов и выражений для поиска, а также указать:

2. стили абзацев, если необходимо обрабатывать только абзацы с данными стилями
3. стили символов, если необходимо обрабатывать текст только с данными стилями
4. нужно ли удалять все предыдущие созданные темы в индексе публикации или книги (Old topics in index Remove all)
5. учитывать ли регистры при поиске (Search with Case Sensitive)
6. нужно ли обрабатывать:
	- сноски (Footnotes),
	- скрытые слои (Hidden Layers),
	- заблокированные слои (Locked Layers),
	- заблокированные тексты (Locked Stories),
	- шаблоны (Master Pages).

