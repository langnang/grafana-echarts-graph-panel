export const zeroToNull = (...args) => {
    args.forEach((v, k) => {
        v === 0 ? args[k] = null : null;
    })
    return args;

}