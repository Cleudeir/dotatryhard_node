
type obj = {
	[key: string]: any;
};

export default class RevalidateGroup {
	public name: string;
	private revalidateTime: number;
	public data: obj[];

	constructor(name: string, revalidateTimeMinutes: number) {
		this.name = name
		this.revalidateTime = revalidateTimeMinutes * 60 * 1000;
		this.data = [];
	}
	async check(account_id: number, _function: Function, params: any): Promise<obj> {
		const timeNow = Date.now();

		let result: any = this.data.filter(x => x.account_id === account_id)
		result = result[0]
		if (!result) {
			const data = await _function(params)
			const obj: obj = {
				account_id,
				data,
				time: Date.now()
			}
			this.data = [obj]
		}
		if (result && result.data && (timeNow - result.time) > this.revalidateTime) {
			const exists: obj[] = this.data.filter(x => x.account_id !== account_id)
			const data = _function(params)
			const obj: obj = {
				account_id,
				data,
				time: Date.now()
			}
			this.data = [...exists, obj]
		}
		if (result) {
			console.log("Revalidate ", (timeNow - result.time) / 1000, '/', this.revalidateTime / 1000,'s')
		}
		result = this.data.filter(x => x.account_id === account_id);
		return result[0].data
	}
}