
type obj = {
	[key: string]: any;
};
import {readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

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
			if (!existsSync(`temp/`)){
				mkdir(`temp/`);
			}
			const buffer = await readFile(`temp/${this.name?.split("_")[0]}/${this.name}.json`) as unknown as string
			const data: any[] = JSON.parse(buffer)
			console.warn(`${this.name}.json  >>>> dados encontrados <<<<`)
			return data
		} catch (error) {
			const data: any[] = []
			if (!existsSync(`temp/${this.name?.split("_")[0]}`)){
				mkdir(`temp/${this.name?.split("_")[0]}`);
			}
			writeFile(`temp/${this.name?.split("_")[0]}/${this.name}.json`, JSON.stringify(data));
			console.warn(`${this.name}.json `, '>>>> não existe arquio <<<<')
			return data
		}
	}
	async check(_function: Function, params?: any): Promise<obj> {
		const timeNow = Date.now();
		let data = await this.read() as unknown as any[]
		if (data.length === 0) {
			console.warn(">>>> Revalidate single start <<<<")
			data = await _function(params);
			writeFile(`temp/${this.name?.split("_")[0]}/${this.name}.json`, JSON.stringify(data));
		}
		console.warn("Revalidate ",(timeNow - this.timeStart) >= this.revalidateTime, this.name, ((timeNow - this.timeStart)/ 1000 ).toFixed(2), '/', this.revalidateTime / 1000, 's')
		if ((timeNow - this.timeStart) >= this.revalidateTime) {
			console.warn('update Data')
			_function(params).then((_data: any) => {
				writeFile(`temp/${this.name?.split("_")[0]}/${this.name}.json`, JSON.stringify(_data));
				this.timeStart = Date.now();
			})
		}
		return data
	}
}