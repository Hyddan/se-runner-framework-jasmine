import IRunner from 'se-runner/lib/interfaces/irunner'

export default class JasmineRunner extends IRunner {
    constructor (jasmine) {
        super();

        this.jasmine = jasmine;
    }

    run (...args) {
        return this.jasmine.getEnv().execute(...args);
    }
}