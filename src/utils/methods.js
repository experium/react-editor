import { sort } from 'ramda';

export function shuffle(array) {
    return sort(() => Math.random() - 0.5, array);
}
