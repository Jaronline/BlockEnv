module.exports.Environment = class Environment {
    #data;

    constructor(data) {
        this.#data = data;
        this.#validateData();
    }

    get name() {
        return this.#data.name;
    }

    get type() {
        return this.#data.type;
    }

    get path() {
        return this.#data.path;
    }

    #validateData(data = this.#data) {
        if (!data || typeof data !== "object" || Array.isArray(data)) {
            throw new Error("Environment data must be an object.");
        }
        if (!data.name || typeof data.name !== "string") {
            throw new Error("Environment name must be a string.");
        }
        if (!data.type || (data.type !== "client" && data.type !== "server")) {
            throw new Error("Environment type must be 'client' or 'server'.");
        }
        if (!data.path || typeof data.path !== "string") {
            throw new Error("Environment path must be a string.");
        }
    }
}