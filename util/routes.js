module.exports = {
    api: {
        archive: require("../endpoints/api/archive"),
        archives: require("../endpoints/api/archives")
    },
    archives: require("../endpoints/archives"),
    index: require("../endpoints/index")
}