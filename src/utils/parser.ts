export function parseSequelize(data: any): any {
    const jsonData = JSON.parse(JSON.stringify(data));


    let result: any = null
    if (typeof jsonData === 'object' && !Array.isArray(jsonData)) {
        result = {} as Object
        for (let key in jsonData) {
            if (!jsonData[key]) {
                result[key] = 0
            } else {
                result[key] = jsonData[key]
            }
        }
    } else {
        result = []
        for (let i = 0; i < jsonData.length; i++) {
            const item = jsonData[i];
            const obj: any = {}
            for (let key in item) {
                if (!item[key]) {
                    obj[key] = 0
                } else {
                    obj[key] = item[key]
                }
            }
            result.push(obj)
        }
    }
    console.log(JSON.stringify(result, null, 2));
    return result;
}