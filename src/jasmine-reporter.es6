import IReporter from 'se-runner/lib/interfaces/ireporter'
import Report from 'se-runner/lib/report'

export default class JasmineReporter extends IReporter {
    constructor (options) {
        super();

        Object.assign(this, {
            _report: new Report(),
            currentSpec: null,
            currentSuite: null,
            options: Object.assign({}, options),
            start: null,
            suites: {}
        });
    }

    jasmineStarted (jasmineInfo) {
        this.start = new Date().getTime();

        this._report.metrics.specs.total = jasmineInfo.totalSpecsDefined;
    }

    jasmineDone () {
        this._report.duration = (new Date().getTime() - this.start) / 1000;
        this._report.success = 0 === this._report.metrics.specs.failed;
        this._report.result = this.suites;

        this.options.done && this.options.done();
    }

    report () {
        return this._report;
    }

    specStarted (specInfo) {
        this.currentSuite.specs[specInfo.id] = this.currentSpec = {
            description: specInfo.description,
            fullName: specInfo.fullName,
            id: specInfo.id,
            log: []
        };
    }

    specDone (result) {
        switch (this.currentSpec.status = result.status) {
            case 'failed':
                ++this._report.metrics.specs.failed;
                this.currentSuite.success = false;

                for (let i = 0; i < result.failedExpectations.length; i++) {
                    this.currentSpec.log.push(result.fullName);
                    this.currentSpec.log.push(result.failedExpectations[i].message);
                    this.currentSpec.log.push(result.failedExpectations[i].stack);
                }
                break;
            case 'pending':
                ++this._report.metrics.specs.pending;
                break;
            default:
                ++this._report.metrics.specs.succeeded;
                break;
        }

        this.currentSpec = null;
    }

    suiteStarted (suiteInfo) {
        ++this._report.metrics.suites.total;
        this.suites[suiteInfo.id] = this.currentSuite = {
            description: suiteInfo.description,
            fullName: suiteInfo.fullName,
            id: suiteInfo.id,
            specs: {},
            success: true
        };
    }

    suiteDone () {
        this.currentSuite.success ? ++this._report.metrics.suites.succeeded : ++this._report.metrics.suites.failed;
        this.currentSuite = null;
    }
}