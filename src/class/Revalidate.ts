
type obj = {
    [key: string]: any;
};

class Revalidate {
    public name : string;
    private timeStart : number;
    private revalidateTime : number;
    private count : number;
    public data : obj[];

	constructor(name: string,revalidateTimeHours: number) {
		this.name = name
		this.timeStart = Date.now();
		this.revalidateTime = revalidateTimeHours * 60 * 60 * 1000;
		this.count = 0;
		this.data = [];
	}
	async check(_function: Function, params: obj[]) : Promise<void> {
		if(this.count===0){
			this.data = await _function(params);
		}

		this.count += 1
		const timeNow = Date.now();
		console.log("Revalidate ",this.name, ((timeNow - this.timeStart)/1000/60).toFixed(2),'/', this.revalidateTime/1000/60,'min')
		if (timeNow - this.timeStart > this.revalidateTime) {
			this.data = _function(params);
			this.timeStart = Date.now();
		}
	}
}
module.exports = Revalidate;