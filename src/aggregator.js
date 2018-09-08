import { pipe } from './utils/functional';

export class Aggregator {
	constructor() {
		this._operators = [];
	}

	pipe(operators) {
		if (Array.isArray(operators)) {
			this._operators.push(...operators);
		} else {
			this._operators.push(operators);
		}
	}

	execute(input) {
		return pipe(...this._operators)(input);
	}
}
