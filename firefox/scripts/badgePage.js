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

    async function get(url, retryCallback=null) {
        return await request(url, {credentials: "omit"}, retryCallback);
    };

    function defaultRequestHandler(data) {
        return data.data != null;
    };

    const badgeId = (window.location.href).split("/")[4];

    const values = {
        0: ["#FFFFFF", "Free"],
        1: ["#00ff00", "Valuable"],
        2: ["#0080ff", "Legacy"],
        3: ["#ff1100", "Non Valuable Legacy"]
    };

    if (coalesce(await getSetting("displayValueA"), false)) {
		
		const container = document.createElement("div");
		container.classList.add("clearfix", "item-field-container");
		
		const header = document.createElement("div");
		header.classList.add("font-header-1", "text-subheader", "text-label", "text-overflow", "field-label");	
		header.textContent = "Value";

		const value = document.createElement("div");
		value.classList.add("field-content");
		value.id = "badge-value";
		value.textContent = "Loading...";

		const mainContainer = await waitFor(".clearfix.item-type-field-container");
		container.appendChild(header);
		container.appendChild(value);
		mainContainer.after(container);

        const result = (await get(`https://bor-valuable-badge-database-production.up.railway.app/api/v3/query/bybadgeids?badgeIds=${badgeId}`, defaultRequestHandler)).data[0];
        
        if (result.found == false) {
            get(`https://bor-valuable-badge-database-production.up.railway.app/api/v3/user/reportmissing?badgeIds=${badgeId}`);
            value.textContent = "Unknown"
        } else {
			const path = result.is_nvl == true ? values[3] : values[result.value];
            value.style.color = path[0];
            value.textContent = path[1];
        };
    };
})();