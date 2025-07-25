(async function() {

    function createSetting(name) {
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.marginBottom = "5px";
    
        const text = document.createElement("p");
        text.textContent = name;
        text.classList = "textTheme settingText";
    
        div.appendChild(text);
    
        return div;
    };
    
    const buttonTextColors = {
        1: "rgb(0, 255, 0)",
        0: "rgb(255, 0, 0)"
    };
    
    let buttonStates = {}
    
    function buttonState(name, btn, bool) {
        btn.style.color = buttonTextColors[bool ? 1 : 0];
        btn.textContent = bool ? "On" : "Off";
        buttonStates[name] = bool;
    };
    
    function addButton(setting, name, initial, callback) {
        const btn = document.createElement("button");
        btn.classList = "settingButton";
    
        buttonState(name, btn, initial);
    
        btn.onclick = function() {
            const value = !buttonStates[name];
            buttonState(name, btn, value);
            callback(value);
        };
    
        setting.appendChild(btn);
    };
    
    function getSetting(key) {
        const unique = `settings_${key}`;
        return new Promise(function(resolve) {
            chrome.storage.local.get(unique, function(result) {
                resolve(result[unique]);
            });
        });
    };
    
    function setSetting(key, value) {
        const unique = `settings_${key}`;
        chrome.storage.local.set({[unique]: value});
    };

    function coalesce(value, replace) {
        if (value == null) {
            return replace
        };
        return value;
    };

    const squareBorders = createSetting("Square Borders");

    const squareDetection = createSetting("Square Detection");
    
    const settingA = "squareDetection";
    const valueA = coalesce(await getSetting(settingA), true);

    addButton(squareDetection, settingA, valueA, function(value) {
        squareBorders.style.display = value == false ? "flex" : "none";
        setSetting(settingA, value);
    });

    document.body.appendChild(squareDetection);

    
    const settingC = "squareBorders";
    addButton(squareBorders, settingC, coalesce(await getSetting(settingC), false), function(value) {
        setSetting(settingC, value);
    });

    squareBorders.style.display = valueA == false ? "flex" : "none";

    document.body.appendChild(squareBorders);


    const highlightBadges = createSetting("Check Ownership on Load");
    
    const settingD = "highlightBadges";
    addButton(highlightBadges, settingD, coalesce(await getSetting(settingD), true), function(value) {
        setSetting(settingD, value);
    });

    document.body.appendChild(highlightBadges);


    const replaceBL = createSetting("Replace Old Badge List");
    
    const settingB = "replaceBL";
    addButton(replaceBL, settingB, coalesce(await getSetting(settingB), false), function(value) {
        setSetting(settingB, value);
    });

    document.body.appendChild(replaceBL);


    const displayValue = createSetting("Display Value on Badge Page");
    
    const settingE = "displayValue";
    addButton(displayValue, settingE, coalesce(await getSetting(settingE), false), function(value) {
        setSetting(settingE, value);
    });

    document.body.appendChild(displayValue);

    const discordDiv = document.createElement("div");
    discordDiv.style.display = "flex";
    discordDiv.style.justifyContent = "center";
    discordDiv.style.marginTop = "10px";

    const discordButton = document.createElement("button");
    discordButton.classList = "settingButton";
    discordButton.textContent = "Join Discord";
    discordButton.style.padding = "5px 10px";
    discordButton.style.color = "rgb(114, 137, 218)"; // Discord blurple
    discordButton.onclick = () => {
        window.open("https://discord.gg/4W95daxyCT", "_blank");
    };

    discordDiv.appendChild(discordButton);
    document.body.appendChild(discordDiv);

})();