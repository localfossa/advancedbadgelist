(async function() {
    async function wait(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms)
        })
    };

    async function waitFor(selector, method = "querySelector") {
        let waiting = null;
        while (!waiting) {
            await wait(50);
            const element = document[method](selector);
            if (element?.length !== undefined ? element.length > 0 : element) {
                waiting = element;
            }
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
                if (response != null && (typeof retryCallback !== "function" || retryCallback(response))) {
                    return response;
                };
                await wait(5000);
            };
        };
    };

    async function get(url, retryCallback=null) {
        return await request(url, {credentials: "omit"}, retryCallback);
    };

    function defaultRequestHandler(data) {
        return data.data != null;
    };
    async function detectShape(img) {
        return new Promise(resolve => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const { naturalWidth: w, naturalHeight: h } = img;
        if (w === 0 || h === 0) return resolve(2);
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0);
        const { data } = ctx.getImageData(0, 0, w, h);
        let minX = w, minY = h, maxX = 0, maxY = 0;
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
            if (data[(y * w + x) * 4 + 3] > 0) {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            }
            }
        }
        const edges = [
            [minX, minY, maxX, minY],
            [maxX, minY, maxX, maxY],
            [maxX, maxY, minX, maxY],
            [minX, maxY, minX, minY]
        ];
        const edgeIsSolid = ([x1, y1, x2, y2]) => {
            for (let i = 0; i <= 10; i++) {
                const xi = Math.round(x1 + (x2 - x1) * (i / 10));
                const yi = Math.round(y1 + (y2 - y1) * (i / 10));
                if (data[(yi * w + xi) * 4 + 3] === 0) return false;
            }
            return true;
        };
        const isSquare = edges.every(edgeIsSolid);
        resolve(isSquare ? 1 : 2);
        });
    }

    async function refreshBadges() {
        let ids = [];
        if (/^\/users\/\d+\/profile$/.test(window.location.pathname)) {
            const badgeElements = await waitFor("ul.badge-list li.asset-item[data-testid]", "querySelectorAll");
            ids = Array.from(badgeElements).map(li => {
                const url = li.getAttribute("data-testid");
                const match = url.match(/\/badges\/(\d+)\//);
                return match ? +match[1] : null;
            }).filter(id => id !== null);
        } else if (window.location.hash.includes("badges")) {
            const badgeLinks = await waitFor("a.item-card-link", "querySelectorAll");
            ids = Array.from(badgeLinks).map(a => +a.href.match(/\/badges\/(\d+)/)[1]);
        }
        const result = (await get(`https://bor-valuable-badge-database-production.up.railway.app/api/v3/query/bybadgeids?badgeIds=${ids}`, defaultRequestHandler)).data;
        const values = {
            0: ["#FFFFFF", "Free"],
            1: ["#00ff00", "Valuable"],
            2: ["#0080ff", "Legacy"],
            3: ["#ff1100", "Non Valuable Legacy"]
        };
        const badgeMap = {};
        result.forEach(badge => {
            badgeMap[badge.badge_id] = badge.found ? badge.value : null;
            if (!badge.found) {
                get(`https://bor-valuable-badge-database-production.up.railway.app/api/v3/user/reportmissing?badgeIds=${badge.badge_id}`);
            }
        });
        const detectSquare  = coalesce(await getSetting("squareDetection"), true);
        const squareBorders = coalesce(await getSetting("squareBorders"), false);

        await Promise.all(ids.map(async (id) => {
            let img;
            if (/^\/users\/\d+\/profile$/.test(window.location.pathname)) {
                img = await waitFor(`ul.badge-list li.asset-item[data-testid*="/badges/${id}/"] img.asset-thumb-container`);
            } else {
                img = await waitFor(`a[href*="/badges/${id}"] .item-card-thumb-container img`);
            }
            const value = badgeMap[id];
            const [color] = values.hasOwnProperty(value) ? values[value] : ["#000000"];
            if (img) {
                img.style.border = `4px solid ${color}`;
                img.style.padding = '4px';
                img.style.borderRadius = "100%";
                img.crossOrigin = "Anonymous";
                if (detectSquare) {
                    img.style.borderRadius = await detectShape(img) === 1 ? "0%" : "100%";
                } else {
                    if (squareBorders) {
                        img.style.borderRadius = "0%";
                    };
                }
            }
        }));
    }

    async function load() {
        if (!window.location.hash.includes("badges") && !/^\/users\/\d+\/profile$/.test(window.location.pathname)) return;
        let container;
        if (window.location.hash.includes("badges")) {
            container = await waitFor("#assetsItems");
        } else if (/^\/users\/\d+\/profile$/.test(window.location.pathname)) {
            container = await waitFor("#player-badges-container");
        }

        if (!container) return;
        const observer = new MutationObserver(async () => {
            await refreshBadges();
        });
        observer.observe(container, { childList: true});
    }
    
    if (coalesce(await getSetting("displayValueB"), false)) {
        load();
        window.addEventListener("hashchange", load);
    }
})();