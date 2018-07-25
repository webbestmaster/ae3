/*jslint white: true, nomen: true */ // http://www.jslint.com/lint.html#options
(function(win) {
    'use strict';
    /*global window */
    /*global APP */

    win.APP = win.APP || {};

    APP.languages = APP.languages || {};

    APP.languages.ru = {
        language: 'Язык',
        languageName: 'Русский',
        shortLanguageName: 'Рус',
        appName: 'AE2FG',

        //theme: 'Theme',
        //share: 'Share',

        // title page
        play: 'Играть',
        online: 'По сети',
        settings: 'Настройки',
        instructions: 'Инструкции',
        about: 'О программе',

        // settings
        on: 'вкл',
        off: 'выкл',
        music: 'музыка',
        vibrate: 'вибро',
        help: 'помощь',
        youCanDisableHelpNotification: "Вы можете включить/отключить подсказки из 'Настройки'",
        fightAnimation: 'анимация боя',
        gameSpeed: 'Скорость игры',
        confirmTurn: 'подтверждение хода',
        confirmMove: 'подтверждение движения юнита',
        confirmAttack: 'подтверждение атаки',
        'gameSpeed-1': 'оч. медленно',
        'gameSpeed-2': 'медленно',
        'gameSpeed-3': 'обычная',
        'gameSpeed-4': 'быстро',
        'gameSpeed-5': 'оч. быстро',
        mainSettings: 'Основные настройки',
        gameDifficulty: 'Сложность игры',
        font: 'Шрифт',
        easy: 'легко',
        normal: 'нормально',
        hard: 'трудно',
        buildingSmoke: 'дым из труб',
        unitAnimation: 'анимация юнитов',
        autoSave: 'автосохранение',

        // play
        companies: 'Компании',
        loadGame: 'Загрузить игру',
        selectLevel: 'Выбор уровня',
        skirmish: 'Схватка',
        userMaps: 'Свои карты',
        userMap: 'Своя карта',
        mission: 'Миссия',

        // setup skirmish
        player: 'Игрок',
        cpu: 'ЦПУ',
        none: 'Нет',
        money: 'Деньги',
        unitLimit: 'Лимит войск',
        fight: 'В бой',
        team: 'Команда',

        // colors
        blue: 'синий',
        red: 'красный',
        green: 'зелёный',
        black: 'чёрный',

        rateUs: {
            header: 'Пожалуйста, оцените приложение!',
            notNow: 'не сейчас',
            fiveStars: 'Да, 5 звёзд!'
        },

        // unit store
        unitStoreHeader: 'Войска',

        // popups
        endTurnQuestion: 'Закончить ход?',
        yes: 'Да',
        no: 'Нет',
        ok: 'Ок',
        continue: 'Продолжить',
        congratulations: 'Поздравления!',
        gameSaved: 'Игра сохранена',
        unlocked: 'доступна!',

        //save/load popup
        save: 'Сохранить',
        delete: 'Удалить',
        replace: 'Заменить',
        saveGame: 'Сохранить игру',
        areYouSureToDeleteSavedGame: 'Вы уверены, что хотите удалить сохранение?',
        areYouSureToLoadGame: 'Вы уверены, что хотите загрузить сохранение?',
        noSavedGames: 'Нет сохранённых игр',
        load: 'Загрузить',

        // end game
        blackDefeat: 'Чёрный игрок повержен!',
        blueDefeat: 'Синий игрок повержен!',
        greenDefeat: 'Зелёный игрок повержен!',
        redDefeat: 'Красный игрок повержен!',
        victory: 'Победа!',
        defeat: 'Поражение!',
        missionComplete: 'Миссия завершена!',
        restartBattle: 'Заново',
        quitBattle: 'Выход',
        areYouSureToQuitBattle: 'Вы уверены, что хотите покинуть сражение?',
        areYouSureToRestartBattle: 'Вы уверены, что хотите перезапустить сражение?',

        // notification
        objective: 'Цель',
        skirmishObjective: 'Поразить вражеского командира и захватить все вражеские замки!',
        newTurn: 'Смена хода',
        income: 'Доход',
        tooMuchUnits: 'Слишком много юнитов!',

        //battle menu
        menu: 'Меню',

        // map editor
        mapEditor: 'Редактор карт',
        maps: 'Карты',
        width: 'Ширина',
        height: 'Высота',
        name: 'Имя',
        colors: 'Цвета',
        open: 'Открыть',
        clean: 'Очистить',
        exit: 'Выход',
        areYouSureToLeaveMapEditor: 'Вы уверены что хотите выйти из редактора карт?',
        unsavedMapProgressWillBeLost: 'Не сохранённые данные будут потеряны!',
        noSavedMaps: 'Нет сохранённых карт',
        youAreSureToDeleteMap: 'Вы уверены что хотите удалить карту?',
        mapHasBeenSaved: 'карта была сохранена.',
        mapHasBeenDeleted: 'карта была удалена',
        cleanMapNotSavedDataWillBeLost: 'Очистить карту? Не сохранённые данные будут потеряны!',
        needMoreUnitsOrBuildings: 'Нужно больше Юнитов или Зданий',
        enterMapName: 'Введите имя карты',
        mapName: 'Имя карты',

        // other
        disableAllTips: 'Отключить ВСЕ подсказки',

        //aboutText: 'Ancient Empire: strike back.<br><br><br>Программист:<br>Дмитрий Туровцов<br><br>Благодарности:<br>Алексей Данилов<br>Павел Прилуцкий<br>Игорь Купреев<br>Павел Сычиков',
        aboutText: '<br>Ancient Empire:<br>Strike Back<br><br>Древняя Империя:<br>Ответный Удар<br><br><br>',
        instructionsText: [
            "'Ancient Empire: Strike Back' - это захватывающая стратегия, которая позволяет вам управлять Королем Галамаром и его братом Валадорном в попытках защитить их королевство от зла.",
            'Далее последуют инструкции, подсказки и советы о том, как играть, которые также будут появляться в игре.',
            'Красные квадраты помечают область перемещения единицы. Границы единицы определяется ее типом и местностью, на которой она стоит.',
            'Разные типы местности влияют на способности единиц к передвижению, атаке и защите. Например, горы добавляют боевым единицам очки защиты, но замедляют скорость передвижения. Когда вы двигаете курсор через такие места, их особенности появляются внизу экрана.',
            'Когда единица завершит движение, она сменит цвет на серый. Она означает, что единица не может быть использована снова до следующего вашего хода.',
            "Вы можете перемещать единицу только один раз за ход. Когда вы закончите движение всех ваших единиц, то выберите 'конец хода'.",
            'Единицы становятся более сильными, получая опыт в битвах.',
            'Вы можете увидеть пределы атаки любой единицы нажатием двойным нажатием на неё, когда она выбрана.',
            "Чтобы атаковать вражескую единицу, сдвиньте вашу единицу в пределы атаки и выберите 'атака'. Если в пределах атаки находятся несколько врагов, выберите, какую единицу атаковать. Успех атаки определяется характеристиками единиц и местностью.",
            'Только командир может занять замок. Как только замок оккупирован, вы можете покупать новые единицы за золото. Командиру не обязательно оставаться в замке, чтобы покупать единицы.',
            "Вы можете занимать здания, переместив Солдата или Командира на него и выбрав 'занять'. Как только здание будет занято, оно сменит цвет. Если здание повреждено, вам придется отремонтировать его, перед тем как занять.",
            'Как только здание будет занято, оно начнет приносить золото. Чем больше зданий вы займете, тем больше заработаете.',
            'Единицы могут лечиться в занятых зданиях. Чем больше единица находится в здании, тем больше жизни восстановится.',
            'Если Командир погибнет в битве, его можно будет оживить в замке.',
            'Водные Элементалы - земноводные, что увеличивает им перемещение, атаку и защиту, когда они в воде.',
            'Атака Жутких Волков ядовита. Отравленная единица становится медленной и вялой в следующем ходе.',
            "Ведьма имеет силу поднимать скелетов-воинов из могил павших солдат. После поражения единицы на ее месте на 1 ход появится надгробие. Переместите Ведьму к надгробию и выберите 'поднять'.",
            'Используйте Виспов, чтобы обеспечить ближайшие дружественные единицы аурой, которая усиливает их атаку.',
            'Катапульта может уничтожать вражеские города, что помогает прервать поток золота.',
            'Держите ваших Драконов подальше от вражеских стрелков, потому что они уязвимы перед стрелами!'
        ],
        helpList: [
            // 0
            {
                img: 'img/help/select-unit.png',
                text: [
                    'Что бы выбрать еденицу нажмите (<img src="img/help/tap-finger.png" class="icon-in-text" />) на неё.',
                    '<img src="img/help/finger-on-red-square.png" class="icon-in-text" /> - Красные квадраты помечают область перемещения единицы.',
                    'Границы единицы определяется ее типом и местностью, на которой она стоит.'
                ]
            },
            // 1
            {
                img: 'img/help/attack.png',
                text: [
                    'Чтобы атаковать вражескую единицу, сдвиньте вашу единицу в пределы атаки и выберите <img src="img/help/attack-icon.png" class="icon-in-text" />.',
                    'Если в пределах атаки находятся несколько врагов, выберите, какую единицу атаковать. Успех атаки определяется характеристиками единиц и местностью.'
                ]
            },
            // 2
            {
                //img: 'img/help/occupy-castle.png',
                text: [
                    'Только командир может занять (<img src="img/help/occupy-building-icon.png" class="icon-in-text" />) замок.',
                    'Как только замок оккупирован, вы можете покупать новые единицы за золото.',
                    'Командиру не обязательно оставаться в замке, чтобы покупать единицы.'
                ]
            },
            // 3
            {
                //img: 'img/help/occupy-farm.png',
                text: [
                    'Вы можете занимать здания, переместив Солдата или Командира на него и выбрав \'занять\' (<img src="img/help/occupy-building-icon.png" class="icon-in-text" />).',
                    'Как только здание будет занято, оно сменит цвет.',
                    'Если здание повреждено, вам придется отремонтировать (<img src="img/help/fix-building-icon.png" class="icon-in-text" />) его, перед тем как занять.'
                ]
            },
            // 4
            {
                img: 'img/help/raise.png',
                text: [
                    'Ведьма имеет силу поднимать скелетов-воинов из могил павших солдат.',
                    'После поражения единицы на ее месте на 1 ход появится надгробие.',
                    'Переместите Ведьму к надгробию и выберите \'поднять\' <img src="img/help/attack-icon.png" class="icon-in-text" />.'
                ]
            }
        ],
        unitsList: {
            soldier: {
                name: 'Солдат',
                description:
                    'Солдаты это солидные всесторонние бойцы, которые сформируют костяк любой армии. Также солдаты - единственная единица, которая может захватывать города, приносящие золото.'
            },
            archer: {
                name: 'Лучник',
                description:
                    'Со своими мощными луками стрелки могут атаковать на расстоянии и особенно эффективны против летающих врагов.'
            },
            elemental: {
                name: 'Элементаль',
                description:
                    'Элементалы это магические водяные духи. Будучи в воде, Элементалы быстрее передвигаются и лучше защищаются.'
            },
            sorceress: {
                name: 'Ведьма',
                description:
                    'Натасканные в использовании магии, Ведьмы слабы в ближнем бою. Однако, их способность к вызову боевых скелетов из мертвых войск может стать решающей в битве.'
            },
            wisp: {
                name: 'Висп',
                description:
                    'Эти мистические существа чистого света излучают ауру, которая усиливает способности к атаке у ближайших дружественных единиц. В ближнем бою они особенно смертельны против скелетов.'
            },
            'dire-wolf': {
                name: 'Жуткий волк',
                description:
                    'Жуткие Волки - опасные охотники, которые передвигаются стаями. Будьте осторожны - их укусы ядовиты, что умельшает и атаку, и защиту на один ход.'
            },
            golem: {
                name: 'Голем',
                description:
                    'Големы - это древние существа - медленны, но необычайно сильны в защите. Голема, расположенного в здании или хорошо защищенной горе очень сложно победить.'
            },
            catapult: {
                name: 'Катапульта',
                description:
                    'Катапульты приносят опустошение везде, куда достанут со своей гигантской зоной атаки. Однако, они относительная неподвижность и неспособность атаковать вблизи делают их уязвимыми, так что защищайте их хорошо. Катапульты могут передвигаться и атаковать в течении хода, но только что-нибудь одно за ход.'
            },
            dragon: {
                name: 'Дракон',
                description:
                    'Эти грациозные летающие твари правят над горами с древнейших времен. Они чрезвычайно подвижны, а так же смертельно опасны в атаках на земле, воздухе и в море.'
            },
            skeleton: {
                name: 'Скелет',
                description:
                    'Вызванные ведьмами, эти безжизненные воины сильны как солдаты и смертельные оппоненты на любом поле боя.'
            },
            galamar: {
                name: 'Галамар',
                description:
                    'Галамар (командир) очень силен в атаке и защите. Командиры могут также занимать замки, чтобы производить войска, и их можно оживлять в замке, если они умрут в битве.'
            },
            valadorn: {
                name: 'Валадорн',
                description:
                    'Валадорн (командир) очень силен в атаке и защите. Командиры могут также занимать замки, чтобы производить войска, и их можно оживлять в замке, если они умрут в битве.'
            },
            'demon-lord': {
                name: 'Демон Лорд',
                description:
                    'Демон лорд (командир) очень силен в атаке и защите. Командиры могут также занимать замки, чтобы производить войска, и их можно оживлять в замке, если они умрут в битве.'
            },
            saeth: {
                name: 'Саеф',
                description:
                    'Саеф (командир) очень силен в атаке и защите. Командиры могут также занимать замки, чтобы производить войска, и их можно оживлять в замке, если они умрут в битве.'
            },
            crystal: {
                name: 'Кристалл',
                description:
                    'Эти легендарные кристаллы были изначально выкопаны из руин Античной Цитадели. Мало что известно об их силе, за исключением того, что они, по слухам, могут защитить королевство, а также обладают силой, чтобы уничтожить его.'
            }
        },

        story: {
            list: [
                // 0
                'img/story/story-1-1.png_!_После завершения войны против сил тьмы, братья Галамар и Валадорн воссоединились в правлениии королевства Торин. Королевство медленно возвращалось к мирной жизни, защищенное тремя античными кристаллами, защищенными в храмах Отваги, Мудрости и Жизни, когда достигли дворца слухи о схватках на Севере...',
                // 1
                "img/story/story-1-2.png_!_'И три было их числом, три для защиты, три для уничтожения. Сжалься над их силой, сжалься над нашими душами, пусть Он спустит небесные огни на наш мир.'<br />[Стих 3:7 из  Предсказаний Кристаллов, автор неизвестен, был переведен из единственного уцелевшего манускрипта Времен Тьмы]",
                // 2
                'img/story/story-1-3.png_!_Посланник из Храма Отваги прибыл к воротам замка, с мольбой о поддержке Короля - Храм пал под натиском зверских атакующих, и должен быть защищен...',
                // 3
                'img/story/story-4-1.png_!_С помощью Элементалов, Король Галамар в конце концов достиг Храма Жизни, в одном шаге от врагов...',
                // 4
                'img/story/story-8-1.png_!_Галамар и Валадорн проследовали по пути разрушений, оставленных драконом и обнаружили руины Античной Цитадели...',
                // 5
                "img/story/story-8-2.png_!_'И Земля задрожит, и небеса заплачут. За Него, который разрушит разрушителя, за Него, который заберет берущего. И новая эра, свободная он зла и тьмы наступит.'<br>[Последний стих из  Предсказаний Кристаллов, автор неизвестен, никогда не переводился, был потерян в веках тьмы]"
            ]
        }
    };
})(window);
