const isNode = typeof window === 'undefined';
const windowObj = isNode ? { localStorage: new Map() } : window;
const storage = windowObj.localStorage;
const getBrowserHref = () =>
	isNode ? '' : window.location.href;
const INVALID_PARAM_VALUES = new Set(['', 'null', 'undefined']);

const sanitizeParamValue = (value) => {
	if (typeof value !== 'string') {
		return value ?? null;
	}

	const trimmed = value.trim();
	return INVALID_PARAM_VALUES.has(trimmed) ? null : trimmed;
};

const env = {
	appId: sanitizeParamValue(process.env.NEXT_PUBLIC_BASE44_APP_ID),
	functionsVersion: sanitizeParamValue(process.env.NEXT_PUBLIC_BASE44_FUNCTIONS_VERSION),
	appBaseUrl: sanitizeParamValue(process.env.NEXT_PUBLIC_BASE44_APP_BASE_URL),
};

const toSnakeCase = (str) => {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
	if (isNode) {
		return defaultValue;
	}
	const storageKey = `base44_${toSnakeCase(paramName)}`;
	const urlParams = new URLSearchParams(window.location.search);
	const searchParam = urlParams.get(paramName);
	if (removeFromUrl) {
		urlParams.delete(paramName);
		const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""
			}${window.location.hash}`;
		window.history.replaceState({}, document.title, newUrl);
	}
	if (searchParam) {
		const sanitizedSearchParam = sanitizeParamValue(searchParam);
		if (sanitizedSearchParam) {
			storage.setItem(storageKey, sanitizedSearchParam);
			return sanitizedSearchParam;
		}
		storage.removeItem(storageKey);
		return null;
	}
	const sanitizedDefaultValue = sanitizeParamValue(defaultValue);
	if (sanitizedDefaultValue) {
		storage.setItem(storageKey, sanitizedDefaultValue);
		return sanitizedDefaultValue;
	}
	const rawStoredValue = storage.getItem(storageKey);
	const storedValue = sanitizeParamValue(rawStoredValue);
	if (!storedValue && rawStoredValue) {
		storage.removeItem(storageKey);
	}
	if (storedValue) {
		return storedValue;
	}
	return null;
}

const getAppParams = () => {
	if (getAppParamValue("clear_access_token") === 'true') {
		storage.removeItem('base44_access_token');
		storage.removeItem('token');
	}
	return {
		appId: getAppParamValue("app_id", { defaultValue: env.appId }),
		token: getAppParamValue("access_token", { removeFromUrl: true }),
		fromUrl: getAppParamValue("from_url", { defaultValue: getBrowserHref() }),
		functionsVersion: getAppParamValue("functions_version", { defaultValue: env.functionsVersion }),
		appBaseUrl: getAppParamValue("app_base_url", { defaultValue: env.appBaseUrl }),
	}
}


export const appParams = {
	...getAppParams()
}

export const hasBase44Config = Boolean(
	appParams.appId && appParams.appBaseUrl
);
