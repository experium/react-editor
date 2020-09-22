import { is } from 'ramda';

export const getUrl = (url, ...attrs) => is(Function, url) ? url(...attrs) : url;
