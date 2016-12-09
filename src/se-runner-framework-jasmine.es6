import path from 'path'
import IFramework from 'se-runner/lib/interfaces/iframework'
import Jasmine from 'jasmine-core'
import JasmineReporter from './jasmine-reporter'
import JasmineRunner from './jasmine-runner'
import JasmineSpecReporter from 'jasmine-spec-reporter'

export class SeRunnerFrameworkJasmine extends IFramework {
    constructor () {
        super();

        this.jasmine = Jasmine.core(Jasmine);
    }

    initialize (config) {
        let _self = this;

        _self.jasmine.DEFAULT_TIMEOUT_INTERVAL = config.timeout || 60000;

        let frameworkInterface = Jasmine.interface(_self.jasmine, _self.jasmine.getEnv());
        for (let prop in frameworkInterface) {
            if (!frameworkInterface.hasOwnProperty(prop)) continue;

            global[prop] = frameworkInterface[prop];
        }

        _self.jasmine.getEnv().addReporter(_self.reporter = new JasmineReporter({
            done: function () {
                config && config.done && config.done(_self.reporter.report());
            }
        }));

        if (config.consoleReporter) {
            _self.jasmine.getEnv().addReporter(new JasmineSpecReporter());
        }

        for (let d of config.dependencies) {
            require(path.join(config.basePath, d));
        }

        return _self;
    }

    createRunner () {
        return new JasmineRunner(this.jasmine);
    }
}