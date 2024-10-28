class CSVReader {
    /**@type {Promise<string[][]>} */
    #csvData;
    /**@type {string} */
    #fileData;
    /**@type {string} */
    #delimiter;

    #doubleQuotes = '"';

    /**
     * @param {string} fileData
     * @param {string} delimiter
     * @returns {CSVReader}
     */
    constructor(fileData, delimiter = ',') {
        this.#fileData = fileData;
        this.#delimiter = delimiter;
        this.#readFile();
    }

    async #readFile() {
        const lines = this.#fileData.split('\n');
        const data = [];
        for (const line of lines) {
            data.push(this.#csvLineData(line));
        }
        this.#csvData = data;
    }

    get fileData() {
        return this.#fileData;
    }

    /**@returns {string[][]} */
    getArrayData() {
        return this.#csvData;
    }

    /**
     * @param {string} line
     * @returns {string[]}
     */
    #csvLineData(line) {
        /**@type {string[]}*/
        const temp = [];
        let word = '';
        let insideDoubleQuotesWord = false;
        let shouldntCheck = false;
        for (let i = 0; i < line.length; i++) {
            const prvChar = line[i - 1];
            const currChar = line[i];
            const nextChar = line[i + 1];

            if (
                !insideDoubleQuotesWord &&
                currChar === this.#doubleQuotes &&
                i === 0
            ) {
                insideDoubleQuotesWord = true;
                continue;
            }
            if (
                !insideDoubleQuotesWord &&
                currChar === this.#doubleQuotes &&
                prvChar === this.#delimiter
            ) {
                insideDoubleQuotesWord = true;
                continue;
            }
            if (!insideDoubleQuotesWord && currChar === this.#delimiter) {
                temp.push(word);
                word = '';
                continue;
            }

            if (insideDoubleQuotesWord) {
                if (shouldntCheck) {
                    word += currChar;
                    shouldntCheck = false;
                    continue;
                }

                if (
                    currChar === this.#doubleQuotes &&
                    nextChar === this.#doubleQuotes
                ) {
                    shouldntCheck = true;
                    continue;
                }
                if (
                    currChar === this.#doubleQuotes &&
                    nextChar !== this.#delimiter &&
                    typeof nextChar !== 'undefined'
                ) {
                    word += currChar;
                    continue;
                }
                if (
                    currChar === this.#doubleQuotes &&
                    (nextChar === this.#delimiter ||
                        typeof nextChar === 'undefined')
                ) {
                    insideDoubleQuotesWord = false;
                    continue;
                }
                word += currChar;
                continue;
            }
            word += currChar;
        }
        temp.push(word);
        return temp;
    }
}

module.exports = CSVReader;
