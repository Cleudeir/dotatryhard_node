
type obj = {
	[key: string]: any;
};
const fs = require('fs');

export default class Revalidate {
	public name: string;
	private timeStart: number;
	private revalidateTime: number;
	private count: number;
	public data: obj[];

	constructor(name: string, revalidateTimeMinutes: number) {
		this.name = name
		this.timeStart = Date.now();
		this.revalidateTime = revalidateTimeMinutes * 60 * 1000;
		this.count = 0;
		this.data = [];
		this.read()
	}
	async read(): Promise<void> {
		try {
			this.data = JSON.parse(await fs.readFileSync(`temp/${this.name}.json`))
			console.log(`${this.name}.json  >>>> dados encontrados <<<<`)
		} catch (error) {
			console.log(`${this.name}.json `, '>>>> não existe arquio <<<<')
		}
	}
	async check(_function: Function, params: any): Promise<obj> {
		this.count += 1
		if (this.count === 1 && this.data.length === 0) {
			console.log(">>>> Revalidate single start <<<<")
			this.data = await _function(params);
			fs.writeFileSync(`temp/${this.name}.json`, JSON.stringify(this.data));
			if (this.data && 0 === this.data.length) {
				this.data = await _function(params)
				fs.writeFileSync(`temp/${this.name}.json`, JSON.stringify(this.data));
			}
		}

		this.count += 1
		const timeNow = Date.now();
		console.log("Revalidate ", this.name, ((timeNow - this.timeStart) / 1000 / 60).toFixed(2), '/', this.revalidateTime / 1000 / 60, 'min')
		if (timeNow - this.timeStart > this.revalidateTime) {
			this.data = _function(params);
			fs.writeFileSync(`temp/${this.name}.json`, JSON.stringify(this.data));
			this.timeStart = Date.now();
		}
		return this.data
	}
}