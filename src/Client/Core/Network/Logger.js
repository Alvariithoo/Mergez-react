class Logger {
    static get verbosity() {
        return 2
    }
    static error() {
        if (Logger.verbosity > 0) console.error.apply(null, arguments)
    }
    static warn() {
        if (Logger.verbosity > 1) console.warn.apply(null, arguments)
    }
    static info() {
        if (Logger.verbosity > 2) console.info.apply(null, arguments)
    }
    static debug() {
        if (Logger.verbosity > 3) console.debug.apply(null, arguments)
    }
}

export default Logger