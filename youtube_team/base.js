//<editor-fold desc="load">
if (typeof require !== 'undefined') {
    module.exports = {
        Base: Base,
        Hook: Hook,
        HookDual: HookDual
    };
}
//</editor-fold>

function Base() {

}


function Hook(hook) {
    /*
     * a function pushed to whens, will be called with the arguments of the hook. it's
     * return value will be used to call the subsequent when in whens, or the hook.
     *
     * a function pushed to thens, will be called with the return value of the hook,
     * or the previous then in thens.
     *
     * to modify the value of a hooked function, from another function, it must be pushed
     * into the original hook, a hooked function keeps no reference to its hook.
     */
    function Hooks() {
        var w, when, oput = arguments;
        for (w = 0; w < Hooks.whens.length; w++) {
            when = Hooks.whens[w];
            oput = when.apply(when, oput)
        }

        oput = hook.apply(hook, oput);

        var t, then;
        for (t = 0; t < Hooks.thens.length; t++) {
            then = Hooks.thens[t];
            oput = then.apply(then, oput)
        }

        return oput;
    }

    Hooks.then = function (hook, once) {
        if (once) {
            Hooks.thens.push(function () {
                hook.apply(null, arguments);
                Hooks.thens.splice(Hooks.thens.indexOf(this), 1);
            });
        } else {
            Hooks.thens.push(hook);
        }
    };

    Hooks.thens = [];

    Hooks.when = function (hook, once) {
        if (once) {
            Hooks.whens.push(function () {
                hook.apply(null, arguments);
                Hooks.whens.splice(Hooks.whens.indexOf(this), 1);
            });
        } else {
            Hooks.whens.push(hook);
        }
    };

    Hooks.whens = [];

    return Hooks;
}

function HookDual(iput, oput) {
    this.iput = new Hook(iput);
    this.oput = new Hook(oput);
}