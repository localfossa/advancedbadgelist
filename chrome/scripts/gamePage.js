(async function() {
    async function wait(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms)
        })
    };

    async function waitFor(selector) {
        let waiting = null;
        while (!waiting) {
            await wait(200);
            const element = document.querySelector(selector);
            if (element) {
                waiting = element;
            };
        }
        return waiting;
    };

    function getSetting(key) {
        const unique = `settings_${key}`;
        return new Promise(function(resolve) {
            chrome.storage.local.get(unique, function(result) {
                resolve(result[unique]);
            });
        });
    };

    function coalesce(value, replace) {
        if (value == null) {
            return replace
        };
        return value;
    };

    const mainContainer = document.createElement("div");

    const headerDiv = document.createElement("div");
    headerDiv.style.marginBottom = "5px";

    const header = document.createElement("h2");
    header.textContent = "Advanced Badge List"
    header.style.display = "inline";
    header.style.marginRight = "5px";

    const startupBtn = document.createElement("button");
    startupBtn.classList = "input-field";
    startupBtn.textContent = "Fetch";
    startupBtn.style.marginRight = "5px";

    const fileInp = document.createElement("input");
    fileInp.type = "file";

    const importBtn = document.createElement("button");
    importBtn.classList = "input-field";
    importBtn.textContent = "Import";

    const recountBtn = document.createElement("button");
    recountBtn.textContent = "Recount";
    recountBtn.classList = "input-field";
    recountBtn.style.display = "none";
    recountBtn.style.marginRight = "5px";

    headerDiv.appendChild(header);
    headerDiv.appendChild(startupBtn);
    headerDiv.appendChild(importBtn);
    headerDiv.appendChild(recountBtn);

    mainContainer.appendChild(headerDiv);

    const filterDiv = document.createElement("div");
    filterDiv.style.display = "none";
    filterDiv.style.marginBottom = "5px";
    
    const labelA = document.createElement("p");
    labelA.textContent = "Filter by";
    labelA.style.display = "inline";
    labelA.style.marginRight = "5px";
    filterDiv.appendChild(labelA);

    const dropdownClass = document.createElement("style");
    dropdownClass.innerHTML = ".customDarkTheme {border: 2px inset rgba(0, 0, 0, 0.8); background-color: rgba(17, 18, 20, 0.9); padding: 2px}"
    document.head.appendChild(dropdownClass);

    const badgeType = document.createElement("select");
    badgeType.style.marginRight = "5px";
    badgeType.classList = "customDarkTheme";

    const optionAllA = document.createElement("option");
    optionAllA.value = 0;
    optionAllA.text = "All";

    const optionFree = document.createElement("option");
    optionFree.value = 1;
    optionFree.text = "Free";

    const optionValuable = document.createElement("option");
    optionValuable.value = 2;
    optionValuable.text = "Valuable";

    const optionLegacy = document.createElement("option");
    optionLegacy.value = 3;
    optionLegacy.text = "Legacy";
	
	const optionNVL = document.createElement("option");
    optionNVL.value = 4;
    optionNVL.text = "NVL";

    const optionNLV = document.createElement("option");
    optionNLV.value = 5;
    optionNLV.text = "NLV";

    badgeType.add(optionAllA);
    badgeType.add(optionFree);
    badgeType.add(optionValuable);
    badgeType.add(optionLegacy);
	badgeType.add(optionNVL);
    badgeType.add(optionNLV);

    const badgeOwnership = document.createElement("select");
    badgeOwnership.style.marginRight = "5px";
    badgeOwnership.classList = "customDarkTheme";

    const optionAllB = document.createElement("option");
    optionAllB.value = 0;
    optionAllB.text = "All";

    const optionOwned = document.createElement("option");
    optionOwned.value = 1;
    optionOwned.text = "Owned";

    const optionUnowned = document.createElement("option");
    optionUnowned.value = 2;
    optionUnowned.text = "Not Owned";

    badgeOwnership.add(optionAllB);
    badgeOwnership.add(optionOwned);
    badgeOwnership.add(optionUnowned);

    const badgeActivity = document.createElement("select");
    badgeActivity.classList = "customDarkTheme";

    const optionAllC = document.createElement("option");
    optionAllC.value = 0;
    optionAllC.text = "All";

    const optionActive = document.createElement("option");
    optionActive.value = 1;
    optionActive.text = "Active";

    const optionInactive = document.createElement("option");
    optionInactive.value = 2;
    optionInactive.text = "Inactive";

    badgeActivity.add(optionAllC);
    badgeActivity.add(optionActive);
    badgeActivity.add(optionInactive);

    const detectSquare  = coalesce(await getSetting("squareDetection"), true);
    const squareBorders = coalesce(await getSetting("squareBorders"), false);

    filterDiv.appendChild(badgeType);
    filterDiv.appendChild(badgeOwnership);
    filterDiv.appendChild(badgeActivity);

    let badgeShape;
    if (detectSquare) {
		badgeActivity.style.marginRight = "5px";
        badgeShape = document.createElement("select");
        badgeShape.classList = "customDarkTheme";

        const optionAllD = document.createElement("option");
        optionAllD.value = 0;
        optionAllD.text = "All";

        const optionSquare = document.createElement("option");
        optionSquare.value = 1;
        optionSquare.text = "Square";

        const optionCircle = document.createElement("option");
        optionCircle.value = 2;
        optionCircle.text = "Circle";

        badgeShape.add(optionAllD);
        badgeShape.add(optionSquare);
        badgeShape.add(optionCircle);
        filterDiv.appendChild(badgeShape);
    }

    mainContainer.appendChild(filterDiv);

    const searchDiv = document.createElement("div");
    searchDiv.style.display = "none";
    searchDiv.style.marginBottom = "5px";

    const labelB = document.createElement("p");
    labelB.textContent = "Search by";
    labelB.style.display = "inline";
    labelB.style.marginRight = "5px";
    searchDiv.appendChild(labelB);

    const searchType = document.createElement("select");
    searchType.style.marginRight = "5px";
    searchType.classList = "customDarkTheme";

    const optionName = document.createElement("option");
    optionName.value = 0;
    optionName.text = "Name";

    const optionDesc = document.createElement("option");
    optionDesc.value = 1;
    optionDesc.text = "Description";

    const optionAllE = document.createElement("option");
    optionAllE.value = 2;
    optionAllE.text = "All";

    searchType.add(optionName);
    searchType.add(optionDesc);
    searchType.add(optionAllE);

    searchDiv.appendChild(searchType);

    const searchMode = document.createElement("select");
    searchMode.style.marginRight = "5px";
    searchMode.classList = "customDarkTheme";

    const optionInclude = document.createElement("option");
    optionInclude.value = 0;
    optionInclude.text = "Include";

    const optionExclude = document.createElement("option");
    optionExclude.value = 1;
    optionExclude.text = "Exclude";

    searchMode.add(optionInclude);
    searchMode.add(optionExclude);

    searchDiv.appendChild(searchMode);

    const searchInput = document.createElement("input");
    searchInput.style.border = "border: 2px inset rgba(0, 0, 0, 0.8)";
    searchInput.style.backgroundColor = "rgba(17, 18, 20, 0.9)";
    searchInput.width = "300px";
    searchInput.placeholder = "search here";

    searchDiv.appendChild(searchInput);
    mainContainer.appendChild(searchDiv);

    const sortDiv = document.createElement("div");
    sortDiv.style.display = "none";
    sortDiv.style.marginBottom = "5px";

    const labelC = document.createElement("p");
    labelC.textContent = "Sort by";
    labelC.style.display = "inline";
    labelC.style.marginRight = "5px";
    sortDiv.appendChild(labelC);

    const SortBy = document.createElement("select");
    SortBy.style.marginRight = "5px";
    SortBy.classList = "customDarkTheme";

    const optionCreated = document.createElement("option");
    optionCreated.value = 0;
    optionCreated.text = "Created";

    const optionUpdated = document.createElement("option");
    optionUpdated.value = 1;
    optionUpdated.text = "Updated";

    const optionAwardedTotal = document.createElement("option");
    optionAwardedTotal.value = 2;
    optionAwardedTotal.text = "Awarded Total";

    const optionAwardedYesterday = document.createElement("option");
    optionAwardedYesterday.value = 3;
    optionAwardedYesterday.text = "Awarded Yesterday";

    SortBy.add(optionCreated);
    SortBy.add(optionUpdated);
    SortBy.add(optionAwardedTotal);
    SortBy.add(optionAwardedYesterday);

    sortDiv.appendChild(SortBy);

    const SortDirection = document.createElement("select");
    SortDirection.classList = "customDarkTheme";

    const optionAscending = document.createElement("option");
    optionAscending.value = 0;
    optionAscending.text = "Ascending";

    const optionDescending = document.createElement("option");
    optionDescending.value = 1;
    optionDescending.text = "Descending";

    SortDirection.add(optionAscending);
    SortDirection.add(optionDescending);

    sortDiv.appendChild(SortDirection);

    mainContainer.appendChild(sortDiv);

    const downloadDiv = document.createElement("div");
    downloadDiv.style.display = "none";
    downloadDiv.style.marginBottom = "2px";
    downloadDiv.style.alignItems = "center";

    const labelD = document.createElement("p");
    labelD.textContent = "Download";
    labelD.style.display = "inline";
    labelD.style.marginRight = "5px";
    downloadDiv.appendChild(labelD);

    const downloadBadgeList = document.createElement("button");
    downloadBadgeList.textContent = "List";
    downloadBadgeList.classList = "input-field";
    downloadBadgeList.style.marginRight = "5px";
    downloadBadgeList.style.height = "100%";
    downloadBadgeList.style.padding = "5px";

    const downloadCursors = document.createElement("button");
    downloadCursors.textContent = "Cursors";
    downloadCursors.classList = "input-field";
    downloadCursors.style.height = "100%";
    downloadCursors.style.padding = "5px";
    
    downloadDiv.appendChild(downloadBadgeList);
    downloadDiv.appendChild(downloadCursors);

    mainContainer.appendChild(downloadDiv);

    const statusDiv = document.createElement("div");

    const status = document.createElement("p");
    status.style.color = "#FFFFFF";
    status.textContent = "";
    statusDiv.appendChild(status);

    mainContainer.appendChild(statusDiv);

    const pagesDiv = document.createElement("div");
    pagesDiv.style.display = "none";
    pagesDiv.style.justifyContent = "center";
    pagesDiv.style.alignItems = "center";
    pagesDiv.style.marginBottom = "5px";

    const previousPage = document.createElement("button");
    previousPage.classList = "input-field";
    previousPage.textContent = "<";

    const displayPage = document.createElement("p");
    displayPage.style.color = "rgb(255, 255, 255)";
    displayPage.style.fontSize = "25px";
    displayPage.style.fontWeight = "bold";
    displayPage.style.marginRight = "10px";
    displayPage.style.marginLeft = "10px";
    displayPage.textContent = "0";

    const nextPage = document.createElement("button");
    nextPage.classList = "input-field";
    nextPage.textContent = ">";

    pagesDiv.appendChild(previousPage);
    pagesDiv.appendChild(displayPage);
    pagesDiv.appendChild(nextPage);

    mainContainer.appendChild(pagesDiv);

    const newList = document.createElement("ul");
    mainContainer.appendChild(newList);

    const bottomDiv = document.createElement("div");
    bottomDiv.style.justifyContent = "center";
    bottomDiv.style.display = "none";

    const toTop = document.createElement("button");
    toTop.classList = "input-field";
    toTop.textContent = "Back to Top";

    bottomDiv.appendChild(toTop);
    mainContainer.appendChild(bottomDiv);

    const replaceBL = coalesce(await getSetting("replaceBL"), false);

    async function removeBadgeList() {
        const div = await waitFor(".game-badges-list");
        div.remove();
    };

    if (replaceBL) {
        const privServers = await waitFor("#rbx-private-servers");
        privServers.after(mainContainer);
        removeBadgeList();
    } else {
        const content = await waitFor("#game-detail-page");
        content.appendChild(mainContainer);
        const observer = new MutationObserver(function(list) {
            let reparent = false;
            for (const item of list) {
                for (const node of item.addedNodes) {
                    if (node != mainContainer) {
                        reparent = true;
                    };
                };
            };
            if (reparent) {
                content.appendChild(mainContainer);
            };
        });
        
        observer.observe(content, {childList: true});
    };

    const textColors = [
        "#FFFFFF", 
        "#c0c0c0", 
        "#e0e0e0"
    ]

    const valueColors = {
        0: "#FFFFFF",
        1: "#00ff00",
        2: "#0080ff",
        3: "#ff1100"
    };

    let cachedInfo = {};

    async function displayBadge(id) {
        const infoPath = cachedInfo[id];
        const colorA = textColors[0];

        const item = document.createElement("li");
        item.classList = "customDarkTheme";
        item.style.height = "120px";
        item.style.padding = "10px";
        item.style.display = "flex";
        item.style.marginBottom = "10px";
        item.style.overflow = "hidden";

        if (!infoPath[0]) {
            item.style.backgroundColor = "rgba(26, 27, 29, 0.9)";
            item.style.opacity = "0.6";
        };

        if (!infoPath[8]) {
            item.style.border = "2px inset rgba(240, 0, 0, 0.8)";
        };

        const imgDiv = document.createElement("div");
        imgDiv.style.marginRight = "10px";
        imgDiv.style.height = "100%";
        imgDiv.style.aspectRatio = "1";

        const anchor = document.createElement("a");
        anchor.href = `https://www.roblox.com/badges/${id}/BADGE`
        imgDiv.appendChild(anchor);

        const img = document.createElement("img");
        img.src = infoPath[2];
        img.style.height = "100%";
        img.style.width = "100%";
        img.style.borderRadius = "100%";
        img.style.border = `4px solid ${valueColors[infoPath[1]]}`;
        img.style.padding = "4px";
        img.crossOrigin = "Anonymous";

        if (detectSquare) {
            img.onload = function() {
                const shapeCode = cachedInfo[id][11];
                img.style.borderRadius = shapeCode === 1 ? "0%" : "100%";
            };
        } else {
            if (squareBorders) {
                img.style.borderRadius = "0%";
            };
        };

        anchor.appendChild(img);
        item.appendChild(imgDiv);

        const contentDiv = document.createElement("div");
        contentDiv.style.display = "flex";
        contentDiv.style.flex = "1";

        const textDiv = document.createElement("div");
        textDiv.style.flex = "1";

        const name = document.createElement("p");
        name.textContent = infoPath[3];
        name.style.color = colorA
        name.style.fontWeight = "bold";

        const description = document.createElement("p");
        description.textContent = infoPath[4];
        description.style.color = textColors[1];
		description.style.wordBreak = "break-word";

        textDiv.appendChild(name);
        textDiv.appendChild(description);

        const statsDiv = document.createElement("ul");
        statsDiv.style.display = "grid";
        
        const toggles = coalesce(await getSetting("statsToggles"), {});
        const [
            showAwardedTotal,
            showAwardedYesterday,
            showRate,
            showCreated,
            showUpdated,
            showAwardedDate
        ] = [
            toggles.awardTotal     ?? true,
            toggles.awardYesterday ?? true,
            toggles.rate           ?? true,
            toggles.created        ?? true,
            toggles.updated        ?? true,
            toggles.awardDate      ?? true
        ];
		
        function statTemplate(title, val) {
            const statDiv = document.createElement("div");
            statDiv.style.justifyContent = "right";
            statDiv.style.display = "flex";

            const label = document.createElement("p");
            label.style.marginRight = "10px";
            label.style.color = textColors[2];
            label.textContent = title;

            const stat = document.createElement("p");
            stat.style.color = colorA
            stat.textContent = val;
            stat.style.fontWeight = "bold";

            statDiv.appendChild(label);
            statDiv.appendChild(stat);

            statsDiv.appendChild(statDiv);
        };

        function formatUTCDate(dateStr) {
            const date = new Date(dateStr);
            const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
            const offsetHours = -new Date().getTimezoneOffset() / 60;
            const localTime = new Date(utcTime + offsetHours * 3600000);
            const hh = String(localTime.getHours()).padStart(2, "0");
            const mm = String(localTime.getMinutes()).padStart(2, "0");
            const ss = String(localTime.getSeconds()).padStart(2, "0");
            const dd = String(localTime.getDate()).padStart(2, "0");
            const MM = String(localTime.getMonth() + 1).padStart(2, "0");
            const yyyy = localTime.getFullYear();
            return `${hh}:${mm}:${ss} UTC${offsetHours >= 0 ? "+" + offsetHours : offsetHours}, ${dd}/${MM}/${yyyy}`;
        }

        showAwardedTotal && statTemplate("Awarded Total", infoPath[5]);
        showAwardedYesterday && statTemplate("Awarded Yesterday", infoPath[6]);
        showRate && statTemplate("Rate", Math.round(infoPath[7]*1000)/10 + "%");
        showCreated && statTemplate("Created", formatUTCDate(infoPath[9]));
        showUpdated && statTemplate("Updated", formatUTCDate(infoPath[10]));
        showAwardedDate && infoPath[12] && statTemplate("Awarded Date", formatUTCDate(infoPath[12]));

        contentDiv.appendChild(textDiv);
        contentDiv.appendChild(statsDiv);
        const allStatsDivs = [];
        const ro = new ResizeObserver(() => {
            allStatsDivs.forEach(div => {
                const totalH = div.parentElement.clientHeight;
                const numRows = div.children.length || 1;
                div.style.gridAutoRows = `${totalH / numRows}px`;
            });
        });
        allStatsDivs.push(statsDiv);
        ro.observe(contentDiv);
        item.appendChild(contentDiv);
        return item;
    };

    async function request(url, data, retryCallback=null) {
        while (true) {
            let response = null;
            try {
                response = await fetch(url, data).then(function(response) {
                    return response.json();
                }).then(function(data) {
                    return data;
                });
            } catch {
                console.log("Request Error");
            } finally {
                if (response != null && (retryCallback == null || retryCallback(response))) {
                    return response;
                };
                await wait(5000);
            };
        };
    };
    
    async function get(url, credentials="omit", retryCallback=null, headers={}) {
        return await request(url, {credentials: credentials, headers: headers}, retryCallback);
    };

    async function post(url, body, retryCallback=null) {
        return (await request(url, {credentials: "include", method: "POST", body: JSON.stringify(body)}, retryCallback));
    };

    function defaultRequestHandler(data) {
        return data.data != null;
    };

    const placeId = (window.location.href).split("/")[4];
    const universeId = (await get(`https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`, "include"))[0].universeId;
    const userId = (await get("https://users.roblox.com/v1/users/authenticated", "include")).id;

    function shortenCursor(cursor) {
        const decoded = atob(cursor).split("\n");
        const key = JSON.parse(decoded[0]).key.split("id_")[1];
        return `${key}:${decoded[1]}`
    };

    function lengthenCursor(cursor, a, b) {
        const split = cursor.split(":");
        const obj = {key: `id_${split[0]}`, sortOrder: "Asc", pagingDirection: "Forward", pageNumber: a, discriminator: `universeId:${b}`, count: 100}
        return btoa(`${JSON.stringify(obj)}\n${split[1]}`);
    };

    let allCursors = [""];
    let cursorCache = {};

    async function getCursors() {

        status.textContent = `Fetching Cursors`;
        const uniqueStorage = `cursors_${universeId}`;

        if (allCursors.length == 1) {
            await new Promise(function(resolve) {
                chrome.storage.local.get(uniqueStorage, function(result) {
                    const data = result[uniqueStorage];
                    if (data && Array.isArray(data)) {
                        let index = 2;
                        for (cursor of data) {
                            allCursors.push(lengthenCursor(cursor, index, universeId));
                            index++;
                        };
                    };
                    resolve();
                });
            });
        };

        let currentCursor = allCursors[allCursors.length-1];

        while (true) {
            const response = cursorCache[currentCursor] || await get(`https://badges.roblox.com/v1/universes/${universeId}/badges?limit=100&sortOrder=Asc&cursor=${currentCursor}`, "include");

            const errors = response.errors;
            if (errors) {
                if (errors[0].message == "Invalid cursor") {
                    allCursors = [""];
                    currentCursor = "";
                };
                continue;
            };
            
            cursorCache[currentCursor] = response;

            status.textContent = `Fetching Cursors (${allCursors.length})`;

            if (!response.nextPageCursor) {
                break;
            }
            else {
                currentCursor = response.nextPageCursor;
                allCursors.push(currentCursor);
            }
        };

        let shortenedCursors = [];

        for (cursor of allCursors) {
            if (cursor != "") {
                shortenedCursors.push(shortenCursor(cursor));
            };
        };

        chrome.storage.local.set({[uniqueStorage]: shortenedCursors});

        return allCursors;
    };

    const highlightBadges = coalesce(await getSetting("highlightBadges"), true);

    async function processCursors(cursors) {
        let processing = []
        let processed = 0;

        function updateStatus(current) {
            status.textContent = `Fetching Info (${current}/${cursors.length})`;
        };

        async function processCursor(cursor) {
            const cached = cursorCache[cursor]
            const badgeInfo = (cached && cached.data) || (await get(`https://badges.roblox.com/v1/universes/${universeId}/badges?limit=100&cursor=${cursor}&sortOrder=Asc`, "include", defaultRequestHandler)).data;

            let thumbnailsBatch = [];
            let ownedBatch = "";

            for (const badge of badgeInfo) {
                const id = badge.id;
                thumbnailsBatch.push({
                    requestId: `${id}:undefined:BadgeIcon:150x150:webp:regular`,
                    type: "BadgeIcon",
                    targetId: id,
                    format: "webp",
                    size: "150x150"
                });
                ownedBatch = ownedBatch.concat(id, ",");
            };

            ownedBatch = ownedBatch.slice(0, -1);

            const ownedPromise = highlightBadges ? get(`https://badges.roblox.com/v1/users/${userId}/badges/awarded-dates?badgeIds=${ownedBatch}`, "omit", defaultRequestHandler) : new Promise(function(resolve) {resolve({"data": []})});
            const thumbnailsPromise = post("https://thumbnails.roblox.com/v1/batch", thumbnailsBatch, defaultRequestHandler);

            const owned = (await ownedPromise).data;
            const thumbnails = (await thumbnailsPromise).data;

            const awardedDates = owned.reduce((map, b) => {
                map[b.badgeId] = b.awardedDate;
                return map;
            }, {});

            processed++;
            updateStatus(processed);

            return {
                badgeInfo: badgeInfo,
                owned: owned,
                thumbnails: thumbnails,
                awardedDates: awardedDates
            };
        };

        for (const cursor of cursors) {
            processing.push(processCursor(cursor));
        };

        return await Promise.all(processing);
    };

    async function detectAllShapes() {
        const entries = Object.entries(cachedInfo);
        const total = entries.length;
        let processed = 0;
        const shapePromises = [];
        for (const entry of entries) {
            const id = entry[0];
            if (cachedInfo[id][11] !== undefined) continue;
            
            shapePromises.push(new Promise(resolve => {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.src = cachedInfo[id][2];
                img.onload = function() {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d", { willReadFrequently: true });
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    ctx.drawImage(img, 0, 0);
                    const { width, height, data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

                    let minX = width, minY = height, maxX = 0, maxY = 0;
                    for (let y = 0; y < height; y++) {
                         for (let x = 0; x < width; x++) {
                            if (data[(y * width + x) * 4 + 3] > 0) {
                                minX = Math.min(minX, x);
                                maxX = Math.max(maxX, x);
                                minY = Math.min(minY, y);
                                maxY = Math.max(maxY, y);
                            }
                        }
                    }

                    function edgeIsSolid(x1, y1, x2, y2) {
                        for (let i = 0; i <= 10; i++) {
                            const xi = Math.round(x1 + (x2 - x1) * (i / 10));
                            const yi = Math.round(y1 + (y2 - y1) * (i / 10));
                            if (data[(yi * width + xi) * 4 + 3] === 0) return false;
                        }
                        return true;
                    }

                    const edges = [
                        [minX, minY, maxX, minY],
                        [maxX, minY, maxX, maxY],
                        [maxX, maxY, minX, maxY],
                        [minX, maxY, minX, minY],
                    ];
                    const isSquare = edges.every(e => edgeIsSolid(e[0], e[1], e[2], e[3]));
                    // append shapeCode at index 11
                    cachedInfo[id][11]= isSquare ? 1 : 2;
                    processed++;
                    status.textContent = `Detecting Shapes (${processed}/${total})`;
                    resolve();
                };
            }));
        }
        
        await Promise.all(shapePromises);
    }

    async function load() {
        const NVL = await fetch(chrome.runtime.getURL("NVL.json")).then(function(response) {
            return response.json()
        });

        const cursors = await getCursors();

        status.textContent = `Fetching Info (0/${cursors.length})`;

        const results = await processCursors(cursors);

        let currentDate = null;
        let dateRepeated = 0;

        for (const result of results) {
            let owned = [];
            for (const badge of result.owned) {
                owned.push(badge.badgeId);
            };

            let thumbnails = {};
            for (const badge of result.thumbnails) {
                thumbnails[badge.targetId] = badge.imageUrl;
            };
			const dateCountMap = {};
            for (const badge of result.badgeInfo) {
                const id = badge.id;
                let value = 0;

                const date = new Date(badge.created);
                const legacyDate = new Date("2022-02-24");

                const year = date.getUTCFullYear();
                const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
                const day = ("0" + date.getUTCDate()).slice(-2);
                const finalDate = year + "-" + month + "-" + day;
				dateCountMap[finalDate] = (dateCountMap[finalDate] || 0) + 1;
				const repeatedCount = dateCountMap[finalDate];

                if (currentDate == null || currentDate != finalDate) {
                    currentDate = finalDate;
                    dateRepeated = 1;
                } else {
                    dateRepeated++;
                };
                
                if (NVL.includes(id)) {
                    value = 3;
                } else if (date < legacyDate) {
                    value = 2;
                } else if (repeatedCount > 5) {
                    value = 1;
                };

                cachedInfo[id] = [owned.includes(id), value, thumbnails[id], badge.name, badge.description || "", badge.statistics.awardedCount, badge.statistics.pastDayAwardedCount, badge.statistics.winRatePercentage, badge.enabled, badge.created, badge.updated, undefined, result.awardedDates[id] || null];
            };
        };

        if (detectSquare) {
             status.textContent = `Detecting Shapes (0/${Object.keys(cachedInfo).length})`;
            await detectAllShapes();
        }

        if (Object.keys(cachedInfo).length == 0) {
            status.textContent = "This game has no badges.";
            return;
        };

        status.textContent = "Loading";
        filterDiv.style.display = "flex";
        searchDiv.style.display = "flex";
        sortDiv.style.display = "flex";
        downloadDiv.style.display = "flex";

        const pageSize = 100;
        let currentPage = 0;
        let filtered = [];
        let toSearch = "";

        function filter(value, ownership, activity, search, stype, sby, sdir, smode, bshape) {
            let showing = 0;
            let total = 0;
            filtered = [];

            for (const key in cachedInfo) {
                const badge = cachedInfo[key];

                const ownsBadge = badge[0];
                const badgeValue = badge[1];
                const name = badge[3].toLowerCase().includes(search);
                const desc = badge[4].toLowerCase().includes(search);
                const isEnabled = badge[8];
                const shapeCode = badge[11];

                const expectedValue = value == 0 || (value == 1 && badgeValue == 0) || (value == 2 && (badgeValue == 1 || badgeValue == 2)) || (value == 3 && (badgeValue == 2 || badgeValue == 3)) || (value == 4 && badgeValue == 3) || (value == 5 && badgeValue == 1);
                const expectedOwnership = ownership == 0 || (ownership == 1 && ownsBadge) || (ownership == 2 && !ownsBadge);
                const expectedActivity = activity == 0 || (activity == 1 && isEnabled) || (activity == 2 && !isEnabled);
                const expectedSearch = search == "" || (smode == 0 && ((stype == 0 && name) || (stype == 1 && desc) || (stype == 2 && (name || desc)))) || (smode == 1 && !((stype == 0 && name) || (stype == 1 && desc) || (stype == 2 && (name || desc))));
                const expectedShape = !detectSquare || bshape == 0 || (bshape == 1 && shapeCode == 1) || (bshape == 2 && shapeCode == 2);
                if (expectedValue && expectedOwnership && expectedActivity && expectedSearch && expectedShape) {
                    filtered.push(Number(key));
                    showing++;
                };
                total++;
            };

            filtered.sort(function(a, b) {
                const valIndex = {0: 9, 1: 10, 2: 5, 3: 6}[sby];
                let valA = cachedInfo[a][valIndex];
                let valB = cachedInfo[b][valIndex];
                if (valIndex == 9 || valIndex == 10) {
                    valA = Date.parse(valA);
                    valB = Date.parse(valB);
                };
                return sdir == 1 ? valB - valA : valA - valB;
            });

            status.textContent = `Showing ${showing} of ${total} (${Math.round(showing/total*1000)/10}%)`;
        };

        async function display(page) {
            currentPage = page;
            displayPage.textContent = `${page+1}/${Math.ceil(filtered.length/pageSize)}`;
            newList.innerHTML = "";
            const fragment = document.createDocumentFragment();
            let index = 0;
            for (const id of filtered) {
                const minIndex = page*pageSize;
                const maxIndex = (page+1)*pageSize-1;
                if (index >= minIndex && index <= maxIndex) {
                    const badgeItem = await displayBadge(id);
                    fragment.appendChild(badgeItem);
                };
                index++;
            };
            newList.appendChild(fragment);
        };

        function maxPage() {
            return Math.floor(filtered.length/pageSize);
        };

        function refreshPage() {
            filter(badgeType.value, badgeOwnership.value, badgeActivity.value, toSearch, searchType.value, SortBy.value, SortDirection.value, searchMode.value, detectSquare ? badgeShape.value : 0);
            display(Math.min(currentPage, maxPage()));
        };

        badgeType.addEventListener("change", refreshPage);
        badgeOwnership.addEventListener("change", refreshPage);
        badgeActivity.addEventListener("change", refreshPage);
        detectSquare && badgeShape.addEventListener("change", refreshPage);
        SortBy.addEventListener("change", refreshPage);
        SortDirection.addEventListener("change", refreshPage);

        searchType.addEventListener("change", function() {
            if (toSearch != "") {
                refreshPage();
            };
        });

        searchMode.addEventListener("change", function() {
            if (toSearch != "") {
                refreshPage();
            };
        });

        previousPage.onclick = function() {
            if (currentPage > 0) {;
                display(currentPage-1);
            };
        };

        nextPage.onclick = function() {
            if (currentPage < maxPage()) {
                display(currentPage+1);
            };
        };

        refreshPage();

        recountBtn.style.display = "inline";
        pagesDiv.style.display = "flex";
        bottomDiv.style.display = "flex";

        let recounting = false;
        recountBtn.onclick = async function() {
            if (!recounting) {
                recounting = true;
                let toRecount = [];
                for (const key in cachedInfo) {
                    const badge = cachedInfo[key];
                    if (badge[0] == false) {
                        toRecount.push(key);
                    };
                };

                const max = toRecount.length;
                function updateStatus(current) {
                    status.textContent = `Recounting (${current}/${max})`;
                };

                updateStatus(0);

                const batchSize = 100;
                let index = 0;

                let processed = 0;
                let promises = [];

                function processBatch(strBatch, increment) {
                    return new Promise(async function(resolve) {
                        const owned = (await get(`https://badges.roblox.com/v1/users/${userId}/badges/awarded-dates?badgeIds=${strBatch}`, "omit", defaultRequestHandler)).data;
                        processed += increment;
                        updateStatus(processed);
                        for (const badge of owned) {
                            const id = badge.badgeId;
                            cachedInfo[id][0] = true;
                            badge.awardedDate && (cachedInfo[id][12] = badge.awardedDate);
                        };
                        resolve();
                    });
                };

                while (index < max) {
                    const batch = toRecount.slice(index, index + batchSize);
                    index += batchSize;

                    let amount = 0;
                    let strBatch = "";
                    for (const id of batch) {
                        strBatch = strBatch.concat(id, ",");
                        amount++;
                    };
                    strBatch = strBatch.slice(0, -1);

                    promises.push(processBatch(strBatch, amount));
                };

                await Promise.all(promises);
                refreshPage();

                recounting = false;
            };
        };

        function downloadArray(array, name) {
            const anchor = document.createElement("a");
            anchor.href = URL.createObjectURL(new Blob([JSON.stringify(array, null, 2)], {type: "application/json"}));
            anchor.download = name;
            anchor.click();
        };

        downloadBadgeList.onclick = function() {
            downloadArray(filtered, "badgeList.json");
        };

        downloadCursors.onclick = function() {
            downloadArray(cursors.slice(1), `${universeId}_cursors.json`);
        };

        searchInput.addEventListener("keydown", function(event) {
            if (event.key == "Enter") {
                const newSearch = searchInput.value;
                if (toSearch != newSearch) {
                    toSearch = newSearch.toLowerCase();
                    refreshPage();
                };
            };
        });

        toTop.onclick = function() {
            filterDiv.scrollIntoView(true);
        };
    };

    let startedUp = false;
    let verifying = false;

    function startup() {
        startedUp = true;
        status.textContent = "Initializing";
        if (!replaceBL) {
            removeBadgeList();
        };
        startupBtn.style.display = "none";
        importBtn.style.display = "none";
        load();
    };

    importBtn.onclick = function() {
        fileInp.click();
    };

        fileInp.addEventListener("change", function() {
            if (!startedUp && !verifying) {
                const file = fileInp.files[0];
                const reader = new FileReader();

                reader.onload = async function() {
                    verifying = true;
                    try {
                        const result = JSON.parse(reader.result);
                        if (Array.isArray(result)) {
                            let allowed = true;
                            let expectedPage = 2;
                            for (const element of result) {
                                if (typeof(element) != "string") {
                                    allowed = false;
                                };
                                const decoded = atob(element).split("\n");
                                const parsed = JSON.parse(decoded[0]);
                                if (!(parsed.sortOrder == "Asc" && parsed.pagingDirection == "Forward" && parsed.pageNumber == expectedPage && parsed.discriminator.startsWith(`universeId:${universeId}`) && parsed.count == 100 && parsed.key && decoded[1])) {
                                    allowed = false;
                                };
                                if (!allowed) {
                                    break
                                };
                                expectedPage++;
                            };
                            if (allowed) {
                                const length = result.length;

                                let processed = 0;
                                function updateStatus(processed) {
                                    status.textContent = `Verifying cursors (${processed} of ${length})`;
                                };
                                updateStatus(0);

                                async function processCursor(cursor, push) {
                                    const data = await get(`https://badges.roblox.com/v1/universes/${universeId}/badges?limit=100&sortOrder=Asc&cursor=${cursor}`, "include", function(data) {
                                        const errors = data.errors;
                                        const bool = data.data != null || errors && errors[0].message == "Invalid cursor";
                                        if (bool && push) {
                                            processed++;
                                            updateStatus(processed);
                                        };
                                        return bool;
                                    });
                                    return [cursor, data];
                                };

                                let promises = [];

                                promises.push(processCursor("", false));
                                for (const cursor of result) {
                                    promises.push(processCursor(cursor, true));
                                };

                                const results = await Promise.all(promises);

                                let final = true;
                                for (const data of results) {
                                    const cursor = data[0];
                                    cursorCache[cursor] = data[1];
                                    if (data[1].data == null) {
                                        final = false;
                                    };
                                };

                                if (final) {
                                    for (const cursor of result) {
                                        if (cursor != "") {
                                            allCursors.push(cursor);
                                        };
                                    };
                                    startup();
                                } else {
                                    status.textContent = "Verification Failed";
                                };
                            } else {
                                status.textContent = "Incorrect Cursors";
                            };
                        };
                    } catch {
                        status.textContent = "Failed to Verify";
                    };
                    verifying = false;
                };

                reader.readAsText(file);
            };
        });

    startupBtn.onclick = function() {
        if (!startedUp && !verifying) {
            startup();
        };
    };   
})();
