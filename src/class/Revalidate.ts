import { promises as fsPromises, existsSync } from 'fs';
import os from 'os';
import JSZip from 'jszip';

const { readFile, writeFile, mkdir } = fsPromises;

const userHomeDir = os.homedir();

export default class Revalidate {
	public name: string;
	private timeStart: number;
	private revalidateTime: number;
	private zip: any

	constructor(name: string, revalidateTimeMinutes: number) {
		this.name = name;
		this.timeStart = Date.now();
		this.revalidateTime = revalidateTimeMinutes * 60 * 1000;
		this.zip = new JSZip();
	}


	async writeFile(data: any) {
		const timeNow = Date.now();
		try {
			const zipFilePath = `${userHomeDir}/temp/dota/${this.name}.zip`
			this.zip.file(`${this.name}.json`, JSON.stringify(data));
			const zipData = await this.zip.generateAsync({
				type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: {
					level: 5
				}
			});
			await fsPromises.writeFile(zipFilePath, zipData);
		} catch (error) {
			console.error('Error:', error);
		} finally {
			console.log("write time ", (Date.now() - timeNow) / 1000, 's');
		}
	}


	async read(): Promise<any[]> {
		const timeNow = Date.now();
		try {
			const zipFilePath = `${userHomeDir}/temp/dota/${this.name}.zip`;
			console.log('Zip File Path:', zipFilePath);
			const buffer = await fsPromises.readFile(zipFilePath);
			const zipData = await JSZip.loadAsync(buffer);
			const zipFile = zipData.file(`${this.name}.json`)
			if (zipFile) {
				const content = await zipFile.async('string');
				const data: any[] = JSON.parse(content);
				console.warn(`${this.name}.json  >>>> dados encontrados <<<<`);
				return data;
			} else {
				console.warn(`${this.name}.json `, '>>>> não existe arquivo <<<<');
				return [];
			}
		} catch (error) {
			const data: any[] = [];
			if (!existsSync(`${userHomeDir}/temp/dota`)) {
				await mkdir(`${userHomeDir}/temp/dota`);
			}
			await this.writeFile(data);
			console.warn(`${this.name}.json `, '>>>> não existe arquivo <<<<');
			return data;
		} finally {
			console.log("read time ", (Date.now() - timeNow) / 1000, 's');
		}
	}


	async check(_function: Function, params?: any): Promise<any[]> {
		const timeNow = Date.now();
		let data = await this.read() as any[];

		if (data.length === 0) {
			console.warn(">>>> Revalidate single start <<<<");
			data = await _function(params);
			await this.writeFile(data);
		}
		if ((timeNow - this.timeStart) >= this.revalidateTime) {
			console.warn('update Data');
			_function(params).then((_data: any) => {
				this.writeFile(_data);
				this.timeStart = Date.now();
			});
		}
		console.log("Revalidate ", (timeNow - this.timeStart) >= this.revalidateTime, this.name, ((timeNow - this.timeStart) / 1000).toFixed(2), '/', this.revalidateTime / 1000, 's');
		return data;
	}
}
