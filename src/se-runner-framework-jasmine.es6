import path from 'path'
import IFramework from 'se-runner/lib/interfaces/iframework'
import Jasmine from 'jasmine-core'
import JasmineRunner from './jasmine-runner'
import JasmineSpecReporter from 'jasmine-spec-reporter'

export class SeRunnerFrameworkJasmine {
    constructor () {
        this.jasmine = Jasmine.core(Jasmine);
    }

    initialize (config) {
        this.jasmine.DEFAULT_TIMEOUT_INTERVAL = config.timeout || 60000;

        let frameworkInterface = Jasmine.interface(this.jasmine, this.jasmine.getEnv());
        for (let prop in frameworkInterface) {
            if (!frameworkInterface.hasOwnProperty(prop)) continue;

            global[prop] = frameworkInterface[prop];
        }

        this.jasmine.getEnv().addReporter(new JasmineSpecReporter());

        for (let d of config.dependencies) {
            require(path.join(config.basePath, d));
        }

        return this;
    }

    createRunner () {
        return new JasmineRunner(this.jasmine);
    }
}