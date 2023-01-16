
type obj = {
	[key: string]: any;
};
const fs = require('fs');

export default class Revalidate {
	public name: string;
	private timeStart: number;
	private revalidateTime: number;

	constructor(name: string, revalidateTimeMinutes: number) {
		this.name = name
		this.timeStart = Date.now();
		this.revalidateTime = revalidateTimeMinutes * 60 * 1000;
	}
	async read(): Promise<any[]> {
		try {
			const data: any[] = JSON.parse(await fs.readFileSync(`temp/${this.name}.json`))
			console.log(`${this.name}.json  >>>> dados encontrados <<<<`)
			return data
		} catch (error) {
			const data: any[] = []
			console.log(`${this.name}.json `, '>>>> não existe arquio <<<<')
			return data
		}
	}
	async check(_function: Function, params: any): Promise<obj> {
		const timeNow = Date.now();
		let data = await this.read() as unknown as any[]
		console.log('data: ', data);
		if (data.length === 0) {
			console.log(">>>> Revalidate single start <<<<")
			data = await _function(params);
			fs.writeFileSync(`temp/${this.name}.json`, JSON.stringify(data));
		}
		console.log("Revalidate ", this.name, ((timeNow - this.timeStart) / 1000 / 60).toFixed(2), '/', this.revalidateTime / 1000 / 60, 'min')
		if ((timeNow - this.timeStart) > this.revalidateTime) {
			data = await _function(params);
			fs.writeFileSync(`temp/${this.name}.json`, JSON.stringify(data));
			this.timeStart = Date.now();
		}
		return data
	}
}