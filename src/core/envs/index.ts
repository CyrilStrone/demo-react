const description = import.meta.env.VITE_DEFAULT_DESCRIPTION;
const version = import.meta.env.VITE_APP_VERSION;
const name = import.meta.env.VITE_DEFAULT_NAME;
const nameShort = import.meta.env.VITE_DEFAULT_NAME_SHORT;
const themeColor = import.meta.env.VITE_DEFAULT_THEME_COLOR;
const mode = import.meta.env.VITE_NODE_ENV;
const basePath = import.meta.env.BASE_URL;
const baseURL = import.meta.env.VITE_BASE_URL;
const coreURL = import.meta.env.VITE_CORE_URL;
const socketURL = import.meta.env.VITE_SOCKET_URL;
const cookieNameAccessToken = import.meta.env.VITE_AVAILABILITY_COOKIE_NAME;
const queryStaleTime = import.meta.env.VITE_QUERY_STALE_TIME;

export const env = {
  description,
  version,
  name,
  nameShort,
  themeColor,
  mode,
  basePath,
  baseURL,
  coreURL,
  socketURL,
  cookieNameAccessToken,
  queryStaleTime,
};
