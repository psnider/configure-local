declare module 'configure-local' {
    function reloadConfig()
    function get(key?: string): any
    var test: {
        reset: () => void
    }
}
