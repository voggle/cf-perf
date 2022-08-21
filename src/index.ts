import { newArray, randomHexString } from "./datagen";
import { Timer } from "./timer";

interface Env {
	KV: KVNamespace;
	// TODO: DurableObjectNamespace;
	// TODO: R2Bucket;	
}

async function run<T>(id: string, input: T[], iteration: (input: T, index: number) => Promise<unknown>, parallel?: boolean): Promise<Timer> {
	const t = new Timer(id);
	if (parallel) {
		t.start();
		const ps: Promise<unknown>[] = [];
		for (let i = 0; i < input.length; i++) {
			ps.push(iteration(input[i], i));
		}
		await Promise.all(ps);
		t.end();
	} else {
		for (let i = 0; i < input.length; i++) {
			t.start();
			await iteration(input[i], i);
			t.end();
		}
	}
	return t;
}

function parseIntParam(url: URL, name: string, defVal: number): number {
	const r = Number(url.searchParams.get(name));
	return Number.isInteger(r) && r > 0 ? r : defVal;
}

export default {
	async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(req.url);
		const repeat = parseIntParam(url, "r", 4);
		const valLen = parseIntParam(url, "v", 1024);
		const keyLen = parseIntParam(url, "k", 16);
		const val = randomHexString(valLen);
		const keys = newArray(repeat, _ => randomHexString(keyLen));

		let res: Timer[] = [];
		res.push(await run("kv-read-miss", keys, async (input: string) => await env.KV.get(input)));
		res.push(await run("kv-write", keys, async (input: string) => await env.KV.put(input, val)));
		res.push(await run("kv-write-parallel", keys, async (input: string) => await env.KV.put(input, val), true));
		res.push(await run("kv-read-hit", keys, async (input: string) => await env.KV.get(input)));
		res.push(await run("kv-read-hit-parallel", keys, async (input: string) => await env.KV.get(input), true));
		res.push(await run("kv-list", keys, async () => await env.KV.list()));
		res.push(await run("kv-list-prefix", keys, async () => await env.KV.list({prefix: randomHexString(4)})));
		res.push(await run("kv-delete", keys, async (input: string) => await env.KV.delete(input)));
	
		return new Response(`repeat=${repeat}\nkeyLen=${keyLen}\nvalLen=${valLen}\n${res.join("\n")}`,
				{ headers: { "content-type": "text/plain" } });
	},
};
