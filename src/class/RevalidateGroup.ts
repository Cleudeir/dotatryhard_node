
type obj = {
	[key: string]: any;
};
const fs = require('fs');

export default class RevalidateGroup {
	public name: string;
	private revalidateTime: number;
	public data: obj[] | [];

	constructor(name: string, revalidateTimeMinutes: number) {
		this.name = name
		this.revalidateTime = revalidateTimeMinutes * 60 * 1000;
		this.data = [];
		this.read()
	}
	async read(): Promise<void> {
		try {
			this.data = JSON.parse(await fs.readFileSync(`temp/${this.name}.json`))
			console.log(`${this.name}.json >>>> dados encontrados <<<<`)
		} catch (error) {
			console.log(`${this.name}.json `, '>>>> não existe arquio <<<<')
		}
	}

	async check(account_id: number, _function: Function, params: any): Promise<obj> {
		const timeNow = Date.now();
		console.log(">>>> ", this.name, this.data.length, ' <<<<')
		console.log(">>>> Revalidate Group start <<<<", 'check account_id:', +account_id)
		let result: any = this.data.filter(x => +x.account_id === +account_id)
		result = result[0]

		if (!result) {
			console.log(">>>> Dado não já existente! <<<<")
			const data = await _function(params)
			const obj: obj = {
				account_id,
				data,
				time: Date.now()
			}
			this.data = [...this.data, obj]
			fs.writeFileSync(`temp/${this.name}.json`, JSON.stringify(this.data));
		}
		if (result && result.data && (timeNow - result.time) > this.revalidateTime) {
			const exists: obj[] = this.data.filter(x => +x.account_id !== +account_id)
			const data = _function(params)
			const obj: obj = {
				account_id,
				data,
				time: Date.now()
			}

			this.data = [...exists, obj]
			fs.writeFileSync(`temp/${this.name}.json`, JSON.stringify(this.data));
		}
		if (result) {
			console.log(">>>> Dado já existente! <<<<", (timeNow - result.time) / 1000, '/', this.revalidateTime / 1000, 's')
		}
		result = this.data.filter(x => x.account_id === account_id);
		return result[0].data
	}
}